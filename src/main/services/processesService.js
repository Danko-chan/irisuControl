const { spawn } = require('child_process');
const os = require('os');
const { loadData, saveData } = require('../storage/projectsStore');

const runningProcesses = new Map();

// Strip ANSI escape sequences (like cursor control, colors that we don't want to show as raw text)
function stripAnsiEscapeCodes(text) {
  // Remove ANSI escape sequences but keep the text
  // This regex removes control sequences like [?25h, [K, etc.
  return text.replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '');
}

// Get default shell based on platform
function getDefaultShell() {
  const platform = os.platform();
  if (platform === 'win32') {
    return process.env.COMSPEC || 'cmd.exe';
  }
  return process.env.SHELL || '/bin/bash';
}

// Get shell preferences from store
function setShellPreference(shell) {
  const data = loadData();
  data.shellPreference = shell;
  saveData(data);
}

function getShellPreference() {
  const data = loadData();
  return data.shellPreference || getDefaultShell();
}

function runScript(projectPath, scriptName, projectName, shell, onLog, onExit) {
  const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const shellToUse = shell || getShellPreference();
  const platform = os.platform();

  // Construct the command to run the npm script
  const npmCommand = `npm run ${scriptName}`;

  let child;

  // Spawn the process with proper shell handling
  if (platform === 'win32') {
    // Windows
    child = spawn(shellToUse, ['/c', npmCommand], {
      cwd: projectPath,
      env: { ...process.env },
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });
  } else {
    // Unix-like (Linux, macOS)
    child = spawn(shellToUse, ['-c', npmCommand], {
      cwd: projectPath,
      env: {
        ...process.env,
        FORCE_COLOR: '1',  // Enable colors in output
        NPM_CONFIG_COLOR: 'always'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });
  }

  runningProcesses.set(id, {
    process: child,
    projectName,
    scriptName,
    projectPath,
    shell: shellToUse
  });

  child.stdout.on('data', (data) => {
    const text = stripAnsiEscapeCodes(data.toString());
    if (text) onLog(id, 'stdout', text);
  });

  child.stderr.on('data', (data) => {
    const text = stripAnsiEscapeCodes(data.toString());
    if (text) onLog(id, 'stderr', text);
  });

  child.on('error', (error) => {
    onLog(id, 'stderr', `Process error: ${error.message}\n`);
  });

  child.on('close', (code, signal) => {
    runningProcesses.delete(id);
    if (signal) {
      onLog(id, 'info', `Process terminated by signal: ${signal}\n`);
    }
    onExit(id, code);
  });

  return { success: true, id, projectName, scriptName, shell: shellToUse };
}

function stopProcess(id) {
  const entry = runningProcesses.get(id);
  if (entry) {
    const platform = os.platform();

    // On Unix-like systems, kill the entire process group
    if (platform !== 'win32') {
      try {
        process.kill(-entry.process.pid, 'SIGTERM');
      } catch (e) {
        // Fallback to regular kill
        entry.process.kill('SIGTERM');
      }
    } else {
      // On Windows, use taskkill to kill the process tree
      const { exec } = require('child_process');
      exec(`taskkill /pid ${entry.process.pid} /T /F`, (error) => {
        if (error) {
          // Fallback to regular kill
          entry.process.kill();
        }
      });
    }

    runningProcesses.delete(id);
    return { success: true };
  }
  return { success: false, error: 'Process not found' };
}

function getAllRunningProcesses() {
  const list = [];
  runningProcesses.forEach((entry, id) => {
    list.push({
      id,
      projectName: entry.projectName,
      scriptName: entry.scriptName,
      shell: entry.shell
    });
  });
  return list;
}

function getAvailableShells() {
  const platform = os.platform();
  const fs = require('fs');
  const shells = [];

  if (platform === 'win32') {
    shells.push(
      { name: 'Command Prompt', value: 'cmd.exe' },
      { name: 'PowerShell', value: 'powershell.exe' },
      { name: 'PowerShell Core', value: 'pwsh.exe' }
    );
    if (process.env.COMSPEC) {
      shells.push({ name: 'System Default', value: process.env.COMSPEC });
    }
  } else {
    // Unix-like systems - check both /bin and /usr/bin
    const potentialShells = [
      { name: 'Bash', paths: ['/bin/bash', '/usr/bin/bash'] },
      { name: 'Zsh', paths: ['/bin/zsh', '/usr/bin/zsh'] },
      { name: 'Fish', paths: ['/usr/bin/fish', '/bin/fish'] },
      { name: 'Dash', paths: ['/bin/dash', '/usr/bin/dash'] },
      { name: 'Sh', paths: ['/bin/sh', '/usr/bin/sh'] }
    ];

    // Add system default first if available
    if (process.env.SHELL && fs.existsSync(process.env.SHELL)) {
      shells.push({ name: 'System Default', value: process.env.SHELL });
    }

    // Check which shells actually exist
    for (const shell of potentialShells) {
      for (const shellPath of shell.paths) {
        try {
          if (fs.existsSync(shellPath)) {
            // Only add if not already added as system default
            if (!shells.find(s => s.value === shellPath)) {
              shells.push({ name: shell.name, value: shellPath });
            }
            break; // Found this shell, move to next
          }
        } catch (e) {
          // Ignore errors and continue
        }
      }
    }

    // Fallback: if no shells found, add system default or /bin/sh
    if (shells.length === 0) {
      const fallback = process.env.SHELL || '/bin/sh';
      shells.push({ name: 'Default Shell', value: fallback });
    }
  }

  return shells;
}

module.exports = {
  runScript,
  stopProcess,
  getAllRunningProcesses,
  getAvailableShells,
  setShellPreference,
  getShellPreference
};