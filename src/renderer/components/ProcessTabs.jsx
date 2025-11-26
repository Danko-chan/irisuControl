import { useState, useEffect } from 'preact/hooks';

export function ProcessTabs({ processes, activeProcessId, onSetActive, onStop, onClose }) {
    const processArray = Array.from(processes.values());
    const [runtimes, setRuntimes] = useState({});

    // Track runtime for running processes
    useEffect(() => {
        const interval = setInterval(() => {
            const newRuntimes = {};
            processArray.forEach(proc => {
                if (proc.status === 'running') {
                    const current = runtimes[proc.id] || 0;
                    newRuntimes[proc.id] = current + 1;
                } else {
                    newRuntimes[proc.id] = runtimes[proc.id] || 0;
                }
            });
            setRuntimes(newRuntimes);
        }, 1000);

        return () => clearInterval(interval);
    }, [processArray.length, runtimes]);

    const formatRuntime = (seconds) => {
        if (!seconds) return '0s';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    };

    const handleCloseTab = (e, processId) => {
        e.stopPropagation();
        if (onClose) {
            onClose(processId);
        }
    };

    if (processArray.length === 0) {
        return (
            <div className="flex gap-1 p-2 min-h-[52px]">
                <div className="flex items-center gap-2 px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-tertiary cursor-default">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                    </svg>
                    <span className="text-sm">No active processes</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-1 p-2 min-h-[52px]">
            {processArray.map(process => (
                <div
                    key={process.id}
                    onClick={() => onSetActive(process.id)}
                    className={`group flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all duration-200 whitespace-nowrap ${activeProcessId === process.id
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-bg-tertiary border-border hover:bg-bg-dark hover:border-primary hover:shadow-md'
                        }`}
                >
                    <div className="flex items-center gap-2 flex-1">
                        <div
                            className={`w-2 h-2 rounded-full transition-all ${process.status === 'running'
                                ? 'bg-success animate-pulse-slow shadow-sm shadow-success/50'
                                : 'bg-text-tertiary'
                                }`}
                        ></div>
                        <span className="text-sm font-medium">
                            {process.projectName} - {process.scriptName}
                        </span>
                        {process.status === 'running' && (
                            <span className="text-xs opacity-75">
                                {formatRuntime(runtimes[process.id])}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-0.5 items-center">
                        {process.status === 'running' && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStop(process.id);
                                }}
                                className={`w-5 h-5 rounded flex items-center justify-center transition-all hover:scale-110 ${activeProcessId === process.id
                                    ? 'text-white hover:bg-white/20'
                                    : 'text-error hover:bg-error/10'
                                    }`}
                                title="Stop Process"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="6" y="6" width="12" height="12" rx="1"></rect>
                                </svg>
                            </button>
                        )}
                        <button
                            onClick={(e) => handleCloseTab(e, process.id)}
                            className={`w-5 h-5 rounded flex items-center justify-center transition-all hover:scale-110 ${activeProcessId === process.id
                                ? 'text-white/80 hover:text-white hover:bg-white/20'
                                : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
                                }`}
                            title="Close Tab"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
