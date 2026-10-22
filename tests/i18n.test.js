const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));

test('English and Simplified Chinese locale files contain the same messages', () => {
  const english = readJson('_locales/en/messages.json');
  const chinese = readJson('_locales/zh_CN/messages.json');

  assert.deepEqual(Object.keys(chinese).sort(), Object.keys(english).sort());
  for (const [key, entry] of Object.entries(english)) {
    assert.ok(entry.message, `English message is empty: ${key}`);
    assert.ok(chinese[key].message, `Chinese message is empty: ${key}`);
  }
});

test('manifest uses the English default locale and localized metadata', () => {
  const manifest = readJson('manifest.json');

  assert.equal(manifest.default_locale, 'en');
  assert.equal(manifest.name, '__MSG_extensionName__');
  assert.equal(manifest.description, '__MSG_extensionDescription__');
  assert.equal(manifest.action.default_title, '__MSG_extensionName__');
});

test('every popup localization key exists in both locale files', () => {
  const html = fs.readFileSync(path.join(root, 'popup.html'), 'utf8');
  const script = fs.readFileSync(path.join(root, 'popup.js'), 'utf8');
  const english = readJson('_locales/en/messages.json');
  const chinese = readJson('_locales/zh_CN/messages.json');
  const keys = new Set();

  for (const match of html.matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/g)) keys.add(match[1]);
  for (const match of script.matchAll(/message\('([^']+)'\)/g)) keys.add(match[1]);

  for (const key of keys) {
    assert.ok(english[key], `Missing English message: ${key}`);
    assert.ok(chinese[key], `Missing Chinese message: ${key}`);
  }
});

test('manifest declares the release icons and matching package version', () => {
  const manifest = readJson('manifest.json');
  const packageJson = readJson('package.json');
  const expectedIcons = {
    16: 'icons/icon16.png',
    32: 'icons/icon32.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png'
  };

  assert.equal(manifest.version, packageJson.version);
  assert.deepEqual(manifest.icons, expectedIcons);
  assert.deepEqual(manifest.action.default_icon, {
    16: expectedIcons[16],
    32: expectedIcons[32]
  });
  for (const iconPath of Object.values(expectedIcons)) {
    assert.ok(fs.statSync(path.join(root, iconPath)).size > 0, `Missing icon: ${iconPath}`);
  }
});
