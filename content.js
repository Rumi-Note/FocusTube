(() => {
  'use strict';

  if (globalThis.__focusTubeLoaded) return;
  globalThis.__focusTubeLoaded = true;

  const { DEFAULTS, STORAGE_KEYS, normalizeSettings, clampRect, getPanels } = globalThis.FocusTubeCore;
  const ROOT_ID = 'focustube-overlay-root';
  const OUTSIDE_SIDES = ['top', 'left', 'right', 'bottom'];
  const PLAYER_SELECTORS = [
    'ytd-watch-flexy #movie_player',
    'ytd-shorts #shorts-player',
    'ytd-shorts .html5-video-player',
    '#movie_player'
  ];

  let settings = { ...DEFAULTS };
  let root = null;
  let panels = {};
  let framePending = false;
  let observedPlayer = null;
  const playerResizeObserver = new ResizeObserver(scheduleRender);

  function createOverlay() {
    root = document.createElement('div');
    root.id = ROOT_ID;
    root.setAttribute('aria-hidden', 'true');

    for (const side of OUTSIDE_SIDES) {
      const panel = document.createElement('div');
      panel.className = 'focustube-panel focustube-outside-panel';
      panel.dataset.side = side;
      root.appendChild(panel);
      panels[side] = panel;
    }

    const videoPanel = document.createElement('div');
    videoPanel.className = 'focustube-panel focustube-video-panel';
    videoPanel.dataset.side = 'video';
    root.appendChild(videoPanel);
    panels.video = videoPanel;

    document.documentElement.appendChild(root);
  }

  function ensureOverlay() {
    if (!root?.isConnected) createOverlay();
  }

  function findPlayer() {
    for (const selector of PLAYER_SELECTORS) {
      const candidates = document.querySelectorAll(selector);
      for (const candidate of candidates) {
        const rect = candidate.getBoundingClientRect();
        const style = getComputedStyle(candidate);
        if (rect.width >= 240 && rect.height >= 135 && style.display !== 'none' && style.visibility !== 'hidden') {
          return { element: candidate, rect };
        }
      }
    }
    return null;
  }

  function setPanelRect(panel, rect) {
    panel.style.left = `${Math.round(rect.left)}px`;
    panel.style.top = `${Math.round(rect.top)}px`;
    panel.style.width = `${Math.max(0, Math.round(rect.width))}px`;
    panel.style.height = `${Math.max(0, Math.round(rect.height))}px`;
  }

  function hideOverlay() {
    if (root) root.dataset.visible = 'false';
  }

  function render() {
    framePending = false;
    ensureOverlay();

    if (!settings.enabled || document.fullscreenElement) {
      hideOverlay();
      return;
    }

    const player = findPlayer();
    if (!player) {
      if (observedPlayer) {
        playerResizeObserver.unobserve(observedPlayer);
        observedPlayer = null;
      }
      hideOverlay();
      return;
    }
    if (player.element !== observedPlayer) {
      if (observedPlayer) playerResizeObserver.unobserve(observedPlayer);
      observedPlayer = player.element;
      playerResizeObserver.observe(observedPlayer);
    }

    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const playerRect = {
      left: player.rect.left,
      top: player.rect.top,
      right: player.rect.right,
      bottom: player.rect.bottom
    };
    const outsideGeometry = getPanels(viewport, playerRect, settings.gap);
    const videoGeometry = clampRect(playerRect, viewport);

    root.style.setProperty('--focustube-video-opacity', String(settings.videoOpacity / 100));
    root.style.setProperty('--focustube-video-blur', `${settings.videoBlur}px`);
    root.style.setProperty('--focustube-outside-opacity', String(settings.outsideOpacity / 100));
    root.style.setProperty('--focustube-outside-blur', `${settings.outsideBlur}px`);
    for (const side of OUTSIDE_SIDES) setPanelRect(panels[side], outsideGeometry[side]);
    setPanelRect(panels.video, videoGeometry);
    root.dataset.visible = 'true';
  }

  function scheduleRender() {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(render);
  }

  function applySettings(next) {
    settings = normalizeSettings({ ...settings, ...next });
    scheduleRender();
  }

  chrome.storage.sync.get(STORAGE_KEYS, (stored) => {
    settings = normalizeSettings(stored);
    scheduleRender();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    const next = {};
    for (const [key, change] of Object.entries(changes)) next[key] = change.newValue;
    applySettings(next);
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'FOCUSTUBE_APPLY_SETTINGS') {
      applySettings(message.settings);
      sendResponse({ ok: true, playerFound: Boolean(findPlayer()) });
    }
  });

  const observer = new MutationObserver(scheduleRender);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('resize', scheduleRender, { passive: true });
  window.addEventListener('scroll', scheduleRender, { passive: true, capture: true });
  document.addEventListener('fullscreenchange', scheduleRender);
  document.addEventListener('yt-navigate-finish', scheduleRender);
  document.addEventListener('loadedmetadata', scheduleRender, true);
  document.addEventListener('play', scheduleRender, true);

  ensureOverlay();
  scheduleRender();
})();
