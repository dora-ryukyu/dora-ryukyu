
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;
const BOARD_SIZE = 8;
const DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1]
];

function getValidMoves(targetBoard, player) {
    const validMoves = [];
    if (!player) return validMoves;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (targetBoard[r][c] === EMPTY) {
                if (getFlippablePieces(targetBoard, player, r, c).length > 0) {
                    validMoves.push({ row: r, col: c });
                }
            }
        }
    }
    return validMoves;
}

function getFlippablePieces(targetBoard, player, row, col) {
    const opponent = player === BLACK ? WHITE : BLACK;
    let piecesToFlip = [];
    DIRECTIONS.forEach(([dr, dc]) => {
        let currentLine = [];
        let r = row + dr;
        let c = col + dc;
        while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
            if (targetBoard[r][c] === opponent) {
                currentLine.push({ row: r, col: c });
            } else if (targetBoard[r][c] === player) {
                piecesToFlip = piecesToFlip.concat(currentLine);
                break;
            } else {
                break;
            }
            r += dr;
            c += dc;
        }
    });
    return piecesToFlip;
}

function getResultingBoard(originalBoard, player, row, col) {
    const piecesToFlip = getFlippablePieces(originalBoard, player, row, col);
    if (piecesToFlip.length === 0 && originalBoard[row][col] === EMPTY) {
        return null;
    }
    // Deep clone
    const newBoard = JSON.parse(JSON.stringify(originalBoard));
    newBoard[row][col] = player;
    piecesToFlip.forEach(p => {
        newBoard[p.row][p.col] = player;
    });
    return newBoard;
}

module.exports = {
    EMPTY, BLACK, WHITE, BOARD_SIZE,
    getValidMoves, getFlippablePieces, getResultingBoard
};
