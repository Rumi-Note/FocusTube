const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const context = vm.createContext({});
const source = fs.readFileSync(path.join(__dirname, '..', 'focus-core.js'), 'utf8');
vm.runInContext(source, context);
const core = context.FocusTubeCore;

test('normalizes independent video and outside settings', () => {
  const settings = core.normalizeSettings({
    enabled: false,
    videoOpacity: 120,
    videoBlur: -2,
    outsideOpacity: 64,
    outsideBlur: 40,
    gap: '12'
  });
  assert.equal(settings.enabled, false);
  assert.equal(settings.videoOpacity, 95);
  assert.equal(settings.videoBlur, 0);
  assert.equal(settings.outsideOpacity, 64);
  assert.equal(settings.outsideBlur, 30);
  assert.equal(settings.gap, 12);

  const defaults = core.normalizeSettings({ videoOpacity: 'not-a-number' });
  assert.equal(defaults.videoOpacity, core.DEFAULTS.videoOpacity);
});

test('migrates legacy opacity and blur to the outside region', () => {
  const settings = core.normalizeSettings({ opacity: 61, blur: 11 });
  assert.equal(settings.outsideOpacity, 61);
  assert.equal(settings.outsideBlur, 11);
  assert.equal(settings.videoOpacity, core.DEFAULTS.videoOpacity);
  assert.equal(settings.videoBlur, core.DEFAULTS.videoBlur);
  assert.ok(core.STORAGE_KEYS.includes('opacity'));
  assert.ok(core.STORAGE_KEYS.includes('blur'));
});

test('builds four panels around the player without overlap', () => {
  const panels = core.getPanels(
    { width: 1200, height: 800 },
    { left: 200, top: 100, right: 1000, bottom: 650 },
    4
  );

  assert.deepEqual(JSON.parse(JSON.stringify(panels.top)), { left: 0, top: 0, width: 1200, height: 96 });
  assert.deepEqual(JSON.parse(JSON.stringify(panels.left)), { left: 0, top: 96, width: 196, height: 558 });
  assert.deepEqual(JSON.parse(JSON.stringify(panels.right)), { left: 1004, top: 96, width: 196, height: 558 });
  assert.deepEqual(JSON.parse(JSON.stringify(panels.bottom)), { left: 0, top: 654, width: 1200, height: 146 });
});

test('clamps a player extending beyond the viewport', () => {
  const panels = core.getPanels(
    { width: 800, height: 600 },
    { left: -50, top: -20, right: 900, bottom: 700 },
    10
  );

  for (const panel of Object.values(panels)) {
    assert.ok(panel.width >= 0);
    assert.ok(panel.height >= 0);
  }
  assert.equal(panels.top.height, 0);
  assert.equal(panels.left.width, 0);
  assert.equal(panels.right.width, 0);
  assert.equal(panels.bottom.height, 0);
});
