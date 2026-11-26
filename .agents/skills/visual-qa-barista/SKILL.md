---
name: visual-qa-barista
description: >-
  Provides the repeatable multi-viewport browser QA checklist for KittyCaffe
  (1366x720, 1536x740, 768x1024, 390x844), verifying zero overlap, zero clipping,
  single-row TopBar, Marzipan accessory alignment, and localStorage persistence.
---

# Visual & Responsive QA Checklist («Мур-Лате»)

Run this QA checklist after any change affecting layout, CSS, stations, modals, SVGs, or responsive breakpoints.

## Mandatory Viewport Matrix

1. **`1366×720`** — Typical Windows laptop (accounting for browser chrome).
2. **`1536×740`** — 1080p laptop at Windows 125% display scaling.
3. **`768×1024`** — Portrait tablet (iPad).
4. **`390×844`** — Portrait phone (modern iPhone / Android).

## Required Assertions

1. **Zero Console Errors & Zero Horizontal Overflow**:
   - `document.documentElement.scrollWidth <= window.innerWidth` on every viewport.
   - Zero uncaught JS errors or broken image assets (`img.complete && img.naturalWidth > 0`).

2. **Single-Row TopBar**:
   - `header` height `<= 58px`; all visible buttons remain on one horizontal row with no right-edge clipping.

3. **Strict Station Card Bounds (`getBoundingClientRect()`)**:
   - Test with **8 hot ingredients** (`Матча` unlocked) on Tab 1, **6 cocktail + 4 blender rows** on Tab 2, and **4 pastries** (`Морквяний кекс` unlocked, testing Empty + Croissant + Donut states) on Tab 3.
   - For every `[data-station-card]`:
     - Every visible `<button>` inside the card must satisfy `button.top >= header.bottom` (zero header overlap).
     - Every visible `<button>` and `[data-pastry-alcove]` must satisfy `element.bottom <= card.bottom - 4` (zero bottom clipping; 3D shadows visible).

4. **Marzipan Wardrobe Alignment**:
   - With `head` + `eyes` + `neck` accessories equipped simultaneously, verify the `<svg viewBox="0 0 640 560">` overlay bounding box matches `cat-marzipan.png` bounding box within `< 1px` across viewports.

5. **Persistence Smoke Check**:
   - Reload page and confirm coins, unlocked recipes, wardrobe, decor, friendship souvenirs, secret drink, and rare stickers persist intact.
