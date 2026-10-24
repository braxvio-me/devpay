# Compare UI to Design — Audit Prompt

## Scope

Use the `compare-ui-to-design` skill to audit visual fidelity between the **running UI screenshot** and the **Figma export**, then mark every UI/UX difference found.

---

## Comparison Depth

Audit in strict **top-down hierarchy order**:

1. **Page layout** — overall composition, safe areas, screen edges
2. **Top-level modules** — major sections / containers
3. **Nested modules** — sub-sections, cards, rows, groups
4. **Element details** — individual components, atoms, icons, images

---

## Focus Areas

Inspect each layer of the hierarchy for differences in:

| Category | What to check |
|---|---|
| **Module layout** | Position, size, stacking, overlap, full-bleed vs contained |
| **Screen edges & safe areas** | Top / bottom insets, left / right rails, notch / home-indicator clearance, sticky headers & footers, edge-aligned controls |
| **Spacing** | Margin, padding, gap between elements, inner alignment |
| **Color** | Foreground, background, border, overlay |
| **Typography metrics** | Font size, line-height, letter-spacing, weight, baseline alignment, text-wrapping impact on layout |
| **Icons** | Size, color, alignment, correct asset |
| **Images** | Intrinsic size, aspect ratio, crop, scale, mask |
| **Gradients** | Direction, stops, opacity, blending |

---

## Ignore Rules

Skip these unless they **directly cause a layout change** in app-owned UI:

- Copy-only differences (labels, strings, counters, names, timestamps)
- Live / dynamic data differences (IDs, fetched values, list content)
- Device / system UI chrome (status bar, navigation bar, home indicator, simulator bezels)
- Anti-aliasing, compression artifacts, DPR rounding noise
- Cursor / caret state, animation frames, clocks, remote-image loading states

---

## Script Evidence Interpretation

When `visual_diff.py` reports a **broad parent region**, evaluate it fully before deciding to inspect children:

1. Read `finding_summary` — what the script concluded about the region
2. Read `review_guidance` — how to verify the finding
3. Read `edge_evidence` — whether the region touches a screen edge or has near-zero margins
4. Read `suppressed_child_count` — if > 0, treat the parent issue as the root cause; inspect suppressed children only for **independent** icon, image, typography, color, or border problems

Do **not** dismiss a broad parent region as a false positive just because it groups many child pixel differences.

---

## Image Inspection Sequence

For each reported marker, follow this exact order:

| Step | Images | Purpose |
|---|---|---|
| 1 | `annotated_actual.png` + `annotated_expected.png` | Side-by-side comparison using matching marker numbers and shared coordinates |
| 2 | `evidence_overlay_actual.png` + `evidence_overlay_expected.png` | Locate precise pixel evidence inside broad markers |
| 3 | `diff_graymap.png` | Confirm pixel-level delta magnitude |
| 4 | `diff_heatmap.png`, `diff_color_delta.png`, `diff_structure.png`, `diff_edges.png` | Characterise the type of difference (color vs structure vs edge) |
| 5 | `region_crops/<marker>/` | Crop pair for fine detail — use for typography, icons, borders, radius, color |
| 6 | `annotated_depth_actual.png` / `annotated_depth_expected.png` | Drilldown layer when a parent finding is understood |
| 7 | `annotated_raw_actual.png` / `annotated_raw_expected.png` | All raw pixel-evidence candidates (debug / edge-case use) |

---

## `regions.json` Fields to Inspect

Before writing the report, read these keys in `regions.json`:

- `visual_candidates` — screenshot-backed investigation pool (primary source)
- `actionable_issues` — screenshot-confirmed issues for the user-facing report
- `resolved_issues` — issues with a known root cause
- `deferred_visual_issues` — background / color / gradient / shadow issues (report after layout/text/icon)
- `unresolved_visual_candidates` — candidates that couldn't be classified
- `metadata_only_findings` — static evidence; needs screenshot confirmation before reporting
- `ui_nodes`, `node_matches`, `implementation_evidence` — node metadata for root-cause analysis
- `raw_pixel_regions` — raw pixel data; use as evidence/debug only

When an issue includes `delta`, `parent_delta`, `residual_delta`, `suppressed_children`, and `evidence`, use those fields to determine whether the fix belongs to a parent layout or a child node.

> **Rule:** Screenshot evidence is ground truth. Node / code metadata can *resolve or explain* a visible issue, but it must **never suppress** a rendered mismatch.

---

## Prioritization Order

Unless instructed otherwise, rank issues in this order:

1. Size / layout dimensions
2. Position / alignment
3. Relative relationship / spacing
4. Image or icon consistency
5. Font metrics / typography
6. Foreground color
7. Background color
8. Gradient
9. Shadow / effects (deferred)

---

## Output Format

```markdown
## Visual Differences

Annotated actual: /absolute/path/to/annotated_actual.png
Annotated design: /absolute/path/to/annotated_expected.png
Depth annotations: /absolute/path/to/annotated_depth_actual.png, /absolute/path/to/annotated_depth_expected.png
Raw annotations: /absolute/path/to/annotated_raw_actual.png, /absolute/path/to/annotated_raw_expected.png
Evidence overlays: /absolute/path/to/evidence_overlay_actual.png, /absolute/path/to/evidence_overlay_expected.png
Diff maps: /absolute/path/to/diff_heatmap.png, /absolute/path/to/diff_graymap.png, /absolute/path/to/diff_color_delta.png, /absolute/path/to/diff_structure.png, /absolute/path/to/diff_edges.png
Region crops: /absolute/path/to/region_crops

| # | Target | Region | Category | Difference |
|---|---|---|---|---|
| 1 | ProfileCard.badge.icon | x=120 y=84 w=48 h=20 | Position / Alignment | Icon residual dx=5px after parent dx=0px; adjust local padding/gap. |
| 2 | Header.title | x=24 y=308 w=327 h=24 | Typography Metrics | Text baseline is 3px lower and height is 2px taller than expected. |
| 3 | ProductCard | x=16 y=144 w=358 h=92 | Size / Layout | Card width is 12px wider; children share the same parent offset. |
| 4 | AppBackground | x=0 y=0 w=390 h=844 | Deferred Visual | Background color differs, but no structural node issue is attached. |

## Notes
- Screenshot size: <width>x<height>.
- Design normalization: expected image was proportionally fit into the actual screenshot canvas; no cropping was applied.
- Script evidence: use `actionable_issues` first; use `deferred_visual_issues` for background/color/gradient/shadow follow-up.
- Evidence resolution: `visual_candidates` are screenshot-first; `metadata_only_findings` are not user-facing issues unless a screenshot candidate supports them.
- Prioritization evidence: use priority_tier, category, severity_score, confidence, delta, parent_delta, residual_delta, suppressed_children, and region crop pairs to decide which issues matter most.
- Copy-only and live-data differences were ignored unless they affected layout.
- Device/system UI chrome, dynamic clock, and caret regions were ignored.
```

Keep the report **factual**. Avoid vague language like "looks different" unless followed by the specific location and visual property that differs.

---

## Resources

| File | Purpose |
|---|---|
| `scripts/visual_diff.py` | Deterministic image comparison and annotation CLI |
| `references/capture-checklist.md` | Capture rules for Web, Figma, simulators, and devices |
| `references/audit-rubric.md` | Top-down hierarchy, difference categories, tolerance policy, and reporting rules |
