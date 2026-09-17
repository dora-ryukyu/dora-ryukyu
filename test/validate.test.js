'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseMove, parseCommand } = require('../github_action/validate');

test('parseMove accepts only exact board coordinates', () => {
    assert.deepEqual(parseMove('a1'), { row: 0, col: 0 });
    assert.deepEqual(parseMove('c4'), { row: 3, col: 2 });
    assert.deepEqual(parseMove('h8'), { row: 7, col: 7 });
    assert.deepEqual(parseMove('C4'), { row: 3, col: 2 });

    assert.equal(parseMove('c9'), null);
    assert.equal(parseMove('i1'), null);
    assert.equal(parseMove('c'), null);
    assert.equal(parseMove('c40'), null);
    assert.equal(parseMove('c4;'), null);
    assert.equal(parseMove(''), null);
});

test('parseCommand accepts the allow-listed commands', () => {
    assert.deepEqual(parseCommand('othello:move:c4'), {
        type: 'move',
        moveStr: 'c4',
        move: { row: 3, col: 2 },
    });
    assert.deepEqual(parseCommand('  othello:move:C4  '), {
        type: 'move',
        moveStr: 'c4',
        move: { row: 3, col: 2 },
    });
    assert.deepEqual(parseCommand('othello:reset'), { type: 'reset' });
});

test('parseCommand rejects malformed or non-command titles', () => {
    const invalid = [
        '',
        'othello:',
        'othello:move:',
        'othello:move:c9',
        'othello:move:i1',
        'othello:move:c4 extra',
        'othello:move:c4;',
        'hello world',
    ];
    for (const title of invalid) {
        assert.deepEqual(parseCommand(title), { type: 'invalid' }, `title: ${JSON.stringify(title)}`);
    }
});

test('parseCommand rejects shell injection attempts', () => {
    const payloads = [
        'othello:move:c4"; touch /tmp/pwned; echo "',
        'othello:move:c4$(whoami)',
        'othello:move:c4`id`',
        'othello:move:c4 && curl http://example.com',
        'othello:move:c4\nrm -rf /',
        'othello:move:c4 | cat /etc/passwd',
        'othello:reset; whoami',
        'othello:reset$(whoami)',
    ];
    for (const title of payloads) {
        assert.deepEqual(parseCommand(title), { type: 'invalid' }, `payload: ${JSON.stringify(title)}`);
    }
});

test('parseCommand tolerates non-string input', () => {
    assert.deepEqual(parseCommand(null), { type: 'invalid' });
    assert.deepEqual(parseCommand(undefined), { type: 'invalid' });
    assert.deepEqual(parseCommand(42), { type: 'invalid' });
});
