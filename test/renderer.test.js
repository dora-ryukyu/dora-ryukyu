'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { EMPTY, BLACK, WHITE, BOARD_SIZE, getValidMoves } = require('../github_action/game');
const { renderMarkdownBoard } = require('../github_action/renderer');

function initialBoard() {
    const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY));
    board[3][3] = WHITE;
    board[4][4] = WHITE;
    board[3][4] = BLACK;
    board[4][3] = BLACK;
    return board;
}

test('renderMarkdownBoard produces a header plus eight rows', () => {
    const board = initialBoard();
    const md = renderMarkdownBoard(board, [], 'dora-ryukyu/dora-ryukyu');
    assert.match(md, /^\| \| a \| b \| c \| d \| e \| f \| g \| h \|\n/);
    assert.equal(md.trimEnd().split('\n').length, 10); // header + separator + 8 rows
});

test('renderMarkdownBoard links every valid move to a new issue', () => {
    const board = initialBoard();
    const moves = getValidMoves(board, BLACK);
    const md = renderMarkdownBoard(board, moves, 'dora-ryukyu/dora-ryukyu');

    assert.equal((md.match(/issues\/new\?title=othello:move:/g) || []).length, moves.length);
    assert.ok(md.includes('othello:move:c4'), 'c4 should be a clickable move');
    assert.ok(md.includes('https://github.com/dora-ryukyu/dora-ryukyu/issues/new'));
});

test('renderMarkdownBoard shows pieces with the expected symbols', () => {
    const board = initialBoard();
    const md = renderMarkdownBoard(board, [], 'x/y');
    assert.equal((md.match(/⚫/g) || []).length, 2);
    assert.equal((md.match(/⚪/g) || []).length, 2);
});
