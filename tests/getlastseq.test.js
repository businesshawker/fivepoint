const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html_path = path.join(__dirname, '..', 'src', 'fivepoint.html');
const content = fs.readFileSync(html_path, 'utf8');

function extract(name) {
  const lines = content.split('\n');
  const start_index = lines.findIndex(l => l.includes(name));
  let brace_count = 0;
  let end_index = start_index;
  for (let i = start_index; i < lines.length; i++) {
    brace_count += (lines[i].match(/{/g) || []).length;
    brace_count -= (lines[i].match(/}/g) || []).length;
    if (brace_count === 0 && i > start_index) { end_index = i; break; }
  }
  return lines.slice(start_index, end_index + 1).join('\n');
}

const code = extract('async function getLastSeqNumber');
const getLastSeqNumber = eval(`(() => {${code}; return getLastSeqNumber;})()`);

async function runSeq(names) {
  global.files = names.map(n => ({ name: n }));
  global.loadFiles = async () => {};
  return await getLastSeqNumber();
}

test('getLastSeqNumber 正常系: 最大通番を取得', async () => {
  const result = await runSeq(['0-00001.jpg', '1-00020.png', '2-00005.jpg']);
  assert.strictEqual(result, 20);
});

test('getLastSeqNumber 異常系: 命名規則に合わないファイルのみで -1 を返す', async () => {
  const result = await runSeq(['sample.jpg', '1-abcde.jpg']);
  assert.strictEqual(result, -1);
});

test('getLastSeqNumber 境界値: ファイルが一つもない', async () => {
  const result = await runSeq([]);
  assert.strictEqual(result, -1);
});
