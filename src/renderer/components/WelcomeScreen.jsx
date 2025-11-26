import { useState } from 'preact/hooks';

export function WelcomeScreen({ onAddProject }) {
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

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const entry = item.webkitGetAsEntry();
                if (entry && entry.isDirectory) {
                    const result = await window.irisucAPI.addProjectByPath(entry.fullPath);
                    if (result.success) {
                        // Reload projects will be triggered by parent component
                        console.log('Project added:', entry.fullPath);
                    } else {
                        console.error('Failed to add project:', result.error);
                    }
                }
            }
        }
    };

    return (
        <div
            className="h-full flex items-center justify-center bg-gradient-to-br from-bg-dark via-bg-secondary to-bg-dark"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className={`text-center max-w-md px-8 animate-in fade-in zoom-in-95 duration-500 transition-all ${isDragging ? 'scale-95 opacity-50' : ''}`}>
                {/* Logo */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className={`absolute inset-0 blur-3xl rounded-full transition-all ${isDragging ? 'bg-success/30' : 'bg-primary/20'}`}></div>
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="relative">
                            <rect x="3" y="3" width="7" height="7" rx="1" fill="url(#gradient1)" />
                            <rect x="3" y="13" width="7" height="7" rx="1" fill="url(#gradient2)" />
                            <rect x="13" y="3" width="7" height="7" rx="1" fill="url(#gradient3)" />
                            <rect x="13" y="13" width="7" height="7" rx="1" fill="url(#gradient4)" />
                            <defs>
                                <linearGradient id="gradient1" x1="3" y1="3" x2="10" y2="10">
                                    <stop offset="0%" stopColor="#282268" />
                                    <stop offset="100%" stopColor="#3a2f8f" />
                                </linearGradient>
                                <linearGradient id="gradient2" x1="3" y1="13" x2="10" y2="20">
                                    <stop offset="0%" stopColor="#3a2f8f" />
                                    <stop offset="100%" stopColor="#6366f1" />
                                </linearGradient>
                                <linearGradient id="gradient3" x1="13" y1="3" x2="20" y2="10">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                                <linearGradient id="gradient4" x1="13" y1="13" x2="20" y2="20">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* Welcome Text */}
                <h2 className="text-3xl font-bold text-text-primary mb-3">
                    {isDragging ? 'Drop to Add Project' : 'Welcome to IrisuControl'}
                </h2>
                <p className="text-text-secondary mb-8 leading-relaxed">
                    {isDragging
                        ? 'Release to add your project folder'
                        : 'Manage all your projects and npm scripts in one place. Get started by adding your first project.'}
                </p>

                {/* Add Project Button */}
                {!isDragging && (
                    <button
                        onClick={onAddProject}
                        className="group relative px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium text-base transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 active:translate-y-0"
                    >
                        <div className="flex items-center gap-3">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-90 transition-transform duration-300">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            <span>Add Your First Project</span>
                        </div>
                    </button>
                )}

                {/* Helper Text */}
                <p className="mt-6 text-sm text-text-tertiary flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                    </svg>
                    {isDragging
                        ? 'Drop your project folder here'
                        : 'Drag & drop folders here or click the + button in the sidebar'}
                </p>
            </div>

            {/* Drag Overlay */}
            {isDragging && (
                <div className="absolute inset-0 border-4 border-dashed border-success rounded-2xl m-4 pointer-events-none animate-pulse"></div>
            )}
        </div>
    );
}
