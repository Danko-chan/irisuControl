const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const STORE_PATH = path.join(app.getPath('userData'), 'recent-projects.json');
const MAX_RECENT = 10;

class RecentProjectsStore {
    constructor() {
        this.recentProjects = this.load();
    }

    load() {
        try {
            if (fs.existsSync(STORE_PATH)) {
                const data = fs.readFileSync(STORE_PATH, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading recent projects:', error);
        }
        return [];
    }

    save() {
        try {
            fs.writeFileSync(STORE_PATH, JSON.stringify(this.recentProjects, null, 2));
        } catch (error) {
            console.error('Error saving recent projects:', error);
        }
    }

    addProject(projectPath, projectName) {
        // Remove if already exists
        this.recentProjects = this.recentProjects.filter(p => p.path !== projectPath);

        // Add to beginning
        this.recentProjects.unshift({
            path: projectPath,
            name: projectName,
            lastAccessed: new Date().toISOString()
        });

        // Keep only MAX_RECENT items
        if (this.recentProjects.length > MAX_RECENT) {
            this.recentProjects = this.recentProjects.slice(0, MAX_RECENT);
        }

        this.save();
    }

    getRecentProjects() {
        return this.recentProjects;
    }

    removeProject(projectPath) {
        this.recentProjects = this.recentProjects.filter(p => p.path !== projectPath);
        this.save();
    }

    clear() {
        this.recentProjects = [];
        this.save();
    }
}

module.exports = new RecentProjectsStore();
