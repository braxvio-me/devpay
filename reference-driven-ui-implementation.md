---
name: reference-driven-ui-implementation
description: Workflow for faithfully reproducing an inspiration image or design mockup in React Native/Expo using visual QA and compare-ui-to-design.
---

# Reference-Driven React Native UI Implementation

Act as a senior mobile UI engineer, design-system specialist, and visual QA engineer.

Treat the provided inspiration image or design reference as the **visual source of truth** for the screen being implemented.

---

## Phase 1 — Analyze the Reference

Before coding, inspect the image and identify:

- **Screen structure & component hierarchy**
- **Exact layout proportions**, alignment, spacing, margins, and padding
- **Color & surfaces**: background colors, card surfaces, borders, corner radii, and elevation/shadows
- **Typography metrics**: font families/weights, font sizes, line heights, letter spacing, and text wrapping
- **Media & assets**: icon choices, image dimensions, aspect ratios, cropping, and placement
- **Interactive elements**: navigation bars, tabs, buttons, text inputs, segmented controls, cards
- **Visible component states**: default, selected, unselected, disabled, loading, and pressed states

> **Action:** Create a concise reference specification. Separate directly observable details from uncertain estimates.

---

## Phase 2 — Inspect the Project

Examine the existing Expo application before writing any new code:

1. Review installed dependencies and versions in `package.json`.
2. Inspect existing routes and navigation structure in `src/app/`.
3. Check existing design tokens, themes, and reusable component libraries.
4. **Preserve existing architecture and functionality.** Do not replace working code or state management unnecessarily.

---

## Phase 3 — Implement the Design

Reproduce the reference as faithfully as practical using React Native components:

- **Follow the visual hierarchy**: Match spacing, colors, typography, proportions, and component placement directly from the reference.
- **No unauthorized redesigns**: Do not introduce arbitrary redesigns, extra cards, decorative glows, gradients, floating pills, or alternative layouts unless explicitly required by the reference or platform constraints.
- **Mobile constraints**: Adapt only what is necessary for safe areas, notch clearance, accessibility, dynamic font scaling, and responsive screen widths.
- **Maintain business logic**: Keep state, forms, and business logic functional. Do not create shallow, fake interactions merely to imitate a static screenshot.

---

## Phase 4 — Render and Compare

1. Run the application and navigate to the newly implemented screen.
2. Capture a screenshot using the **same device dimensions, viewport, and UI state** as the reference whenever possible.
3. Use the `compare-ui-to-design` skill to audit the reference against the rendered screen.
4. Inspect differences in this exact priority order:
   1. Overall layout and proportions
   2. Major component positioning and sizing
   3. Spacing, padding, and alignment
   4. Typography metrics and text wrapping
   5. Colors, borders, corner radii, and shadows
   6. Icons, images, and fine details

---

## Phase 5 — Correct and Repeat

1. Fix the **highest-impact visual mismatches** first (layout & module alignment before subtle color nuances).
2. Render the updated screen and capture a new screenshot.
3. Compare again using the automated diff tooling.
4. Repeat until meaningful discrepancies are resolved or genuine platform/technical constraints prevent further refinement.

> **Rule:** Never claim "pixel-perfect" accuracy based only on subjective glance or successful compilation without screenshot diff evidence.

---

## Deliverables

Upon completion, provide an audit and implementation report containing:

- [ ] **Reference specification**: Key tokens, layout structure, and observed parameters
- [ ] **Files changed**: Complete list of modified, added, or deleted files
- [ ] **Implemented screen**: Summary of components and layout constructed
- [ ] **Visual comparison**: Before-and-after screenshots or annotated diffs when available
- [ ] **Remaining differences**: List of any residual discrepancies and their technical causes
- [ ] **Capture method**: Statement confirming whether captures were from real devices, simulators, or browser viewports

> **Goal:** A faithful, high-fidelity implementation of the supplied design — not an alternative design inspired by it.
