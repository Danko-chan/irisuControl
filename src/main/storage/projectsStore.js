const fs = require('fs');
const path = require('path');
const { app } = require('electron');

let CONFIG_DIR;
let CONFIG_FILE;

function initPaths() {
  CONFIG_DIR = path.join(app.getPath('userData'));
  CONFIG_FILE = path.join(CONFIG_DIR, 'projects.json');
}

function ensureConfigExists() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ 
      projects: [],
      groups: []
    }, null, 2));
  }
}

function loadData() {
  initPaths();
  ensureConfigExists();
  const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  return {
    projects: data.projects || [],
    groups: data.groups || [],
    groupsCollapsed: data.groupsCollapsed || {},
    shellPreference: data.shellPreference || null
  };
}

function saveData(data) {
  initPaths();
  ensureConfigExists();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  loadData,
  saveData
};