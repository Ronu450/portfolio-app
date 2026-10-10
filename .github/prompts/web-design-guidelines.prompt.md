---
description: "Web Interface Guidelines review skill. Use to audit a front-end against the latest Vercel web interface guidelines and report compliance issues in terse file:line format."
mode: agent
---

# web-design-guidelines

Review interface files against the latest Web Interface Guidelines.

## How It Works

1. Fetch the latest guidelines from:
   https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
2. Read the relevant files or ask the user for the file(s) to review.
3. Check all rules in the fetched guideline set.
4. Output findings in the terse `file:line` format required by the source rules.

## Usage

Use this when the user asks to:

- review my UI
- check accessibility
- audit design
- review UX
- check my site against best practices

## Review Workflow

- Read the requested files.
- Compare them against the current guidelines.
- Flag violations specifically and concisely.
- Prefer the expected `file:line` output format.
- If no files are specified, ask the user which files or patterns to review.

## Goal

Provide a strict, evidence-based audit of web interface compliance without overexplaining or inventing rules outside the current guidelines source.
