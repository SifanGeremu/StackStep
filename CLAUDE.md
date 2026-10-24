

## UI: Formic AI Design System

The web app is `client/`. All UI is built with Formic, vendored at `client/src/formic/`. Before writing or changing any UI, read `AGENTS.md` at the project root and follow its procedure from `client/`: import components from `src/formic/components` (never a raw <button>, <input>, <table> or <svg>; when a component you need is not in `src/formic/components` run `npx formicai add <name>` from `client/` (`npx formicai add --list` names them), never a stand-in; only when no Formic component exists at all, build one in `src/formic/components` from primitives and say so), use only the token utilities (`text-ink`, `bg-surface`, `text-body`, ...), never hardcode colours, font sizes, radii, shadows, or easings, and finish by running `npm run formic` from `client/` (or the repo root) until it passes.
