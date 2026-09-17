'use strict';

const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const WORKFLOW_PATH = path.join(__dirname, '..', '.github', 'workflows', 'othello.yml');
const workflow = fs.readFileSync(WORKFLOW_PATH, 'utf8');

/** Collect the body of every `run:` step (both block and inline forms). */
function extractRunBlocks(text) {
    const lines = text.split('\n');
    const blocks = [];
    for (let i = 0; i < lines.length; i++) {
        const block = /^(\s*)run:\s*\|-?\s*$/.exec(lines[i]);
        if (block) {
            const indent = block[1].length;
            const body = [];
            let j = i + 1;
            for (; j < lines.length; j++) {
                const line = lines[j];
                if (line.trim() === '') {
                    body.push(line);
                    continue;
                }
                const lineIndent = line.length - line.trimStart().length;
                if (lineIndent <= indent) break;
                body.push(line);
            }
            blocks.push(body.join('\n'));
            i = j - 1;
            continue;
        }
        const inline = /^\s*run:\s*(\S.*)$/.exec(lines[i]);
        if (inline) blocks.push(inline[1]);
    }
    return blocks;
}

const runBlocks = extractRunBlocks(workflow);

test('the workflow has run steps to check', () => {
    assert.ok(runBlocks.length >= 3, `expected several run steps, found ${runBlocks.length}`);
});

test('no run step interpolates untrusted GitHub context', () => {
    for (const block of runBlocks) {
        assert.ok(!block.includes('${{'), `run step must not contain expressions:\n${block}`);
    }
});

test('no run step references the raw issue title', () => {
    for (const block of runBlocks) {
        assert.ok(!block.includes('github.event.issue.title'), `run step leaked issue title:\n${block}`);
    }
});

test('the issue title is passed through the environment', () => {
    assert.ok(workflow.includes('ISSUE_TITLE: ${{ github.event.issue.title }}'));
    assert.ok(!workflow.includes('--title "${{'));
});

test('only the repository owner can trigger the workflow', () => {
    assert.ok(workflow.includes('github.event.issue.user.login == github.repository_owner'));
});

test('the commit message is built from the validated label file', () => {
    assert.ok(workflow.includes('cat .othello-move'));
    assert.ok(workflow.includes('git commit -m "Moves: $MOVE_LABEL"'));
    assert.ok(!workflow.includes('git commit -m "Moves: ${{'));
});

test('actions and Node runtime are current', () => {
    assert.ok(workflow.includes('actions/checkout@v4'));
    assert.ok(workflow.includes('actions/setup-node@v4'));
    assert.ok(workflow.includes('node-version: 20'));
    assert.ok(!workflow.includes('@v3'));
});

test('permissions are limited to contents and issues write', () => {
    assert.match(workflow, /permissions:\n\s+contents: write\n\s+issues: write/);
});
