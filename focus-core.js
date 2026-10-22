(() => {
  'use strict';

  const DEFAULTS = Object.freeze({
    enabled: true,
    videoOpacity: 15,
    videoBlur: 0,
    outsideOpacity: 72,
    outsideBlur: 8,
    gap: 4
  });
  const STORAGE_KEYS = Object.freeze([...Object.keys(DEFAULTS), 'opacity', 'blur']);

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, Number(value)));
  }

  function numericOr(value, fallback) {
    if (value === '' || value === null || value === undefined || !Number.isFinite(Number(value))) {
      return fallback;
    }
    return Number(value);
  }

  function normalizeSettings(input = {}) {
    const legacyOutsideOpacity = numericOr(input.opacity, DEFAULTS.outsideOpacity);
    const legacyOutsideBlur = numericOr(input.blur, DEFAULTS.outsideBlur);

    return {
      enabled: typeof input.enabled === 'boolean' ? input.enabled : DEFAULTS.enabled,
      videoOpacity: clamp(numericOr(input.videoOpacity, DEFAULTS.videoOpacity), 0, 95),
      videoBlur: clamp(numericOr(input.videoBlur, DEFAULTS.videoBlur), 0, 30),
      outsideOpacity: clamp(numericOr(input.outsideOpacity, legacyOutsideOpacity), 0, 95),
      outsideBlur: clamp(numericOr(input.outsideBlur, legacyOutsideBlur), 0, 30),
      gap: clamp(numericOr(input.gap, DEFAULTS.gap), 0, 40)
    };
  }

  function clampRect(rect, viewport) {
    const left = clamp(rect.left, 0, viewport.width);
    const top = clamp(rect.top, 0, viewport.height);
    const right = clamp(rect.right, left, viewport.width);
    const bottom = clamp(rect.bottom, top, viewport.height);
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  }

  function getPanels(viewport, rect, gap = 0) {
    const safeGap = clamp(gap, 0, 40);
    const expanded = {
      left: rect.left - safeGap,
      top: rect.top - safeGap,
      right: rect.right + safeGap,
      bottom: rect.bottom + safeGap
    };
    const focus = clampRect(expanded, viewport);

    return {
      top: { left: 0, top: 0, width: viewport.width, height: focus.top },
      left: { left: 0, top: focus.top, width: focus.left, height: focus.height },
      right: {
        left: focus.right,
        top: focus.top,
        width: viewport.width - focus.right,
        height: focus.height
      },
      bottom: {
        left: 0,
        top: focus.bottom,
        width: viewport.width,
        height: viewport.height - focus.bottom
      }
    };
  }

  globalThis.FocusTubeCore = Object.freeze({
    DEFAULTS,
    STORAGE_KEYS,
    normalizeSettings,
    clampRect,
    getPanels
  });
})();
