
# IrisuControl

<div align="center">
  <img src="resources/icons/logo.png" alt="IrisuControl Logo" width="120" height="120">
  
  **A powerful multi-project script runner built with Electron**
  
  Manage multiple Node.js projects in one place, run scripts with one click, and organize everything with project groups.
  
  ![Electron](https://img.shields.io/badge/Electron-Latest-47848F?logo=electron)
  ![Preact](https://img.shields.io/badge/Preact-Latest-673AB8?logo=preact)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Latest-38B2AC?logo=tailwind-css)
  ![License](https://img.shields.io/badge/License-MIT-green)
</div>

---

## Why IrisuControl?

Working with several projects at once quickly became a hassle. I constantly found myself:

- Opening multiple VS Code windows
- Switching between terminals
- Manually running scripts in each project
- Losing track of which script was running where

It was inefficient and messy — so I built **IrisuControl** to fix that.

---

## Features

### Project Management
- **Add/Remove Projects** - Easily manage your project collection
- **Drag & Drop** - Add projects by dragging folders into the sidebar
- **Instant Search** - Quickly find projects with real-time search (Ctrl/Cmd+K)
- **Custom Groups** - Organize projects into color-coded groups
- **Editable Groups** - Customize group names and colors
- **Collapse/Expand** - Reduce clutter by collapsing groups
- **Recent Projects** - Track and access recently used projects

### Script Runner
- **Auto-Detection** - Automatically detects all npm scripts in each project
- **One-Click Execution** - Run scripts with a single click
- **Script Favorites** - Mark frequently used scripts for quick access
- **Tabbed Interface** - Each running script gets its own tab
- **Live Logs** - Real-time log output viewer with ANSI color support
- **Split View** - View multiple process logs side-by-side
- **Shell Selection** - Choose your preferred shell (bash, zsh, fish, etc.)

### Log Management
- **Export Logs** - Save process logs in TXT or JSON format (Ctrl/Cmd+S)
- **ANSI Colors** - Full support for colored terminal output
- **JSON Parsing** - Automatic JSON formatting in logs

### Keyboard Shortcuts
- **Ctrl/Cmd + K** - Focus search
- **Ctrl/Cmd + N** - Add new project
- **Ctrl/Cmd + T** - Create new group
- **Ctrl/Cmd + W** - Close active tab
- **Ctrl/Cmd + S** - Export logs
- **Ctrl/Cmd + /** - Show keyboard shortcuts help
- **Ctrl/Cmd + 1-9** - Switch between tabs
- **Escape** - Close modals

### UI / UX
- **Clean Sidebar** - Organized, intuitive layout
- **Smooth Modals** - Beautiful UI for creating/editing groups
- **Real-time Color Picker** - Live preview when selecting group colors
- **Responsive Design** - Adapts to various window sizes
- **Dark Theme** - Easy on the eyes with modern glassmorphism effects

---

## Downloads

You can grab the latest builds from the [Releases](https://github.com/Danko-chan/irisuControl/releases) page:

### Windows
- `IrisuControl-Setup-x.x.x.exe`

### Linux
- `IrisuControl-x.x.x.AppImage`
- `IrisuControl-x.x.x.tar.gz`

---

## Getting Started

### Run From Source

```bash
git clone https://github.com/Danko-chan/irisuControl.git
cd irisuControl
npm install
npm run dev
```

### Production Build

```bash
npm run start
```

---

## Building

### Linux
```bash
npm run build:linux
```

### Windows
On Windows or Linux (with Wine installed):
```bash
npm run build:win
```

Generated files are placed in the `release/` directory.

---

## Tech Stack

- **[Electron](https://www.electronjs.org/)** - Cross-platform desktop framework
- **[Preact](https://preactjs.com/)** - Fast 3kB alternative to React
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling
- **Node.js** - Backend process management

---

## Contributing

Contributions, ideas, and issue reports are welcome!

Feel free to:
- [Report bugs](https://github.com/Danko-chan/irisuControl/issues)
- [Suggest features](https://github.com/Danko-chan/irisuControl/issues)
- [Submit pull requests](https://github.com/Danko-chan/irisuControl/pulls)

---

## License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ for developers who juggle multiple projects
</div>