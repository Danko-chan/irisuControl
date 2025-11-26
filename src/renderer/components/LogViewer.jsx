import { useEffect, useRef, useState } from 'preact/hooks';

export function LogViewer({ processLogs, activeProcessId, processes, onExportLogs }) {
    const logContentRef = useRef(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        // Auto-scroll to bottom when new logs are added
        if (logContentRef.current) {
            logContentRef.current.scrollTop = logContentRef.current.scrollHeight;
        }
    }, [processLogs, activeProcessId]);

    // Close export menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setShowExportMenu(false);
        if (showExportMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showExportMenu]);

    const handleExport = async (format) => {
        setShowExportMenu(false);
        setIsExporting(true);

        const result = await onExportLogs(activeProcessId, format);

        setIsExporting(false);

        if (result.success && !result.canceled) {
            // Could show a success notification here
            console.log('Logs exported successfully to:', result.filePath);
        } else if (result.error) {
            console.error('Export failed:', result.error);
        }
    };

    if (!activeProcessId || !processes.has(activeProcessId)) {
        return (
            <div className="h-full bg-bg-secondary border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-4 text-text-tertiary">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
                <p className="text-sm">No process selected. Run a script to see logs here.</p>
            </div>
        );
    }

    const logs = processLogs.get(activeProcessId) || [];
    const hasLogs = logs.length > 0;

    return (
        <div className="h-full flex flex-col gap-3">
            {/* Export Button */}
            {hasLogs && (
                <div className="flex justify-end">
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowExportMenu(!showExportMenu);
                            }}
                            disabled={isExporting}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            <span className="text-sm font-medium">{isExporting ? 'Exporting...' : 'Export Logs'}</span>
                            {!isExporting && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {showExportMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-bg-secondary border border-border rounded-lg shadow-2xl overflow-hidden z-10">
                                <div className="p-1">
                                    <button
                                        onClick={() => handleExport('txt')}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-primary hover:bg-bg-tertiary rounded-md transition-colors"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                        </svg>
                                        <span>Plain Text (.txt)</span>
                                    </button>
                                    <button
                                        onClick={() => handleExport('json')}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-primary hover:bg-bg-tertiary rounded-md transition-colors"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <path d="M10 12h4"></path>
                                            <path d="M10 16h4"></path>
                                        </svg>
                                        <span>JSON (.json)</span>
                                    </button>
                                    <button
                                        onClick={() => handleExport('html')}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-primary hover:bg-bg-tertiary rounded-md transition-colors"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <path d="M9 15l2 2 4-4"></path>
                                        </svg>
                                        <span>HTML (.html)</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Logs Container */}
            <div
                ref={logContentRef}
                className="flex-1 bg-bg-secondary border border-border rounded-xl p-4 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap break-words scrollbar-custom"
            >
                {logs.map((log, index) => (
                    <div
                        key={index}
                        className={
                            log.type === 'stderr'
                                ? 'text-error'
                                : log.type === 'info'
                                    ? 'text-success font-medium'
                                    : 'text-text-primary'
                        }
                    >
                        {log.text}
                    </div>
                ))}
            </div>
        </div>
    );
}
