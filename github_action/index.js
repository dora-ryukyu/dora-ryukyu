
const fs = require('fs');
const path = require('path');
const { BLACK, WHITE, EMPTY, BOARD_SIZE, getValidMoves, getResultingBoard } = require('./game');
const { createNNAI } = require('./ai');
const { renderMarkdownBoard } = require('./renderer');

const STATE_FILE = 'othello-state.json';
const MODEL_PATH = path.join(__dirname, '../models/cnn_model.onnx');
const README_FILE = 'README.md';

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

function parseMove(moveStr) {
    // e.g. "c4"
    if (!moveStr || moveStr.length < 2) return null;
    const col = moveStr.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = parseInt(moveStr.substring(1)) - 1;
    if (col >= 0 && col < BOARD_SIZE && row >= 0 && row < BOARD_SIZE) {
        return { row, col };
    }
    return null;
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

    let state;
    if (fs.existsSync(STATE_FILE)) {
        state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } else {
        state = initGame();
    }

    // Handle Reset
    if (title.includes('othello:reset')) {
        state = initGame();
        state.message = "Game Reset!";
    } 
    // Handle Move
    // e.g. "othello:move:c4"
    if (title.includes('othello:move:')) {
        const movePart = title.split('othello:move:')[1].trim().toLowerCase();
        const move = parseMove(movePart);
        
        // Attempt Human Move
        if (move && !state.gameOver && state.currentPlayer === BLACK) { // Assuming Human is Black
             const valid = getValidMoves(state.board, state.currentPlayer);
             const isValid = valid.some(m => m.row === move.row && m.col === move.col);
             
             if (isValid) {
                 state.board = getResultingBoard(state.board, state.currentPlayer, move.row, move.col);
                 state.currentPlayer = WHITE;
                 state.message = `You played ${movePart}.`;
             } else {
                 console.log("Invalid move attempted");
                 // Should probably not update state, but maybe log it?
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
}

main().catch(console.error);
