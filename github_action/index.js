
const fs = require('fs');
const path = require('path');
const { BLACK, WHITE, EMPTY, BOARD_SIZE, getValidMoves, getResultingBoard } = require('./game');
const { createNNAI } = require('./ai');
const { renderMarkdownBoard } = require('./renderer');
const { parseCommand } = require('./validate');

const STATE_FILE = 'othello-state.json';
const MODEL_PATH = path.join(__dirname, '../models/cnn_model.onnx');
const README_FILE = 'README.md';
// Written only with an already-validated label; the workflow uses it to build
// the commit message without ever interpolating the raw issue title.
const MOVE_LABEL_FILE = '.othello-move';

function initGame() {
    const board = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(EMPTY));
    board[3][3] = WHITE;
    board[4][4] = WHITE;
    board[3][4] = BLACK;
    board[4][3] = BLACK;
    return {
        board,
        currentPlayer: BLACK,
        gameOver: false,
        message: 'Game Start!'
    };
}

async function main() {
    const args = process.argv.slice(2);
    // Usage: node index.js --repo owner/repo --title "othello:move:c4"
    
    let repo = '';
    let title = '';
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--repo') repo = args[i+1];
        if (args[i] === '--title') title = args[i+1];
    }

    if (!repo) {
        console.error("Repo name required (--repo)");
        process.exit(1);
    }

    // Issue titles are attacker-controlled, so only the exact allow-listed
    // commands are accepted. Anything else is ignored without touching state.
    const command = parseCommand(title);
    if (command.type === 'invalid') {
        console.error(`Ignoring issue with unsupported title: ${JSON.stringify(title)}`);
        return;
    }

    let state;
    if (fs.existsSync(STATE_FILE)) {
        state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } else {
        state = initGame();
    }

    // Handle Reset
    if (command.type === 'reset') {
        state = initGame();
        state.message = "Game Reset!";
    }
    // Handle Move
    // e.g. "othello:move:c4"
    if (command.type === 'move') {
        const { move, moveStr } = command;

        // Attempt Human Move
        if (!state.gameOver && state.currentPlayer === BLACK) { // Assuming Human is Black
             const valid = getValidMoves(state.board, state.currentPlayer);
             const isValid = valid.some(m => m.row === move.row && m.col === move.col);

             if (isValid) {
                 state.board = getResultingBoard(state.board, state.currentPlayer, move.row, move.col);
                 state.currentPlayer = WHITE;
                 state.message = `You played ${moveStr}.`;
             } else {
                 console.log(`Invalid move attempted: ${moveStr}`);
             }
        }
    }

    // Main Game Loop (Handle AI and Passes)
    // Run until it's Human's turn and Human has moves, or Game Over.
    let turnActive = true;
    while (turnActive && !state.gameOver) {
        turnActive = false; // Default to stop unless an action occurs

        const blackMoves = getValidMoves(state.board, BLACK);
        const whiteMoves = getValidMoves(state.board, WHITE);

        if (blackMoves.length === 0 && whiteMoves.length === 0) {
            state.gameOver = true;
            state.message = "Game Over! Both sides stuck.";
            break;
        }

        if (state.currentPlayer === WHITE) { // AI Turn
            if (whiteMoves.length > 0) {
                // AI Moves
                const ai = await createNNAI(MODEL_PATH);
                if (ai) {
                    const aiMove = await ai.findBestMove(state.board, WHITE);
                    if (aiMove) {
                        state.board = getResultingBoard(state.board, WHITE, aiMove.row, aiMove.col);
                        const aiMoveStr = `${String.fromCharCode('a'.charCodeAt(0) + aiMove.col)}${aiMove.row + 1}`;
                        state.message += ` AI played ${aiMoveStr}.`;
                        state.currentPlayer = BLACK;
                        turnActive = true; // Loop to check if Black can move
                    }
                }
            } else {
                // AI Pass
                state.message += " AI passed.";
                state.currentPlayer = BLACK;
                turnActive = true; // Check if Black can move
            }
        } else { // Black (Human) Turn
            if (blackMoves.length === 0) {
                // Human Pass (Auto-pass because no moves)
                state.message += " You have no moves. Passing to AI.";
                state.currentPlayer = WHITE;
                turnActive = true; // Loop so AI can move immediately
            } else {
                // Human has moves. Wait for input.
                // turnActive = false;
            }
        }
    }

    // Recalculate valid moves for display
    const validMoves = state.gameOver ? [] : getValidMoves(state.board, state.currentPlayer);

    // Render Markdown
    const markdownBoard = renderMarkdownBoard(state.board, validMoves, repo);
    
    // Calculate Score
    let blackScore = 0, whiteScore = 0;
    state.board.forEach(r => r.forEach(c => { if(c===BLACK) blackScore++; if(c===WHITE) whiteScore++; }));

    const statusObj = `
**Score**: Black (You) ${blackScore} - ${whiteScore} White (AI)
**Turn**: ${state.gameOver ? "Game Over" : (state.currentPlayer === BLACK ? "Your Turn (Black)" : "AI's Turn (White)")}
**Message**: ${state.message}

[🔄 Reset Game](https://github.com/${repo}/issues/new?title=othello:reset&body=Trigger+reset)
`;

    const fullContent = `${statusObj}\n\n${markdownBoard}`;

    // Update README
    if (fs.existsSync(README_FILE)) {
        let readme = fs.readFileSync(README_FILE, 'utf8');
        const startTag = '<!-- OTHELLO_START -->';
        const endTag = '<!-- OTHELLO_END -->';
        
        const startIndex = readme.indexOf(startTag);
        const endIndex = readme.indexOf(endTag);
        
        if (startIndex !== -1 && endIndex !== -1) {
            const newReadme = readme.substring(0, startIndex + startTag.length) + 
                              '\n' + fullContent + '\n' + 
                              readme.substring(endIndex);
            fs.writeFileSync(README_FILE, newReadme);
        } else {
             // Append if not found
             fs.writeFileSync(README_FILE, readme + `\n${startTag}\n${fullContent}\n${endTag}`);
        }
    } else {
        fs.writeFileSync(README_FILE, `<!-- OTHELLO_START -->\n${fullContent}\n<!-- OTHELLO_END -->`);
    }

    // Save state
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

    // Emit the validated label for the workflow commit message. The workflow
    // reads this file instead of interpolating the raw issue title.
    const label = command.type === 'move' ? command.moveStr : 'reset';
    fs.writeFileSync(MOVE_LABEL_FILE, `${label}\n`);
}

if (require.main === module) {
    main().catch((err) => {
        console.error(err);
        process.exitCode = 1;
    });
}

module.exports = { initGame, main };
