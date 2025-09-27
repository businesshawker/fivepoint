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

const code = [
  extract('class FileNameUtils'),
  extract('async function changeRating')
].join('\n');

const { FileNameUtils, changeRating } = eval(`(() => {${code}; return { FileNameUtils, changeRating };})()`);

let rename_args;
let render_called;
let selected_index;

function setup_env(file_names) {
  rename_args = null;
  render_called = false;
  selected_index = null;
  global.files = file_names.map(n => ({ name: n, handle: { name: n } }));
  global.currentIndex = 0;
  global.renderThumbs = () => { render_called = true; };
  global.selectIndex = i => { selected_index = i; };
  global.renameFile = async (handle, new_name) => {
    rename_args = [handle, new_name];
    if (handle.name === new_name) {
      return handle;
    }
    return { name: new_name };
  };
}

test('changeRating 正常系: 評価付きファイルを別評価にリネームして並び替える', async () => {
  setup_env(['2-00001.jpg', '1-00002.jpg']);
  await changeRating(5);
  assert.deepStrictEqual(rename_args, [{ name: '2-00001.jpg' }, '5-00001.jpg']);
  assert.strictEqual(files[1].name, '5-00001.jpg');
  assert.ok(render_called);
  assert.strictEqual(selected_index, 0);
});

test('changeRating 異常系: currentIndex が負なら何もしない', async () => {
  setup_env(['1-00001.jpg']);
  global.currentIndex = -1;
  await changeRating(3);
  assert.strictEqual(rename_args, null);
  assert.ok(!render_called);
  assert.strictEqual(selected_index, null);
  assert.strictEqual(files[0].name, '1-00001.jpg');
});

test('changeRating 境界値: 未フォーマット名を評価付きにリネームする', async () => {
  setup_env(['sample.png', '1-00001.jpg']);
  await changeRating(4);
  assert.deepStrictEqual(rename_args, [{ name: 'sample.png' }, '4-sample.png']);
  assert.strictEqual(files[1].name, '4-sample.png');
  assert.ok(render_called);
  assert.strictEqual(selected_index, 0);
});

test('changeRating リグレッション: 同じ評価キーでファイルが消えない', async () => {
  setup_env(['5-00001.jpg']);
  await changeRating(5);
  assert.deepStrictEqual(rename_args, [{ name: '5-00001.jpg' }, '5-00001.jpg']);
  assert.strictEqual(files.length, 1);
  assert.strictEqual(files[0].name, '5-00001.jpg');
});
