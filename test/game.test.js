'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
    EMPTY, BLACK, WHITE, BOARD_SIZE,
    getValidMoves, getFlippablePieces, getResultingBoard,
} = require('../github_action/game');

function emptyBoard() {
    return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY));
}

function initialBoard() {
    const board = emptyBoard();
    board[3][3] = WHITE;
    board[4][4] = WHITE;
    board[3][4] = BLACK;
    board[4][3] = BLACK;
    return board;
}

function sortMoves(moves) {
    return moves.map((m) => `${m.row},${m.col}`).sort();
}

test('initial board offers the four standard moves to Black', () => {
    const moves = getValidMoves(initialBoard(), BLACK);
    // d3, c4, f5, e6 -> (row, col)
    assert.deepEqual(sortMoves(moves), ['2,3', '3,2', '4,5', '5,4']);
});

test('initial board offers the four mirrored moves to White', () => {
    const moves = getValidMoves(initialBoard(), WHITE);
    // e3, f4, c5, d6 -> (row, col)
    assert.deepEqual(sortMoves(moves), ['2,4', '3,5', '4,2', '5,3']);
});

test('getValidMoves returns empty for a falsy player', () => {
    assert.deepEqual(getValidMoves(initialBoard(), 0), []);
});

test('getFlippablePieces finds the pieces flipped by a move', () => {
    const flips = getFlippablePieces(initialBoard(), BLACK, 3, 2); // c4
    assert.deepEqual(flips, [{ row: 3, col: 3 }]);
});

test('getResultingBoard places the piece and flips the line', () => {
    const board = getResultingBoard(initialBoard(), BLACK, 3, 2); // c4
    assert.equal(board[3][2], BLACK);
    assert.equal(board[3][3], BLACK);
    assert.equal(board[4][4], WHITE, 'unrelated pieces must be untouched');
});

test('getResultingBoard does not mutate the original board', () => {
    const board = initialBoard();
    getResultingBoard(board, BLACK, 3, 2);
    assert.equal(board[3][2], EMPTY);
    assert.equal(board[3][3], WHITE);
});

test('getResultingBoard returns null for an empty cell that flips nothing', () => {
    assert.equal(getResultingBoard(initialBoard(), BLACK, 0, 0), null);
});
