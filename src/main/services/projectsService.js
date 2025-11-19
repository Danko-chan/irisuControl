const fs = require('fs');
const path = require('path');
const { loadData, saveData } = require('../storage/projectsStore');

function getAllProjects() {
  const data = loadData();
  return data.projects;
}

function getAllGroups() {
  const data = loadData();
  return data.groups;
}

function getGroupsCollapsed() {
  const data = loadData();
  return data.groupsCollapsed || {};
}

function toggleGroupCollapsed(groupId) {
  const data = loadData();
  if (!data.groupsCollapsed) {
    data.groupsCollapsed = {};
  }
  data.groupsCollapsed[groupId] = !data.groupsCollapsed[groupId];
  saveData(data);
  return { success: true, collapsed: data.groupsCollapsed[groupId] };
}

function addProject(dirPath) {
  const pkgPath = path.join(dirPath, 'package.json');
  
  if (!fs.existsSync(pkgPath)) {
    return { success: false, error: 'No package.json in this folder' };
  }

  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  } catch (e) {
    return { success: false, error: 'Invalid package.json' };
  }

  const data = loadData();
  const exists = data.projects.find(p => p.path === dirPath);
  
  if (exists) {
    return { success: false, error: 'Project already exists' };
  }

  data.projects.push({
    id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: pkg.name || path.basename(dirPath),
    path: dirPath,
    groupId: null
  });

  saveData(data);
  return { success: true };
}

function removeProject(projectPath) {
  const data = loadData();
  data.projects = data.projects.filter(p => p.path !== projectPath);
  saveData(data);
  return { success: true };
}

function updateProjectGroup(projectId, groupId) {
  const data = loadData();
  const project = data.projects.find(p => p.id === projectId);
  if (project) {
    project.groupId = groupId;
    saveData(data);
    return { success: true };
  }
  return { success: false, error: 'Project not found' };
}

function createGroup(name, color) {
  const data = loadData();
  const newGroup = {
    id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    color: color || '#282268'
  };
  data.groups.push(newGroup);
  saveData(data);
  return { success: true, group: newGroup };
}

function updateGroup(groupId, updates) {
  const data = loadData();
  const group = data.groups.find(g => g.id === groupId);
  if (group) {
    Object.assign(group, updates);
    saveData(data);
    return { success: true };
  }
  return { success: false, error: 'Group not found' };
}

function deleteGroup(groupId) {
  const data = loadData();
  data.groups = data.groups.filter(g => g.id !== groupId);
  // Remove group assignment from projects
  data.projects.forEach(p => {
    if (p.groupId === groupId) {
      p.groupId = null;
    }
  });
  // Clear collapsed state for deleted group
  if (data.groupsCollapsed && data.groupsCollapsed[groupId] !== undefined) {
    delete data.groupsCollapsed[groupId];
  }
  saveData(data);
  return { success: true };
}

module.exports = {
  getAllProjects,
  getAllGroups,
  getGroupsCollapsed,
  toggleGroupCollapsed,
  addProject,
  removeProject,
  updateProjectGroup,
  createGroup,
  updateGroup,
  deleteGroup
};