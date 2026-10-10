---
description: "Image-first website generation and implementation workflow. Use when visual quality matters and the work should begin with section reference images, then deeper analysis, then faithful code generation."
mode: agent
---

# image-to-code-skill

Use this skill for visually important website work where the design should be generated from reference imagery before coding.

## Core Directive

For high-visual UI tasks, the workflow is:

1. infer the section structure
2. generate the design image(s) first
3. deeply analyze the generated reference(s)
4. extract spacing, typography, buttons, hierarchy, colors, and layout logic
5. implement the website to match the reference closely

## Mandatory Rules

- Prefer one clear, readable image per section in Codex or similar environments.
- Do not rely on one tiny compressed multi-section board when better section-based analysis is possible.
- Do not crop old images when a fresh section-specific render would be clearer.
- Regenerate unclear sections as fresh standalone images instead of guessing.
- Keep the hero clean, spacious, and readable; avoid clutter in the first view.
- Avoid nested boxes, fake technical micro-labels, card-in-card layouts, and noisy UI clutter.
- Keep each page coherent: one strong visual direction, not a mashup of styles.
- Preserve extraction fidelity in implementation: spacing, hierarchy, typography, and CTA emphasis should remain consistent with the source image.

## Recommended Section Strategy

- 1 section → 1 image
- 4 sections → 4 strong section images
- 8 sections → 8 section images when reasonable
- Generate extra detail images only when needed for readability or precise extraction.

## Output Expectations

When visual website tasks are asked for:

- start with image generation if available
- analyze the design references before coding
- translate the visual system faithfully into the code
- avoid generic default templates that drift away from the source image

This is a premium, image-first design-to-code workflow, not a generic codex default.
