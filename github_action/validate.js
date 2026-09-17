'use strict';

// Security-critical parsing of untrusted issue titles.
// Issue titles can be created by anyone, so they must never be passed to a
// shell or a git commit message without strict allow-list validation.

const BOARD_SIZE = 8;

// Only these exact forms are accepted (surrounding whitespace is trimmed):
//   othello:move:<a-h><1-8>   e.g. "othello:move:c4"
//   othello:reset
const MOVE_TITLE_RE = /^othello:move:([a-h][1-8])$/i;
const RESET_TITLE_RE = /^othello:reset$/i;

/**
 * Parse a board coordinate such as "c4" into { row, col }.
 * Returns null when the string is not a valid board coordinate.
 */
function parseMove(moveStr) {
    if (typeof moveStr !== 'string' || !/^[a-h][1-8]$/i.test(moveStr)) return null;
    const normalized = moveStr.toLowerCase();
    const col = normalized.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = parseInt(normalized[1], 10) - 1;
    if (col >= 0 && col < BOARD_SIZE && row >= 0 && row < BOARD_SIZE) {
        return { row, col };
    }
    return null;
}

/**
 * Classify an untrusted issue title.
 * Returns one of:
 *   { type: 'move', moveStr: 'c4', move: { row, col } }
 *   { type: 'reset' }
 *   { type: 'invalid' }
 */
function parseCommand(rawTitle) {
    const title = typeof rawTitle === 'string' ? rawTitle.trim() : '';

    if (RESET_TITLE_RE.test(title)) {
        return { type: 'reset' };
    }

    const match = MOVE_TITLE_RE.exec(title);
    if (match) {
        const moveStr = match[1].toLowerCase();
        const move = parseMove(moveStr);
        if (move) {
            return { type: 'move', moveStr, move };
        }
    }

    return { type: 'invalid' };
}

module.exports = { BOARD_SIZE, parseMove, parseCommand };
