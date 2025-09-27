const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const manualPath = path.join(__dirname, '..', 'manual.html');
const content = fs.readFileSync(manualPath, 'utf8');

test('操作説明書に進捗オーバーレイが記載されている', () => {
  assert.match(content, /進捗オーバーレイ/);
});

test('操作説明書にエラーに関する記述が含まれていない', () => {
  assert.ok(!content.includes('エラー'));
});
