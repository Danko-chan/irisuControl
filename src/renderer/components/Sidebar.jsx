import { useState } from 'preact/hooks';
import { ProjectGroup } from './ProjectGroup';

export function Sidebar({ state, onOpenGroupModal, searchInputRef, onShowShortcuts }) {
    const grouped = state.getProjectsByGroup();
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const items = e.dataTransfer.items;
        if (!items) return;

        let addedCount = 0;
        let errors = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const entry = item.webkitGetAsEntry();
                if (entry && entry.isDirectory) {
                    try {
                        const result = await window.irisucAPI.addProjectByPath(entry.fullPath);
                        if (result.success) {
                            console.log('Project added:', entry.fullPath);
                            addedCount++;
                        } else {
                            console.error('Failed to add project:', result.error);
                            errors.push(`${entry.name}: ${result.error}`);
                        }
                    } catch (error) {
                        console.error('Error adding project:', error);
                        errors.push(`${entry.name}: ${error.message}`);
                    }
                }
            }
        }

        // Reload projects if any were added
        if (addedCount > 0) {
            // Reload projects from state
            await state.loadProjects();
        }

        // Show errors if any
        if (errors.length > 0) {
            alert(`Failed to add some projects:\n${errors.join('\n')}`);
        }
    };

    const handleAddProject = async () => {
        await state.addProject();
    };

    const handleSearchChange = (e) => {
        state.setSearchQuery(e.target.value);
    };

    const handleShellChange = (e) => {
        state.setShell(e.target.value);
    };

    return (
        <aside className="w-[360px] bg-bg-secondary border-r border-border flex flex-col overflow-hidden">
            {/* Header */}
            <div
                className={`flex items-center justify-between p-4 border-b transition-all ${isDragging ? 'border-success bg-success/10' : 'border-border'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex items-center gap-3 text-primary">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" />
                        <rect x="3" y="13" width="7" height="7" rx="1" fill="currentColor" />
                        <rect x="13" y="3" width="7" height="7" rx="1" fill="currentColor" />
                        <rect x="13" y="13" width="7" height="7" rx="1" fill="currentColor" />
                    </svg>
                    <h1 className="text-lg font-semibold text-text-primary">IrisuControl</h1>
                </div>
                <div className="flex items-center gap-2">
                    <div className="group/tooltip relative">
                        <button
                            onClick={onShowShortcuts}
                            className="w-9 h-9 rounded-lg bg-bg-tertiary text-text-secondary hover:text-primary hover:bg-bg-dark flex items-center justify-center transition-all hover:scale-105"
                            title="Keyboard Shortcuts"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                <path d="M6 8h.01M10 8h.01M14 8h.01"></path>
                            </svg>
                        </button>
                        {/* Tooltip */}
                        <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-xs text-text-primary whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-10 shadow-lg">
                            Keyboard Shortcuts
                            <div className="absolute -top-1 right-3 w-2 h-2 bg-bg-tertiary border-l border-t border-border rotate-45"></div>
                        </div>
                    </div>
                    <div className="group/tooltip relative">
                        <button
                            onClick={handleAddProject}
                            className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                            title="Add Project"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                        {/* Tooltip */}
                        <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-xs text-text-primary whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-10 shadow-lg">
                            Add Project Folder
                            <div className="absolute -top-1 right-3 w-2 h-2 bg-bg-tertiary border-l border-t border-border rotate-45"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Search */}
            <div className="relative p-3 border-b border-border">
                <svg className="absolute left-7 top-1/2 -translate-y-1/2 text-text-tertiary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                    ref={searchInputRef}
                    type="text"
                    value={state.searchQuery}
                    onInput={handleSearchChange}
                    placeholder="Search projects..."
                    className="w-full pl-9 pr-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-primary focus:bg-bg-dark transition-all"
                />
            </div>

            {/* Shell Selector */}
            <div className="px-4 py-2 border-b border-border">
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-1.5 cursor-default">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="4 17 10 11 4 5"></polyline>
                        <line x1="12" y1="19" x2="20" y2="19"></line>
                    </svg>
                    <span>Shell</span>
                </label>
                <select
                    value={state.selectedShell || ''}
                    onChange={handleShellChange}
                    className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-md text-text-primary text-xs cursor-pointer hover:border-primary focus:outline-none focus:border-primary focus:bg-bg-dark transition-all"
                >
                    {state.shellsLoading ? (
                        <option value="">Loading...</option>
                    ) : state.availableShells.length === 0 ? (
                        <option value="/bin/bash">Default Shell</option>
                    ) : (
                        state.availableShells.map(shell => (
                            <option key={shell.value} value={shell.value}>{shell.name}</option>
                        ))
                    )}
                </select>
            </div>

            {/* Groups Header */}
            <div className="flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                <span>Groups</span>
                <button
                    onClick={() => onOpenGroupModal()}
                    className="w-6 h-6 rounded-md bg-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary flex items-center justify-center transition-all"
                    title="Add Group"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>

            {/* Projects Container */}
            <div className="flex-1 overflow-y-auto px-2 scrollbar-custom">
                {state.groups.map(group => (
                    grouped[group.id]?.length > 0 && (
                        <ProjectGroup
                            key={group.id}
                            group={group}
                            projects={grouped[group.id]}
                            isCollapsed={state.groupsCollapsed[group.id]}
                            allGroups={state.groups}
                            onToggleCollapse={() => state.toggleGroupCollapsed(group.id)}
                            onEditGroup={() => onOpenGroupModal(group)}
                            onDeleteGroup={() => {
                                if (confirm(`Delete group "${group.name}"?`)) {
                                    state.deleteGroup(group.id);
                                }
                            }}
                            onUpdateProjectGroup={state.updateProjectGroup}
                            onRemoveProject={state.removeProject}
                            onRunScript={state.runScript}
                            onToggleFavorite={state.toggleFavorite}
                            isFavorite={state.isFavorite}
                        />
                    )
                ))}
                {grouped.ungrouped?.length > 0 && (
                    <ProjectGroup
                        group={null}
                        projects={grouped.ungrouped}
                        isCollapsed={false}
                        allGroups={state.groups}
                        onUpdateProjectGroup={state.updateProjectGroup}
                        onRemoveProject={state.removeProject}
                        onRunScript={state.runScript}
                        onToggleFavorite={state.toggleFavorite}
                        isFavorite={state.isFavorite}
                    />
                )}
            </div>
        </aside>
    );
}
