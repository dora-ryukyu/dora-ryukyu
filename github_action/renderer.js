
const { BOARD_SIZE, BLACK, WHITE, EMPTY, getValidMoves } = require('./game');

/**
 * Generates an SVG representation of the Othello board.
 * @param {Array<Array<number>>} board 
 * @param {Array<object>} validMoves 
 * @param {string} repoName - "owner/repo"
 * @returns {string} SVG string
 */
function renderBoard(board, validMoves, repoName, lastMove) {
    const cellSize = 60;
    const padding = 20; // Extra space for coordinates
    const width = BOARD_SIZE * cellSize + padding * 2;
    const height = BOARD_SIZE * cellSize + padding * 2;
    
    // Background
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
    svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="#2e2e2e" />`; // Outer background
    svg += `<rect x="${padding}" y="${padding}" width="${BOARD_SIZE * cellSize}" height="${BOARD_SIZE * cellSize}" fill="#008000" stroke="#333" stroke-width="4"/>`;

    // Grid lines
    for (let i = 1; i < BOARD_SIZE; i++) {
        const d = padding + i * cellSize;
        svg += `<line x1="${padding}" y1="${d}" x2="${width - padding}" y2="${d}" stroke="#333" stroke-width="2"/>`;
        svg += `<line x1="${d}" y1="${padding}" x2="${d}" y2="${height - padding}" stroke="#333" stroke-width="2"/>`;
    }

    // Coordinates (optional, but good for UX)
    const letters = ['a','b','c','d','e','f','g','h'];
    for(let i=0; i<8; i++) {
        // Top letters
        svg += `<text x="${padding + i*cellSize + cellSize/2}" y="${padding - 5}" text-anchor="middle" fill="#ccc" font-size="14" font-family="monospace">${letters[i]}</text>`;
        // Left numbers
        svg += `<text x="${padding - 5}" y="${padding + i*cellSize + cellSize/2 + 5}" text-anchor="end" fill="#ccc" font-size="14" font-family="monospace">${i+1}</text>`;
    }

    // Pieces
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const cellX = padding + c * cellSize;
            const cellY = padding + r * cellSize;
            const cx = cellX + cellSize / 2;
            const cy = cellY + cellSize / 2;
            const rVal = cellSize * 0.4;
            
            if (board[r][c] === BLACK) {
                svg += `<circle cx="${cx}" cy="${cy}" r="${rVal}" fill="black" stroke="none" />`;
            } else if (board[r][c] === WHITE) {
                svg += `<circle cx="${cx}" cy="${cy}" r="${rVal}" fill="white" stroke="none" />`;
            }
        }
    }

    svg += `</svg>`;
    return svg;
}

/**
 * Generates a Markdown table representation of the board with links.
 * @param {Array<Array<number>>} board 
 * @param {Array<object>} validMoves 
 * @param {string} repoName 
 * @returns {string} Markdown string
 */
function renderMarkdownBoard(board, validMoves, repoName) {
    const letters = ['a','b','c','d','e','f','g','h'];
    let md = '| | a | b | c | d | e | f | g | h |\n';
    md += '|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|\n';

    for (let r = 0; r < BOARD_SIZE; r++) {
        md += `| **${r + 1}** |`;
        for (let c = 0; c < BOARD_SIZE; c++) {
            const cell = board[r][c];
            let symbol = '🟩'; // Empty green square
            
            if (cell === BLACK) symbol = '⚫';
            else if (cell === WHITE) symbol = '⚪';
            
            // Check if valid move
            const move = validMoves.find(m => m.row === r && m.col === c);
            if (move) {
                 const colStr = letters[c];
                 const rowStr = r + 1;
                 const moveStr = `${colStr}${rowStr}`;
                 // Using issue link. Note: title and body must be URL encoded if simple string, but mostly handled by browser.
                 // We use a simpler format for the title to be parsed easily: "othello:move:c4"
                 const link = `https://github.com/${repoName}/issues/new?title=othello:move:${moveStr}&body=Just+push+Submit+to+play+${moveStr}.`;
                 symbol = `[✨](${link})`; 
            }

            md += ` ${symbol} |`;
        }
        md += '\n';
    }
    return md;
}

module.exports = { renderBoard, renderMarkdownBoard };
