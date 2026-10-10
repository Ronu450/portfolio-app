---
description: "TasteSkill anti-slop design QA for UI output. Use for reviewing or generating layouts, components, pages, forms, dashboards, and styling decisions with stronger spacing, hierarchy, typography, contrast, and accessibility standards."
mode: agent
---

# taste-default

TasteSkill — Default design-quality rules for UI output. This skill enforces the fundamentals that distinguish intentional design from generic AI slop.

## When to Use

Use this skill for any UI task: pages, cards, forms, dashboards, landing pages, settings screens, or design review. It applies to HTML, React, Vue, Svelte, or any interface rendered on screen.

## Core Rules

- Use a consistent spacing scale such as 4, 8, 12, 16, 24, 32, 48, 64. Avoid magic numbers.
- Keep typefaces to a maximum of 2. Define a type scale and stay consistent.
- Limit the palette to 1 accent color plus neutrals. Derive hover, active, and disabled states from the same hue.
- Maintain WCAG AA contrast minimums: 4.5:1 for body text and 3:1 for large text.
- Align elements to a visible or implied grid. Avoid orphaned offsets.
- Give each screen one clear primary action.
- Prefer generous spacing and deliberate density, not clutter.
- Use borders sparingly; spacing and background changes usually work better.

## Procedure

1. Identify the single most important action on the screen.
2. Choose a spacing scale and apply it consistently.
3. Define a clear type hierarchy with no more than 3 sizes per view.
4. Pick one accent color and derive all states from it.
5. Build from the content out instead of forcing arbitrary grid layout.
6. Review for red flags:
   - more than 3 font sizes in one view
   - spacing values outside the scale
   - multiple competing accent colors
   - contrast below accessibility minimums
   - more than one primary-styled button
   - borders replacing useful spacing or tonal contrast
   - excessive shadow layering
7. Fix red flags before presenting the result.

## Anti-patterns to Avoid

- “Make it pop” by stacking gradients, shadows, borders, and accent colors at once.
- Icon soup with unlabeled icons.
- Premature dark mode before the light mode is strong.
- Responsive layout that only works after the fact.

## Output Standard

When presenting UI, prefer:

- clear hierarchy
- consistent spacing
- readable type
- strong contrast
- a single clear primary action
- disciplined visual restraint

Do not ship a screen that feels visually noisy, inconsistent, or overloaded.
