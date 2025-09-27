const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html_path = path.join(__dirname, '..', 'src', 'fivepoint.html');
const content = fs.readFileSync(html_path, 'utf8');
const lines = content.split('\n');
const classLine = lines.findIndex(l => l.includes('class Progress'));
let brace = 0;
let end = classLine;
for (let i = classLine; i < lines.length; i++) {
  brace += (lines[i].match(/{/g) || []).length;
  brace -= (lines[i].match(/}/g) || []).length;
  if (brace === 0 && i > classLine) { end = i; break; }
}
const code = lines
  .slice(classLine, end + 1)
  .filter(l => !l.includes('progressOverlay') && !l.includes('progressText'))
  .join('\n');

const { Progress } = eval('(() => {\n' + code + '\nreturn { Progress };\n})()');

function createProgress() {
  const overlay = {
    classList: {
      items: [],
      add(c) { if (!this.items.includes(c)) this.items.push(c); },
      remove(c) { this.items = this.items.filter(x => x !== c); },
      contains(c) { return this.items.includes(c); }
    }
  };
  const text = { textContent: '' };
  return { prog: new Progress(overlay, text), overlay, text };
}

global.document = { activeElement: { blur: () => {} } };

test('Progress.isActive 初期状態は false', () => {
  const { prog } = createProgress();
  assert.strictEqual(prog.isActive(), false);
});

test('Progress.show 正常系: 合計を設定し進捗を表示する', () => {
  const { prog, overlay, text } = createProgress();
  let blurred = false;
  document.activeElement = { blur: () => { blurred = true; } };
  prog.show(5);
  assert.strictEqual(prog.isActive(), true);
  assert.ok(overlay.classList.contains('show'));
  assert.strictEqual(text.textContent, '0 / 5');
  assert.ok(blurred);
});

test('Progress.show 異常系: 数値以外を渡しても表示される', () => {
  const { prog, overlay, text } = createProgress();
  prog.show('abc');
  assert.strictEqual(prog.isActive(), true);
  assert.ok(overlay.classList.contains('show'));
  assert.strictEqual(text.textContent, '0 / abc');
});

test('Progress.show 境界値: 0件を渡す', () => {
  const { prog, text } = createProgress();
  prog.show(0);
  assert.strictEqual(prog.isActive(), true);
  assert.strictEqual(text.textContent, '0 / 0');
});

test('Progress.update 正常系: 進捗を更新する', () => {
  const { prog, text } = createProgress();
  prog.update(3, 10);
  assert.strictEqual(text.textContent, '3 / 10');
});

test('Progress.update 異常系: 数値以外を渡す', () => {
  const { prog, text } = createProgress();
  prog.update('x', 5);
  assert.strictEqual(text.textContent, 'x / 5');
});

test('Progress.update 境界値: 全件完了', () => {
  const { prog, text } = createProgress();
  prog.update(10, 10);
  assert.strictEqual(text.textContent, '10 / 10');
});

test('Progress.hide 正常系: 表示中の進捗を隠す', () => {
  const { prog, overlay } = createProgress();
  prog.show(1);
  overlay.classList.add('show');
  prog.hide();
  assert.strictEqual(prog.isActive(), false);
  assert.ok(!overlay.classList.contains('show'));
});

test('Progress.hide 異常系: 非表示状態で呼び出しても問題ない', () => {
  const { prog, overlay } = createProgress();
  overlay.classList.remove('show');
  prog.hide();
  assert.strictEqual(prog.isActive(), false);
  assert.ok(!overlay.classList.contains('show'));
});

test('Progress.hide 境界値: 連続で呼び出しても状態は変わらない', () => {
  const { prog, overlay } = createProgress();
  prog.show(1);
  overlay.classList.add('show');
  prog.hide();
  prog.hide();
  assert.strictEqual(prog.isActive(), false);
  assert.ok(!overlay.classList.contains('show'));
});

test('Progress.run 正常系: showとhideでラップし結果を返す', async () => {
  const { prog, overlay } = createProgress();
  const result = await prog.run(2, async () => 42);
  assert.strictEqual(result, 42);
  assert.ok(!overlay.classList.contains('show'));
});

test('Progress.run 異常系: 例外でもhideされる', async () => {
  const { prog, overlay } = createProgress();
  await assert.rejects(() => prog.run(1, async () => { throw new Error('x'); }));
  assert.ok(!overlay.classList.contains('show'));
});

test('Progress.run 境界値: total=0で呼び出し', async () => {
  const { prog, overlay, text } = createProgress();
  await prog.run(0, async () => {});
  assert.strictEqual(text.textContent, '0 / 0');
  assert.ok(!overlay.classList.contains('show'));
});
