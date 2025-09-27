const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const htmlPath = path.join(__dirname, '..', 'src', 'fivepoint.html');
const content = fs.readFileSync(htmlPath, 'utf8');
const lines = content.split('\n');
const classLine = lines.findIndex(l => l.includes('class ImageZoomController'));
let brace = 0;
let end = classLine;
for (let i = classLine; i < lines.length; i++) {
  brace += (lines[i].match(/{/g) || []).length;
  brace -= (lines[i].match(/}/g) || []).length;
  if (brace === 0 && i > classLine) { end = i; break; }
}
const code = lines.slice(classLine, end + 1).join('\n');
const { ImageZoomController } = eval('(() => {\n' + code + '\nreturn { ImageZoomController };\n})()');

function createViewer(hasImg = true) {
  const classList = {
    items: [],
    add(c) { if (!this.items.includes(c)) this.items.push(c); },
    remove(c) { this.items = this.items.filter(x => x !== c); },
    contains(c) { return this.items.includes(c); }
  };
  const img = hasImg ? { style: {}, width: 100, height: 100, addEventListener: () => {} } : null;
  const viewer = {
    classList,
    clientWidth: 100,
    clientHeight: 100,
    querySelector: () => img,
    addEventListener: () => {}
  };
  global.window = { addEventListener: () => {}, removeEventListener: () => {} };
  global.document = {};
  return viewer;
}

test('ImageZoomController.toggleActualSize 正常系: 実寸とフィットを切り替える', () => {
  const viewer = createViewer(true);
  const controller = new ImageZoomController(viewer);
  controller.toggleActualSize();
  assert.strictEqual(controller.is_actual_size, true);
  assert.ok(viewer.classList.contains('viewer--actual'));
  controller.toggleActualSize();
  assert.strictEqual(controller.is_actual_size, false);
  assert.ok(!viewer.classList.contains('viewer--actual'));
});

test('ImageZoomController.toggleActualSize 異常系: 画像要素が存在しない場合は何もしない', () => {
  const viewer = createViewer(false);
  const controller = new ImageZoomController(viewer);
  controller.toggleActualSize();
  assert.strictEqual(controller.is_actual_size, false);
  assert.ok(!viewer.classList.contains('viewer--actual'));
});

test('ImageZoomController.toggleActualSize 境界値: 連続で呼び出すと元に戻る', () => {
  const viewer = createViewer(true);
  const controller = new ImageZoomController(viewer);
  controller.toggleActualSize();
  controller.toggleActualSize();
  assert.strictEqual(controller.is_actual_size, false);
  assert.ok(!viewer.classList.contains('viewer--actual'));
});
