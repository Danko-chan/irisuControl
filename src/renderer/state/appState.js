export class AppState {
  constructor() {
    this.projects = [];
    this.groups = [];
    this.groupsCollapsed = {};
    this.processes = new Map();
    this.processLogs = new Map();
    this.activeProcessId = null;
    this.searchQuery = '';
    this.listeners = new Set();
    this.availableShells = [];
    this.selectedShell = null;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener());
  }

  async loadProjects() {
    this.projects = await window.irisucAPI.getProjects();
    this.notify();
  }

  async loadGroups() {
    this.groups = await window.irisucAPI.getGroups();
    this.groupsCollapsed = await window.irisucAPI.getGroupsCollapsed();
    this.notify();
  }

  async loadShells() {
    this.availableShells = await window.irisucAPI.getAvailableShells();
    this.selectedShell = await window.irisucAPI.getShellPreference();
    this.notify();
  }

  async setShell(shell) {
    await window.irisucAPI.setShellPreference(shell);
    this.selectedShell = shell;
    this.notify();
  }

  async toggleGroupCollapsed(groupId) {
    const result = await window.irisucAPI.toggleGroupCollapsed(groupId);
    if (result.success) {
      this.groupsCollapsed[groupId] = result.collapsed;
      this.notify();
    }
  }

  async addProject() {
    const result = await window.irisucAPI.addProject();
    if (result.success) {
      await this.loadProjects();
    }
    return result;
  }

  async removeProject(path) {
    await window.irisucAPI.removeProject(path);
    await this.loadProjects();
  }

  async updateProjectGroup(projectId, groupId) {
    await window.irisucAPI.updateProjectGroup(projectId, groupId);
    await this.loadProjects();
  }

  async createGroup(name, color) {
    const result = await window.irisucAPI.createGroup(name, color);
    if (result.success) {
      await this.loadGroups();
    }
    return result;
  }

  async updateGroup(groupId, updates) {
    await window.irisucAPI.updateGroup(groupId, updates);
    await this.loadGroups();
  }

  async deleteGroup(groupId) {
    await window.irisucAPI.deleteGroup(groupId);
    await this.loadGroups();
    await this.loadProjects();
  }

  async runScript(projectPath, scriptName, projectName) {
    const result = await window.irisucAPI.runScript(projectPath, scriptName, projectName, this.selectedShell);
    if (result.success) {
      this.processes.set(result.id, {
        id: result.id,
        projectName: result.projectName,
        scriptName: result.scriptName,
        status: 'running'
      });
      this.processLogs.set(result.id, []);
      this.activeProcessId = result.id;
      const shellInfo = result.shell ? ` (${result.shell})` : '';
      this.addLog(result.id, `\n▶ Running "${scriptName}" in ${projectName}${shellInfo}\n`, 'info');
      this.notify();
    }
    return result;
  }

  async stopProcess(id) {
    await window.irisucAPI.stopProcess(id);
    this.addLog(id, '\n⏹ Stop requested by user\n', 'info');
  }

  addLog(id, text, type = 'stdout') {
    if (!this.processLogs.has(id)) {
      this.processLogs.set(id, []);
    }
    this.processLogs.get(id).push({ text, type });
    this.notify();
  }

  markProcessExited(id, code) {
    const process = this.processes.get(id);
    if (process) {
      process.status = 'exited';
      const statusText = code === 0 ? 'completed successfully' : `exited with code ${code}`;
      this.addLog(id, `\n■ Process ${statusText}\n`, 'info');
      this.notify();
    }
  }

  setActiveProcess(id) {
    this.activeProcessId = id;
    this.notify();
  }

  setSearchQuery(query) {
    this.searchQuery = query.toLowerCase();
    this.notify();
  }

  getFilteredProjects() {
    if (!this.searchQuery) return this.projects;
    return this.projects.filter(p => 
      p.name.toLowerCase().includes(this.searchQuery) ||
      p.path.toLowerCase().includes(this.searchQuery)
    );
  }

  getProjectsByGroup() {
    const filtered = this.getFilteredProjects();
    const grouped = { ungrouped: [] };
    
    this.groups.forEach(group => {
      grouped[group.id] = [];
    });

    filtered.forEach(project => {
      if (project.groupId && grouped[project.groupId]) {
        grouped[project.groupId].push(project);
      } else {
        grouped.ungrouped.push(project);
      }
    });

    return grouped;
  }
}