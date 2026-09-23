# Aksa Agent Workspace Contract

## Write boundary

You may write only inside this directory, especially:
- `frames/*.html`
- `jobs/*/` when a generation job provides the directory

Do NOT modify the parent React application or infrastructure:
- `../src/**`
- `../package.json`
- `../vite.config.ts`
- `../tsconfig*.json`
- `../index.html`
- `../bridge/**`
- `../mcp/**`
- `../docs/**`

## Generation contract

For each requested generation, create exactly the requested states. Each state is a self-contained 402 × 874 HTML document for the iPhone 17 Pro preview.

Use the `publish_frame_html` MCP tool for publication. After publishing, call `list_frames` and verify the requested states exist.

Never replace the React renderer with generated React, Tailwind, or component-library code.
