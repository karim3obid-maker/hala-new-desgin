# Design QA — Hala dashboard

final result: passed

The user approved the rendered design on 2026-10-23 and requested that it be frozen. The approved implementation was preserved without further visual changes.

## Evidence and normalization

- Source visual truth: `/Volumes/Work/تصميم هلا /design-system/assets/single-page-experiment.png` (1024 × 1536 pixels).
- Additional instruction: separate Orders, Shipments and Financial visually while keeping one page, the same data, IBM typography and Hala identity.
- Implementation: `http://127.0.0.1:4180/hala-dashboard.html`.
- Implementation screenshot: `/Volumes/Work/تصميم هلا /dashboard/qa/desktop.png` (1024 × 2329 pixels).
- Full comparison: `/Volumes/Work/تصميم هلا /dashboard/qa/comparison-full.png`.
- Focused comparisons: `dashboard/qa/comparison-header.png`, `comparison-orders.png`, `comparison-shipments.png`, `comparison-financial.png`.
- Desktop CSS viewport: 1024 × 768. Screenshots have one image pixel per CSS pixel. The implementation is intentionally taller because of the requested separation and roomier components. Both sides are compared at equal width without stretching either image.
- Full implementation evidence is stitched from normal viewport captures at measured document scroll positions 0, 258, 882 and 1546.5. The fixed topbar is included once. The sidebar is represented once with white continuation below the viewport. The last 14 pixels are empty page background. The browser's full-page screenshot path shifted the RTL capture horizontally, so that defective capture was excluded from QA.
- State: light theme, all stores/products/countries, 1–22 October 2026, all three sections visible, dialogs closed.
- Additional responsive checks: 390 × 844 and 1440 × 900 CSS pixels. Evidence: `dashboard/qa/hala-mobile.png` and `hala-mobile-shipping.png`.

## Findings and comparison history

1. Preliminary browser checks found a desktop sidebar close control visible because of CSS specificity, and excess combined scroll padding/margin. These were fixed before the combined visual comparison. The final desktop screenshot shows the control hidden, and anchor checks place Financial at 92px below the viewport top with the correct active section.
2. First combined comparison found [P2] the revenue axis omitted the final date label. Evidence: `dashboard/qa/comparison-financial-before.png`. The chart now retains both endpoints while spacing intermediate ticks. Post-fix evidence: `dashboard/qa/comparison-financial.png`, with 2026-10-22 visible.
3. Mobile checks found [P2] the offscreen drawer remained available to keyboard navigation. The closed drawer is now inert; opening it makes the content behind it inert; closing it restores focus to the menu button. Browser DOM checks confirmed the attributes in each state and focus restoration. The revised behavior does not change the accepted visual design.
4. Final combined comparison and the user's subsequent acceptance found no remaining actionable P0/P1/P2 differences. Increased page height, independent section frames, official outline icons and the clearly identified illustrative curve are intentional implementation choices.

## Required fidelity surfaces

- Typography: embedded IBM Plex Sans Arabic, actual loaded font checked in the browser. Weights 400/500/600, consistent Arabic labels and numeric hierarchy. No clipped metric text at tested widths.
- Spacing/layout: separate white frames and headings, 48px section spacing on desktop and 36px on mobile, four metric columns on desktop and two on mobile. No horizontal overflow at 390, 1024 or 1440px. Different full-page height is intentional and approved.
- Colors/tokens: Hala purple `#270A5E`, brand orange `#FB6B12`, light neutral background, white surfaces and quiet borders. Semantic colors distinguish operational statuses with text labels as well.
- Image/asset fidelity: supplied logo embedded at native source quality; official Tabler outline icon assets. All browser images loaded successfully. Chart.js renders vector/canvas data charts rather than a screenshot pasted into the UI.
- Copy/content: original aggregate metrics retained. Orders 211, shipments 84, balance USD49.79, income USD56.47, expenses USD216.37, processing USD225. Other statuses and percentages preserved. The daily revenue curve is a visual approximation and is explicitly identified as illustrative.

## Interaction and accessibility checks

- Section anchors, active section tracking and header clearance passed.
- Search for the balance returned the correct metric and selecting it closed the dialog and navigated to the metric.
- Invalid date order displayed an error. A valid unsupported range displayed an unavailable-data state rather than fabricated values. Restoring the supported snapshot restored all sections.
- Mobile drawer opening, closing, navigation and focus restoration passed.
- Semantic headings, form labels, native dialogs, focus styling, skip link and reduced-motion handling are present.
- Browser console checks returned no errors or warnings.
- JavaScript syntax check passed. The portable HTML contains the fonts, logo, icons and chart library.

## Scope and residual test gaps

This is a frontend snapshot, not an API-connected merchant account. Country/product/store selectors have only the supplied aggregate option. Unrelated sidebar destinations remain static. Fullscreen and clipboard controls were implemented but not exhaustively tested across browsers. Full WCAG auditing, Safari/Firefox coverage and live backend integration are outside this prototype check.

## Implementation checklist

- [x] Preserve the approved visual system and three separated sections.
- [x] Preserve the screenshot metrics and distinguish illustrative daily data.
- [x] Check desktop/mobile rendering and primary interactions.
- [x] Fix identified P2 issues and compare the revised rendering.
- [x] Save the approved HTML snapshot, image export and file manifest.
