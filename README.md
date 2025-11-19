IrisuControl

A clean and simple multi-project script runner built with Electron.
Manage multiple Node.js projects in one place, run scripts with one click, and organize everything with project groups.

Why I built IrisuControl

Working with several projects at once quickly became a hassle.
I constantly found myself:

opening multiple VS Code windows

switching between terminals

manually running scripts in each project

losing track of which script was running where

It was inefficient and messy — so I built IrisuControl to fix that.

Features
Project Management

Add/remove projects easily

Instant project search

Organize projects into custom groups

Editable group names & colors

Collapse/expand groups to reduce clutter

Script Runner

Auto-detects all npm scripts in each project

Run scripts with a single click

Each running script gets its own tab

Live log output viewer

Easy-to-switch between active processes

UI / UX

Clean sidebar layout

Smooth modal UI for creating/editing groups

Real-time color picker

Responsive interface for various window sizes

🖥️ Downloads

You can grab the latest builds from the Releases page:
https://github.com/yourname/irisuControl/releases

Windows

IrisuControl Setup x.x.x.exe

Linux

IrisuControl-x.x.x.AppImage

IrisuControl-x.x.x.tar.gz

How to Run From Source
git clone https://github.com/yourname/irisuControl.git
cd irisuControl
npm install
npm run start


For development:

npm run dev

Building
Linux
npm run build:linux

Windows

On Windows or Linux (with Wine installed):

npm run build:win


Generated files are placed in the release/ directory.

Project Structure
irisuControl/
├── src/
│   ├── main/        # Electron main process
│   ├── renderer/    # UI and frontend logic
│   └── ...
├── styles/
├── renderer.js
├── index.html
├── package.json
└── release/         # Build output (ignored in git)



Contributing

Contributions, ideas, and issue reports are welcome!
Feel free to open an issue or submit a pull request.

License

This project is licensed under the MIT License.
See the LICENSE file for details.