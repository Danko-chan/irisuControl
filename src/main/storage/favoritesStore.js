const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const STORE_PATH = path.join(app.getPath('userData'), 'favorites.json');

class FavoritesStore {
    constructor() {
        this.favorites = this.load();
    }

    load() {
        try {
            if (fs.existsSync(STORE_PATH)) {
                const data = fs.readFileSync(STORE_PATH, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
        return [];
    }

    save() {
        try {
            fs.writeFileSync(STORE_PATH, JSON.stringify(this.favorites, null, 2));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }

    getFavorites() {
        return this.favorites;
    }

    isFavorite(projectPath, scriptName) {
        return this.favorites.some(
            f => f.projectPath === projectPath && f.scriptName === scriptName
        );
    }

    toggleFavorite(projectPath, projectName, scriptName) {
        const index = this.favorites.findIndex(
            f => f.projectPath === projectPath && f.scriptName === scriptName
        );

        if (index >= 0) {
            // Remove from favorites
            this.favorites.splice(index, 1);
            this.save();
            return { success: true, isFavorite: false };
        } else {
            // Add to favorites
            this.favorites.push({
                projectPath,
                projectName,
                scriptName,
                addedAt: new Date().toISOString()
            });
            this.save();
            return { success: true, isFavorite: true };
        }
    }

    removeFavorite(projectPath, scriptName) {
        this.favorites = this.favorites.filter(
            f => !(f.projectPath === projectPath && f.scriptName === scriptName)
        );
        this.save();
    }

    clear() {
        this.favorites = [];
        this.save();
    }
}

module.exports = new FavoritesStore();
