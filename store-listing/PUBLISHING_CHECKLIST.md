# Chrome Web Store publishing checklist

## Ready in this repository

- [x] Manifest V3
- [x] Extension version 1.3.0
- [x] Localized English and Simplified Chinese metadata
- [x] PNG extension icons: 16, 32, 48, and 128 px
- [x] 440 × 280 small promotional tile
- [x] English and Simplified Chinese store listing copy
- [x] Permission justifications and privacy-form answers
- [x] Privacy policy draft
- [x] Upload ZIP containing runtime files only
- [x] Automated tests and JavaScript/Manifest validation

## Complete before submission

1. Create or open a Chrome Web Store Developer Dashboard account and complete Google's developer registration requirements.
2. Choose a public support email address. Replace the Contact placeholder in `PRIVACY_POLICY.md`.
3. Publish the privacy policy at a stable public HTTPS URL (for example, a website or GitHub Pages). Do not use a local file path as the policy URL.
4. Capture at least one real product screenshot at 1280 × 800 or 640 × 400. Recommended screenshots:
   - YouTube video page with surrounding content strongly dimmed and the video lightly dimmed
   - FocusTube popup showing the two independent control groups
   - Theater mode or Shorts showing that the overlay follows the player
5. Avoid copyrighted video frames or private account details in screenshots. Use a video you own or have permission to show, and crop or blur profile/account information.
6. In the Developer Dashboard, create a new item and upload `release/focustube-1.3.0.zip`.
7. Paste the English listing from `STORE_LISTING.md`, then add the Simplified Chinese localization.
8. Upload `icons/icon128.png` as the store icon if requested and `store-assets/small-promo-440x280.png` as the small promotional tile.
9. Complete the Privacy tab using the single-purpose statement, permission justifications, and disclosure answers in `STORE_LISTING.md`.
10. Set distribution visibility to Public, select the intended regions, save as draft, and preview the listing.
11. Install the draft/test item once and verify popup controls, standard video, theater mode, Shorts, scrolling, full screen, and both UI languages.
12. Submit for review. Do not publish a new build from the source directory; always generate and inspect a fresh release ZIP.

## Discoverability recommendations

- Keep “YouTube Focus Mode” in the English title and first sentence, but do not repeat keywords unnaturally.
- Lead screenshots with the before/after viewing effect, not a settings-only image.
- Use the Productivity category.
- Explain the unique difference early: video and surrounding-page effects are independently adjustable.
- Add a support URL and respond to reviews; do not promise features that are not in the submitted build.

## Update workflow

1. Increment the version in both `manifest.json` and `package.json`.
2. Run `npm test` and `npm run check`.
3. Regenerate all icon/promo PNGs if their SVG sources changed.
4. Build a new ZIP with only runtime files.
5. Check the ZIP file list before uploading.
