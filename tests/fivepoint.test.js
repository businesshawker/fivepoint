const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html_path = path.join(__dirname, '..', 'src', 'fivepoint.html');
const content = fs.readFileSync(html_path, 'utf8');

const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('class FileNameUtils'));
let brace = 0;
let end = start;
for (let i = start; i < lines.length; i++) {
  brace += (lines[i].match(/{/g) || []).length;
  brace -= (lines[i].match(/}/g) || []).length;
  if (brace === 0 && i > start) { end = i; break; }
}
const utilCode = lines.slice(start, end + 1).join('\n');
const FileNameUtils = eval(`(() => {\n${utilCode}\nreturn FileNameUtils;\n})()`);

test('ビューアHTMLのタイトルが正しい', () => {
  assert.match(content, /<title>ローカル画像評価ビューア<\/title>/);
});

test('ビューアHTMLのタイトルが重複していない', () => {
  const count = (content.match(/<title>/g) || []).length;
  assert.strictEqual(count, 1);
});

test('フォルダ選択ボタンが存在する', () => {
  assert.match(content, /<button id="pickDirBtn" class="BtnStart">📁 フォルダ選択<\/button>/);
});

test('フォルダ選択ボタンが重複していない', () => {
  const matches = content.match(/id="pickDirBtn"/g) || [];
  assert.strictEqual(matches.length, 1);
});

test('評価セレクトに0～5の選択肢がある', () => {
  for (let i = 0; i <= 5; i++) {
    const re = new RegExp(`<option value="${i}">`);
    assert.match(content, re);
  }
});

test('評価セレクトに範囲外の選択肢がない', () => {
  assert.ok(!content.includes('<option value="6">'));
  assert.ok(!content.includes('<option value="-1">'));
});

test('pad5 は5桁のゼロパディング文字列を返す', () => {
  assert.strictEqual(FileNameUtils.pad5(0), '00000');
  assert.strictEqual(FileNameUtils.pad5(42), '00042');
  assert.strictEqual(FileNameUtils.pad5(123456), '123456');
});

test('pad5 は負数や非数値入力でも文字列を返す', () => {
  assert.strictEqual(FileNameUtils.pad5(-1), '000-1');
  assert.strictEqual(FileNameUtils.pad5('abc'), '00abc');
});

test('isImageName は対応画像拡張子を判定する', () => {
  assert.ok(FileNameUtils.isImageName('photo.jpg'));
  assert.ok(FileNameUtils.isImageName('PICTURE.PNG'));
});

test('isImageName は不正な名前で false を返す', () => {
  assert.ok(!FileNameUtils.isImageName('doc.txt'));
  assert.ok(!FileNameUtils.isImageName('image'));
  assert.ok(!FileNameUtils.isImageName('photo.jpgg'));
});

test('parseRatingName は評価プレフィックス付きファイル名を解析する', () => {
  assert.deepStrictEqual(FileNameUtils.parseRatingName('3-sample.jpg'), { rating: 3, rest: 'sample', ext: 'jpg' });
});

test('parseRatingName は不正なファイル名で null を返す', () => {
  assert.strictEqual(FileNameUtils.parseRatingName('invalid'), null);
  assert.strictEqual(FileNameUtils.parseRatingName('6-sample.jpg'), null);
  assert.strictEqual(FileNameUtils.parseRatingName('x-sample.jpg'), null);
  assert.strictEqual(FileNameUtils.parseRatingName('3-.jpg'), null);
});

test('parseRatingName は境界値0と5のファイル名を解析する', () => {
  assert.deepStrictEqual(FileNameUtils.parseRatingName('0-first.jpg'), { rating: 0, rest: 'first', ext: 'jpg' });
  assert.deepStrictEqual(FileNameUtils.parseRatingName('5-last.png'), { rating: 5, rest: 'last', ext: 'png' });
});

test('parseRatingName は負の評価で null を返す', () => {
  assert.strictEqual(FileNameUtils.parseRatingName('-1-sample.jpg'), null);
});

test('pad5 は境界値を処理する', () => {
  assert.strictEqual(FileNameUtils.pad5(99999), '99999');
  assert.strictEqual(FileNameUtils.pad5(100000), '100000');
});

test('ボタン色のCSS変数が定義されている', () => {
  assert.match(content, /--btn-start:\s*#2dbb6d/);
  assert.match(content, /--btn-refresh:\s*#2d8bbb/);
  assert.match(content, /--btn-seqinit:\s*#bb8b2d/);
  assert.match(content, /--btn-init:\s*#bb2d2d/);
});

test('ボタン用CSSクラスが存在し変数を参照する', () => {
  const start_re = /\.BtnStart\s*{[^}]*background:\s*var\(--btn-start\);[^}]*border-color:\s*var\(--btn-start\);/s;
  const refresh_re = /\.BtnRefresh\s*{[^}]*background:\s*var\(--btn-refresh\);[^}]*border-color:\s*var\(--btn-refresh\);/s;
  const seq_re = /\.BtnSeqInit\s*{[^}]*background:\s*var\(--btn-seqinit\);[^}]*border-color:\s*var\(--btn-seqinit\);/s;
  const init_re = /\.BtnInitAll\s*{[^}]*background:\s*var\(--btn-init\);[^}]*border-color:\s*var\(--btn-init\);/s;
  assert.ok(start_re.test(content));
  assert.ok(refresh_re.test(content));
  assert.ok(seq_re.test(content));
  assert.ok(init_re.test(content));
});

test('各ボタンに対応クラスが割り当てられている', () => {
  assert.match(content, /<button id="pickDirBtn" class="BtnStart">/);
  assert.match(content, /<button id="refreshBtn" class="BtnRefresh">/);
  assert.match(content, /<button id="seqInitBtn" class="BtnSeqInit"/);
  assert.match(content, /<button id="initBtn" class="BtnInitAll"/);
});
