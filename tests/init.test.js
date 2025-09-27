const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html_path = path.join(__dirname, '..', 'src', 'fivepoint.html');
const content = fs.readFileSync(html_path, 'utf8');

function extract(name) {
  const lines = content.split('\n');
  const start = lines.findIndex(l => l.includes(name));
  let brace = 0;
  let end = start;
  for (let i = start; i < lines.length; i++) {
    brace += (lines[i].match(/{/g) || []).length;
    brace -= (lines[i].match(/}/g) || []).length;
    if (brace === 0 && i > start) { end = i; break; }
  }
  return lines.slice(start, end + 1).join('\n');
}

const code = [
  extract('class FileNameUtils'),
  extract('async function initSequential'),
  extract('async function initSequenceOnly')
].join('\n');

const { initSequential, initSequenceOnly } = eval(`(() => {${code}; return { initSequential, initSequenceOnly }; })()`);

function setupEnv(names) {
  global.files = names.map(n => ({ name: n, handle: { name: n } }));
  global.dirHandle = {};
  global.verifyPerms = async () => true;
  global.loadFiles = async () => {};
  global.renderThumbs = () => {};
  global.selectIndex = () => {};
  global.alert = () => {};
  global.confirm = () => true;
  global.renameFile = async (h, newName) => ({ name: newName });
  global.progressCalls = [];
  global.progress = {
    show(total) { progressCalls.push(['show', total]); },
    update(done, total) { progressCalls.push(['update', done, total]); },
    hide() { progressCalls.push(['hide']); },
    isActive() { return false; },
    async run(total, work) {
      this.show(total);
      try {
        return await work();
      } finally {
        this.hide();
      }
    }
  };
}

function updates() { return progressCalls.filter(c => c[0] === 'update'); }
function shows() { return progressCalls.filter(c => c[0] === 'show'); }

test('initSequential は複数ファイルで進捗を表示する', async () => {
  setupEnv(['a.jpg', 'b.png']);
  await initSequential();
  assert.deepStrictEqual(shows(), [['show', 2]]);
  assert.deepStrictEqual(updates(), [['update', 1, 2], ['update', 2, 2]]);
  assert.strictEqual(progressCalls.at(-1)[0], 'hide');
});

test('initSequenceOnly は複数ファイルで進捗を表示する', async () => {
  setupEnv(['1-00001.jpg', '2-00002.jpg']);
  await initSequenceOnly();
  assert.deepStrictEqual(shows(), [['show', 2]]);
  assert.deepStrictEqual(updates(), [['update', 1, 2], ['update', 2, 2]]);
  assert.strictEqual(progressCalls.at(-1)[0], 'hide');
});
