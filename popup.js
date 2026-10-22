(() => {
  'use strict';

  const { DEFAULTS, STORAGE_KEYS, normalizeSettings } = globalThis.FocusTubeCore;
  const main = document.querySelector('main');
  const status = document.querySelector('#status');
  const enabled = document.querySelector('#enabled');
  const reset = document.querySelector('#reset');
  const preview = document.querySelector('.preview');
  const controls = {
    videoOpacity: {
      input: document.querySelector('#videoOpacity'),
      output: document.querySelector('#videoOpacityValue'),
      suffix: '%'
    },
    videoBlur: {
      input: document.querySelector('#videoBlur'),
      output: document.querySelector('#videoBlurValue'),
      suffix: ' px'
    },
    outsideOpacity: {
      input: document.querySelector('#outsideOpacity'),
      output: document.querySelector('#outsideOpacityValue'),
      suffix: '%'
    },
    outsideBlur: {
      input: document.querySelector('#outsideBlur'),
      output: document.querySelector('#outsideBlurValue'),
      suffix: ' px'
    },
    gap: { input: document.querySelector('#gap'), output: document.querySelector('#gapValue'), suffix: ' px' }
  };
  let settings = { ...DEFAULTS };
  let saveTimer = null;

  function message(key) {
    return chrome.i18n.getMessage(key) || key;
  }

  function localizeDocument() {
    document.documentElement.lang = chrome.i18n.getUILanguage().replace('_', '-');
    document.title = message('extensionName');
    for (const element of document.querySelectorAll('[data-i18n]')) {
      element.textContent = message(element.dataset.i18n);
    }
    for (const element of document.querySelectorAll('[data-i18n-aria-label]')) {
      element.setAttribute('aria-label', message(element.dataset.i18nAriaLabel));
    }
  }

  function paint() {
    enabled.checked = settings.enabled;
    main.dataset.disabled = String(!settings.enabled);
    for (const [key, control] of Object.entries(controls)) {
      control.input.value = settings[key];
      control.output.value = `${settings[key]}${control.suffix}`;
    }
    preview.style.setProperty('--preview-video-opacity', String(settings.videoOpacity / 100));
    preview.style.setProperty('--preview-video-blur', `${settings.videoBlur}px`);
    preview.style.setProperty('--preview-outside-opacity', String(settings.outsideOpacity / 100));
    preview.style.setProperty('--preview-outside-blur', `${settings.outsideBlur}px`);
  }

  async function sendToActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url?.startsWith('https://www.youtube.com/')) {
      status.textContent = message('statusUseOnYouTube');
      return;
    }

    try {
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'FOCUSTUBE_APPLY_SETTINGS',
        settings
      });
      status.textContent = message(response?.playerFound ? 'statusApplied' : 'statusWaiting');
    } catch {
      status.textContent = message('statusRefresh');
    }
  }

  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      await chrome.storage.sync.set(settings);
      await sendToActiveTab();
    }, 80);
  }

  enabled.addEventListener('change', () => {
    settings = normalizeSettings({ ...settings, enabled: enabled.checked });
    paint();
    persist();
  });

  for (const [key, control] of Object.entries(controls)) {
    control.input.addEventListener('input', () => {
      settings = normalizeSettings({ ...settings, [key]: Number(control.input.value) });
      paint();
      persist();
    });
  }

  reset.addEventListener('click', () => {
    settings = { ...DEFAULTS };
    paint();
    persist();
  });

  localizeDocument();
  chrome.storage.sync.get(STORAGE_KEYS, (stored) => {
    settings = normalizeSettings(stored);
    paint();
    sendToActiveTab();
  });
})();
