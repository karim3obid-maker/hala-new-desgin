# Current React application

Read `DESIGN.md` before creating or changing UI. It records the user's permanent Hala design baseline (version 2.1, 2026-10-23).

- Use React + HeroUI and existing shared components; styling belongs in `src/styles.css` and shared component files.
- Preserve IBM Plex Sans Arabic 400/500/600, RTL, the Hala colors, compact spacing, sidebar/header patterns, and mobile adaptation. Match the current website when adding pages.
- Use the shared Gravity `Icon`/`IconButton` components and `AnimatedNumber` for the approved 400ms metric entrance count. Respect reduced motion; do not add looping or card movement.
- User-supplied screenshots are references for data, content and required functions only. Redesign them with the approved Hala system; do not copy their old visual styling or layouts.
- Preserve real data and meanings. Do not invent individual order records or replace unavailable data with zero.
- Apply later user requests normally and keep the design reference consistent with them.
- Run the production build after application edits. Use `scripts/export-standalone.mjs` when updating the shareable HTML; never rebuild from the old dashboard source.
- Saved release snapshots are immutable references. Extend the current source instead.
