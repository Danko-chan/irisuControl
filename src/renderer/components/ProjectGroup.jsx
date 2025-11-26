import { ProjectCard } from './ProjectCard';

export function ProjectGroup({
    group,
    projects,
    isCollapsed,
    allGroups,
    onToggleCollapse,
    onEditGroup,
    onDeleteGroup,
    onUpdateProjectGroup,
    onRemoveProject,
    onRunScript,
    onToggleFavorite,
    isFavorite
}) {
    return (
        <div className="mb-3">
            {/* Group Header */}
            <div className="group/header flex items-center gap-2 px-3 py-2.5 mb-2 rounded-lg hover:bg-bg-tertiary/50 transition-all">
                <div
                    className="flex items-center gap-2 flex-1 cursor-pointer"
                    onClick={group ? onToggleCollapse : undefined}
                >
                    {group && (
                        <div className="flex items-center justify-center flex-shrink-0 transition-transform duration-200" style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-secondary">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    )}
                    <div
                        className="w-1 h-4 rounded-full shadow-sm transition-all"
                        style={{
                            backgroundColor: group?.color || 'var(--text-tertiary)',
                            boxShadow: group?.color ? `0 0 8px ${group.color}60` : 'none'
                        }}
                    ></div>
                    <div className="text-sm font-semibold text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">
                        {group ? group.name : 'Ungrouped'}
                    </div>
                    <div className="text-xs text-text-tertiary bg-bg-tertiary px-2 py-0.5 rounded-full">
                        {projects.length}
                    </div>
                </div>
                {group && (
                    <div className="flex gap-1 opacity-0 group-hover/header:opacity-100 transition-opacity">
                        <button
                            onClick={onEditGroup}
                            className="w-7 h-7 rounded-md bg-transparent text-text-secondary hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all"
                            title="Edit Group"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button
                            onClick={onDeleteGroup}
                            className="w-7 h-7 rounded-md bg-transparent text-text-secondary hover:bg-error/10 hover:text-error flex items-center justify-center transition-all"
                            title="Delete Group"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Projects */}
            {!isCollapsed && (
                <div className="space-y-2 pl-2">
                    {projects.map(project => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            allGroups={allGroups}
                            onUpdateGroup={onUpdateProjectGroup}
                            onRemove={onRemoveProject}
                            onRunScript={onRunScript}
                            onToggleFavorite={onToggleFavorite}
                            isFavorite={isFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
