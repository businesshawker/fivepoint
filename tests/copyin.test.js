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

let files = [];
let dirHandle = null;
let created_names = [];
async function loadFiles() { files = files.concat(created_names.map(n => ({ name: n }))); }
async function verifyPerms() { return true; }
function selectIndex() {}

const code = [
  extract('class FileNameUtils'),
  extract('async function getLastSeqNumber'),
  extract('async function copyInWithSequence')
].join('\n');

const { FileNameUtils, copyInWithSequence } = eval(`(() => {${code}; return { FileNameUtils, copyInWithSequence }; })()`);

async function runCopy(existing_names, drop_names) {
  files = existing_names.map(n => ({ name: n }));
  created_names = [];
  dirHandle = {
    async removeEntry() {},
    async getFileHandle(name) {
      created_names.push(name);
      return { createWritable: async () => ({ write: async () => {}, close: async () => {} }) };
    }
  };
  const file_objects = drop_names.map(n => ({ name: n, async arrayBuffer() { return new ArrayBuffer(0); } }));
  await copyInWithSequence(file_objects);
  return created_names.slice();
}

test('copyInWithSequence 正常系: 命名規則のファイルは評価を維持して通番採番', async () => {
  const result = await runCopy(['2-00005.jpg'], ['3-12345.png', '1-22222.jpg']);
  assert.deepStrictEqual(result, ['3-00006.png', '1-00007.jpg']);
});

test('copyInWithSequence 異常系: 命名規則に合わないファイルは評価0で通番採番', async () => {
  const result = await runCopy(['2-00005.jpg'], ['sample.png']);
  assert.deepStrictEqual(result, ['0-00006.png']);
});

test('copyInWithSequence 境界値: 通番なしのフォルダで0から採番', async () => {
  const result = await runCopy([], ['4-00001.jpg']);
  assert.deepStrictEqual(result, ['4-00000.jpg']);
});
