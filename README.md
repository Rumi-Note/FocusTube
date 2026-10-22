# FocusTube Focus Mode

[English](README.md) | [简体中文](README.zh-CN.md)

FocusTube is a Manifest V3 Chrome extension that adds independently adjustable translucent and blurred overlays to the current YouTube video and the surrounding page. The video overlay does not block playback, seeking, volume, or other player controls. All overlays are hidden automatically in full screen.

## Features

- Enable or disable focus mode with one click
- Adjust the current video overlay opacity from 0% to 95% and blur from 0 to 30 px
- Adjust the surrounding-page overlay opacity from 0% to 95% and blur from 0 to 30 px
- Configure a 0–40 px gap around the video
- Supports standard videos, theater mode, Shorts, scrolling, window resizing, and YouTube single-page navigation
- Includes English and Simplified Chinese and follows Chrome's interface language; other locales default to English
- Saves settings with Chrome Sync and migrates legacy surrounding-overlay settings
- No analytics, advertising, developer-controlled server, or remote code

## Local installation

1. Open Chrome's extensions management page.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose the cloned or extracted FocusTube project folder.
5. Open or refresh a YouTube video, then select the FocusTube toolbar icon to adjust the effects.

After changing the source, select **Reload** on the FocusTube extension card and refresh the YouTube page.

## Chrome Web Store assets

- Editable icon source: `images/focustube-icon.svg`
- 16/32/48/128 px icons: `icons/`
- 440 × 280 promotional tile: `store-assets/small-promo-440x280.png`
- English and Simplified Chinese listing copy: `store-listing/STORE_LISTING.md`
- Privacy policy source: `store-listing/PRIVACY_POLICY.md`
- GitHub Pages document: `docs/privacy-policy.html`
- Public policy: [FocusTube Privacy Policy](https://rumi-note.github.io/FocusTube/privacy-policy.html)
- Publishing checklist: `store-listing/PUBLISHING_CHECKLIST.md`

Do not include private account details or video content you do not have permission to use in public screenshots.

## Languages

- English: `_locales/en/messages.json`
- Simplified Chinese: `_locales/zh_CN/messages.json`
- Default locale: English

## Privacy and permissions

- `storage`: stores only the enabled state and five visual preferences with Chrome Sync.
- `activeTab`: sends the current settings to the open YouTube tab after the user selects the extension; it does not read browsing history.
- `https://www.youtube.com/*`: locates the player and draws overlays locally without transmitting page or video data.

## Development checks

```sh
npm test
npm run check
```

YouTube may change its page structure. If player detection stops working, update the selectors in `content.js`.
