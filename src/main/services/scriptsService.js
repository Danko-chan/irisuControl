const fs = require('fs');
const path = require('path');

function getProjectScripts(projectPath) {
  const pkgPath = path.join(projectPath, 'package.json');
  
  if (!fs.existsSync(pkgPath)) {
    return {};
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.scripts || {};
  } catch (e) {
    console.error('Error reading package.json:', e);
    return {};
  }
}

module.exports = {
  getProjectScripts
};
