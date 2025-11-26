export function ProjectCard({ project, allGroups, onUpdateGroup, onRemove, onRunScript, onToggleFavorite, isFavorite }) {
    const scriptNames = Object.keys(project.scripts || {});

    const handleGroupChange = (e) => {
        onUpdateGroup(project.id, e.target.value || null);
    };

    const handleRemove = () => {
        if (confirm(`Remove project "${project.name}"?`)) {
            onRemove(project.path);
        }
    };

    const handleRunScript = (scriptName) => {
        onRunScript(project.path, scriptName, project.name);
    };

    const handleToggleFavorite = (e, scriptName) => {
        e.stopPropagation();
        onToggleFavorite(project.path, project.name, scriptName);
    };

    return (
        <div className="bg-bg-tertiary border border-border rounded-lg p-3 mb-2 hover:border-primary hover:shadow-[0_0_0_1px_rgba(40,34,104,0.1)] transition-all">
            {/* Project Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-text-primary mb-1">
                        {project.name}
                    </div>
                    <div className="text-xs text-text-tertiary overflow-hidden text-ellipsis whitespace-nowrap">
                        {project.path}
                    </div>
                </div>
                <div className="flex gap-1.5 items-center ml-2">
                    <select
                        value={project.groupId || ''}
                        onChange={handleGroupChange}
                        className="px-2 py-1 bg-bg-secondary border border-border rounded-md text-text-secondary text-xs cursor-pointer focus:outline-none focus:border-primary"
                    >
                        <option value="">No group</option>
                        {allGroups.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleRemove}
                        className="w-6 h-6 rounded-md bg-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary flex items-center justify-center transition-all"
                        title="Remove Project"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Scripts */}
            <div className="flex flex-wrap gap-1.5">
                {scriptNames.length === 0 ? (
                    <div className="text-xs text-text-tertiary italic">No scripts available</div>
                ) : (
                    scriptNames.map(scriptName => {
                        const favorite = isFavorite(project.path, scriptName);
                        return (
                            <div key={scriptName} className="relative group/script">
                                <button
                                    onClick={() => handleRunScript(scriptName)}
                                    className={`px-3 py-1.5 pr-8 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-hover hover:-translate-y-0.5 active:translate-y-0 transition-all ${favorite ? 'ring-2 ring-yellow-400/50' : ''}`}
                                >
                                    {scriptName}
                                </button>
                                <button
                                    onClick={(e) => handleToggleFavorite(e, scriptName)}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded hover:bg-white/20 transition-all"
                                    title={favorite ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill={favorite ? 'currentColor' : 'none'}
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className={favorite ? 'text-yellow-300' : 'text-white/70'}
                                    >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
