export class ProjectsView {
  constructor(state) {
    this.state = state;
    this.state.subscribe(() => this.render());
    this.setupEventListeners();
    this.editingGroupId = null;
  }

  setupEventListeners() {
    document.getElementById('addProjectBtn').onclick = () => this.handleAddProject();
    document.getElementById('searchInput').oninput = (e) => this.handleSearch(e);
    document.getElementById('addGroupBtn').onclick = () => this.showGroupModal();
    document.getElementById('closeModalBtn').onclick = () => this.hideGroupModal();
    document.getElementById('cancelGroupBtn').onclick = () => this.hideGroupModal();
    document.getElementById('saveGroupBtn').onclick = () => this.handleSaveGroup();
    document.getElementById('groupColorInput').oninput = (e) => {
      document.getElementById('colorValue').textContent = e.target.value;
    };
    document.getElementById('shellSelect').onchange = (e) => {
      this.state.setShell(e.target.value);
    };
  }

  async handleAddProject() {
    await this.state.addProject();
  }

  handleSearch(e) {
    this.state.setSearchQuery(e.target.value);
  }

  showGroupModal(group = null) {
    this.editingGroupId = group?.id || null;
    const modal = document.getElementById('groupModal');
    const title = document.getElementById('modalTitle');
    const nameInput = document.getElementById('groupNameInput');
    const colorInput = document.getElementById('groupColorInput');
    const colorValue = document.getElementById('colorValue');

    if (group) {
      title.textContent = 'Edit Group';
      nameInput.value = group.name;
      colorInput.value = group.color;
      colorValue.textContent = group.color;
    } else {
      title.textContent = 'Create Group';
      nameInput.value = '';
      colorInput.value = '#282268';
      colorValue.textContent = '#282268';
    }

    modal.classList.add('active');
  }

  hideGroupModal() {
    document.getElementById('groupModal').classList.remove('active');
    this.editingGroupId = null;
  }

  async handleSaveGroup() {
    const name = document.getElementById('groupNameInput').value.trim();
    const color = document.getElementById('groupColorInput').value;

    if (!name) return;

    if (this.editingGroupId) {
      await this.state.updateGroup(this.editingGroupId, { name, color });
    } else {
      await this.state.createGroup(name, color);
    }

    this.hideGroupModal();
  }

  render() {
    const container = document.getElementById('projectsContainer');
    const grouped = this.state.getProjectsByGroup();
    
    container.innerHTML = '';

    // Update shell selector
    this.renderShellSelector();

    // Render groups
    this.state.groups.forEach(group => {
      if (grouped[group.id].length > 0) {
        container.appendChild(this.renderGroup(group, grouped[group.id]));
      }
    });

    // Render ungrouped
    if (grouped.ungrouped.length > 0) {
      container.appendChild(this.renderGroup(null, grouped.ungrouped));
    }
  }

  renderShellSelector() {
    const select = document.getElementById('shellSelect');
    if (!this.state.availableShells || this.state.availableShells.length === 0) {
      return;
    }

    select.innerHTML = '';
    this.state.availableShells.forEach(shell => {
      const option = document.createElement('option');
      option.value = shell.value;
      option.textContent = shell.name;
      if (shell.value === this.state.selectedShell) {
        option.selected = true;
      }
      select.appendChild(option);
    });
  }

  renderGroup(group, projects) {
    const groupEl = document.createElement('div');
    groupEl.className = 'project-group';

    const header = document.createElement('div');
    header.className = 'group-header';
    
    const leftSection = document.createElement('div');
    leftSection.className = 'group-header-left';
    leftSection.onclick = () => {
      if (group) {
        this.state.toggleGroupCollapsed(group.id);
      }
    };

    const collapseIcon = document.createElement('div');
    collapseIcon.className = 'collapse-icon';
    const isCollapsed = group && this.state.groupsCollapsed[group.id];
    collapseIcon.innerHTML = isCollapsed 
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>'
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    
    const indicator = document.createElement('div');
    indicator.className = 'group-indicator';
    if (group) {
      indicator.style.backgroundColor = group.color;
    }

    const title = document.createElement('div');
    title.className = 'group-title';
    title.textContent = group ? group.name : 'Ungrouped';

    leftSection.appendChild(collapseIcon);
    leftSection.appendChild(indicator);
    leftSection.appendChild(title);

    const actions = document.createElement('div');
    actions.className = 'group-actions';

    if (group) {
      const editBtn = document.createElement('button');
      editBtn.className = 'btn-icon-small';
      editBtn.title = 'Edit Group';
      editBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
      editBtn.onclick = (e) => {
        e.stopPropagation();
        this.showGroupModal(group);
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn-icon-small';
      deleteBtn.title = 'Delete Group';
      deleteBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        if (confirm(`Delete group "${group.name}"?`)) {
          this.state.deleteGroup(group.id);
        }
      };

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
    }

    header.appendChild(leftSection);
    header.appendChild(actions);
    groupEl.appendChild(header);

    // Projects container (collapsible)
    if (!isCollapsed) {
      const projectsContainer = document.createElement('div');
      projectsContainer.className = 'group-projects';
      
      projects.forEach(project => {
        projectsContainer.appendChild(this.renderProject(project, group));
      });

      groupEl.appendChild(projectsContainer);
    }

    return groupEl;
  }

  renderProject(project, group) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const header = document.createElement('div');
    header.className = 'project-header';

    const info = document.createElement('div');
    info.className = 'project-info';

    const name = document.createElement('div');
    name.className = 'project-name';
    name.textContent = project.name;

    const path = document.createElement('div');
    path.className = 'project-path';
    path.textContent = project.path;

    info.appendChild(name);
    info.appendChild(path);

    const actions = document.createElement('div');
    actions.className = 'project-actions';

    // Group selector
    const groupSelect = document.createElement('select');
    groupSelect.className = 'group-select';
    groupSelect.innerHTML = '<option value="">No group</option>';
    this.state.groups.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.id;
      opt.textContent = g.name;
      opt.selected = project.groupId === g.id;
      groupSelect.appendChild(opt);
    });
    groupSelect.onchange = () => {
      this.state.updateProjectGroup(project.id, groupSelect.value || null);
    };

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-icon-small';
    removeBtn.title = 'Remove Project';
    removeBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    removeBtn.onclick = () => {
      if (confirm(`Remove project "${project.name}"?`)) {
        this.state.removeProject(project.path);
      }
    };

    actions.appendChild(groupSelect);
    actions.appendChild(removeBtn);

    header.appendChild(info);
    header.appendChild(actions);

    const scripts = document.createElement('div');
    scripts.className = 'project-scripts';

    const scriptNames = Object.keys(project.scripts || {});
    if (scriptNames.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-scripts';
      empty.textContent = 'No scripts available';
      scripts.appendChild(empty);
    } else {
      scriptNames.forEach(scriptName => {
        const btn = document.createElement('button');
        btn.className = 'script-btn';
        btn.textContent = scriptName;
        btn.onclick = () => {
          this.state.runScript(project.path, scriptName, project.name);
        };
        scripts.appendChild(btn);
      });
    }

    card.appendChild(header);
    card.appendChild(scripts);

    return card;
  }
}