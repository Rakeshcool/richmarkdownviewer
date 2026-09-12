# Markdown Browser

A browser-based, desktop-like Markdown reader that opens local files and folders and renders them in a polished, ChatGPT-style interface. No backend, no database, no authentication — just Markdown reading in the browser. Also ships as a native desktop app via Tauri.

## Features

- **Local-first** — open `.md` files or entire folders via the File System Access API
- **ChatGPT-style rendering** — headings, lists, tables, code blocks with syntax highlighting, math, images, and more
- **Syntax highlighting** — powered by Shiki
- **Math support** — inline and block LaTeX via KaTeX
- **Sidebar file tree** — collapsible, resizable, with search
- **Tabs** — open multiple documents, switch between them, remember scroll position
- **View history** — recently viewed files are listed in the top bar and remain viewable even after the workspace is closed
- **Editing** — toggle any Markdown file into edit mode (pencil icon in the top bar), save with `Ctrl/Cmd+S`
- **Search** — filename and content search across the workspace
- **Themes** — light, dark, and system modes
- **Keyboard shortcuts** — `Ctrl/Cmd+O` open file, `Ctrl/Cmd+Shift+O` open folder, `Ctrl/Cmd+P` quick search, `Ctrl/Cmd+B` toggle sidebar, `Ctrl/Cmd+S` save
- **Responsive** — works on desktop, tablet, and mobile
- **Cross-platform desktop** — native `.exe` (Windows), `.dmg` (macOS), `.deb` / `.AppImage` (Linux) via Tauri
- **Read/edit modes** — read by default; one click switches to a distraction-free Markdown editor

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 19 + TypeScript |
| Bundler | Vite 8 |
| Markdown | react-markdown, remark-gfm, remark-math, rehype-katex |
| Syntax highlighting | Shiki |
| State | Zustand |
| Editing | Plain textarea with unsaved-changes tracking (dirty dot) and Ctrl+S save |
| Styling | Plain CSS with CSS variables |
| Desktop | Tauri 2 |
| Testing | Vitest + Testing Library + jsdom |
| Linting | Oxlint |

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or pnpm / yarn — adjust commands accordingly)
- **Rust** (stable) — required only for building the desktop app via Tauri
- **Chromium-based browser** (Chrome / Edge) for the File System Access API. Other browsers fall back to a standard file picker.

### Platform-specific requirements for desktop builds

| Platform | Additional dependencies |
|----------|----------------------|
| **Windows** | Visual Studio Build Tools (MSVC) |
| **macOS** | Xcode Command Line Tools (`xcode-select --install`) |
| **Linux** | `libwebkit2gtk-4.1-dev`, `libappindicator3-dev`, `librsvg2-dev`, `patchelf` |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Rakeshcool/richmarkdownviewer.git
cd richmarkdownviewer

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Vite will print a local URL (default `http://localhost:5173`). Open it in Chrome or Edge.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check with `tsc` then produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally for preview |
| `npm run test` | Run tests once with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint with Oxlint |
| `npm run tauri dev` | Run as a native desktop window with hot-reload |
| `npm run tauri build` | Build a native desktop app for the current platform |

## Project Structure

```
├── examples/                 # Sample Markdown files for testing the renderer
│   ├── basic.md
│   ├── code.md
│   ├── complex.md
│   ├── math.md
│   └── tables.md
├── public/                   # Static assets (favicon, icons)
├── src/
│   ├── app/                  # App shell and layout
│   ├── components/           # UI components
│   │   ├── Breadcrumbs/
│   │   ├── DocumentOutline/
│   │   ├── FileTree/         # FileItem, FolderItem, FileTree
│   │   ├── Search/
│   │   ├── Sidebar/
│   │   ├── StatusBar/
│   │   ├── TabBar/
│   │   └── TopBar/
│   ├── filesystem/           # File System Access API, fallback, path utils
│   ├── hooks/                # useWorkspace, useTheme, useSearch
│   ├── markdown/             # ChatRenderer, plugins, custom components (CodeBlock, Table, etc.)
│   ├── state/                # Zustand app state
│   ├── styles/               # CSS variables, global, layout, and markdown styles
│   ├── test/                 # Vitest tests
│   ├── types/                # Shared TypeScript types
│   └── utils/                # Utility functions
├── src-tauri/                # Tauri desktop app configuration
│   ├── icons/                # App icons for all platforms
│   ├── src/                  # Rust entry point (main.rs, lib.rs)
│   ├── Cargo.toml            # Rust dependencies
│   └── tauri.conf.json       # Tauri configuration
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── package.json
```

## Browser Compatibility

The app targets **Chromium-based browsers** (Chrome, Edge, Arc, etc.) which support the File System Access API for native folder and file selection.

On browsers without this API (Firefox, Safari), the app falls back to a standard `<input type="file">` picker. You'll see a message explaining the limitation.

## Saving & Permissions

When opening files/folders the app requests **read/write** permission up front, so saving with `Ctrl/Cmd+S` writes straight back to disk via the File System Access API. If a handle isn't available (e.g. fallback picker), saving offers the edited file as a download so no work is lost.

## Styling

All colors and spacing are defined through CSS custom properties in `src/styles/variables.css`. Switching themes swaps the set of variables — no hardcoded colors in components.

## Testing

Tests cover Markdown rendering, filesystem operations, tabs, search, and path utilities:

```bash
npm test
```

## Desktop App (Tauri)

The project includes [Tauri](https://tauri.app) for building a native desktop application.

### Run in dev mode

```bash
npm run tauri dev
```

This launches a native window running the Vite dev server with hot-reload.

### Build a desktop executable

```bash
npm run tauri build
```

The build is **cross-platform** — run it on the target OS and it produces native output:

| Platform | Output |
|----------|--------|
| **Windows** | `.exe` + NSIS installer in `src-tauri/target/release/bundle/nsis/` |
| **macOS** | `.app` + `.dmg` in `src-tauri/target/release/bundle/dmg/` |
| **Linux** | `.deb` + `.AppImage` in `src-tauri/target/release/bundle/deb/` and `bundle/appimage/` |

The standalone `.exe` / binary is also available at `src-tauri/target/release/app.exe` (Windows) or `src-tauri/target/release/app` (macOS/Linux).

### Build output cleanup

The `src-tauri/target/release/` directory can grow to ~1.4 GB. The only files you need to distribute are:

- `app.exe` (or `app`) — the standalone executable
- `bundle/` — the platform installer

Everything else (`deps/`, `build/`, `incremental/`) is build cache that can be safely deleted. It will be regenerated on the next build.

## License

This project is private and does not yet have a public license.
