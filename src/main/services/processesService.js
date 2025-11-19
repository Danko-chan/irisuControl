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
    // Unix-like systems
    const commonShells = [
      { name: 'Bash', value: '/bin/bash' },
      { name: 'Zsh', value: '/bin/zsh' },
      { name: 'Fish', value: '/usr/bin/fish' },
      { name: 'Dash', value: '/bin/dash' },
      { name: 'Sh', value: '/bin/sh' }
    ];
    
    // Add system default if different
    if (process.env.SHELL) {
      const systemShell = { name: 'System Default', value: process.env.SHELL };
      if (!commonShells.find(s => s.value === process.env.SHELL)) {
        shells.push(systemShell);
      }
    }
    
    shells.push(...commonShells);
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