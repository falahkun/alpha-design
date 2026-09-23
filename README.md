# Aksa HTML Canvas v2

Preview-only React canvas for agent-generated mobile HTML, now with a prompt composer, pluggable Claude/Codex/Antigravity job connectors, execution status, and per-frame HTML snapshots/diff.

## Stack
- React + TypeScript + Vite
- Zustand: prompt, agent, selected frame, zoom and selected states
- TanStack Query: frame + job polling/cache
- Zod: runtime validation
- MCP: agent -> HTML publishing + job creation
- Local bridge: HTTP preview + generation job runner

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## v2 workflow

1. Pick an agent in Prompt Composer.
2. Edit one master prompt.
3. Choose any subset of Idle / Filled / Positive / Negative.
4. Click **Generate via …**.
5. The bridge creates `agent-workspace/jobs/<job-id>/PROMPT.md` and runs the configured adapter.
6. The agent publishes HTML to `agent-workspace/frames/*.html` through MCP.
7. React polls frames and job status.
8. Select a frame and inspect HTML Diff against its previous published snapshot.

## Agent connector configuration

The bridge does not guess vendor-specific CLI syntax. Configure explicit argv arrays with `AKSA_AGENT_COMMANDS_JSON` so the integration is auditable and safe from shell interpolation.

Example shape:

```bash
export AKSA_AGENT_COMMANDS_JSON='{
  "claude": ["YOUR_CLAUDE_COMMAND", "{{promptFile}}"],
  "codex": ["YOUR_CODEX_COMMAND", "{{promptFile}}"],
  "antigravity": ["YOUR_ANTIGRAVITY_COMMAND", "{{promptFile}}"]
}'
```

Supported placeholders:
- `{{promptFile}}` — absolute path to the generated PROMPT.md
- `{{jobId}}` — generation job id
- `{{root}}` — absolute `agent-workspace` path
- `{{states}}` — comma-separated requested states

The command is launched without a shell. This avoids shell expansion and keeps the bridge from inventing CLI syntax for tools whose invocation can vary by installation.

## MCP

Existing tools:
- `get_design_context`
- `get_login_prompt`
- `publish_frame_html`
- `get_frame_html`
- `list_frames`
- `create_generation_job`

Register with your agent according to its MCP configuration. The repository includes `.mcp.json`, `.codex/config.toml`, and `.agents/mcp_config.json` examples.

## HTML diff

Before a frame is overwritten, the bridge stores a snapshot under `agent-workspace/history/<state>/`. The current frame response includes `previousHtml`, which the React UI compares line-by-line.

## Security boundary

The iframe is sandboxed with `allow-scripts` only. Generated HTML is treated as untrusted preview content. For any non-local deployment, add a stricter CSP, origin isolation, and an HTML sanitizer.


## V3 canvas model

The UI is an infinite-canvas style workspace: every state is an independent movable artboard. Jobs are created per state, frames can be regenerated independently, and the selected frame exposes its HTML diff. Device presets are iPhone 17 (402×874), iPhone 17 Pro (402×873), and iPhone 17 Pro Max (440×956).
