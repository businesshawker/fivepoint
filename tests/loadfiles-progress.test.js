const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html_path = path.join(__dirname, '..', 'src', 'fivepoint.html');
const content = fs.readFileSync(html_path, 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('async function loadFiles'));
let brace = 0;
let end = start;
for (let i = start; i < lines.length; i++) {
  brace += (lines[i].match(/{/g) || []).length;
  brace -= (lines[i].match(/}/g) || []).length;
  if (brace === 0 && i > start) { end = i; break; }
}
const body = lines.slice(start, end + 1).join('\n');

test('loadFiles 異常系: 命名規則違反のファイル処理で progress.run を呼び出す', () => {
  assert.ok(body.includes('progress.run'));
});
