import { useEffect } from 'preact/hooks';

export function KeyboardShortcutsModal({ isOpen, onClose }) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modKey = isMac ? '⌘' : 'Ctrl';

    useEffect(() => {
        if (isOpen) {
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };
            window.addEventListener('keydown', handleEscape);
            return () => window.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const shortcuts = [
        {
            category: 'Navigation',
            items: [
                { keys: [modKey, 'K'], description: 'Focus search' },
                { keys: [modKey, '1-9'], description: 'Switch to tab 1-9' },
                { keys: ['Esc'], description: 'Close modal or deselect' },
            ]
        },
        {
            category: 'Actions',
            items: [
                { keys: [modKey, 'N'], description: 'Add new project' },
                { keys: [modKey, 'T'], description: 'Create new group' },
                { keys: [modKey, 'W'], description: 'Close active process tab' },
                { keys: [modKey, 'S'], description: 'Export current logs' },
            ]
        },
        {
            category: 'Help',
            items: [
                { keys: [modKey, '/'], description: 'Show this help dialog' },
            ]
        }
    ];

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-bg-secondary border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                <path d="M6 8h.01M10 8h.01M14 8h.01"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text-primary">Keyboard Shortcuts</h2>
                            <p className="text-sm text-text-tertiary">Master IrisuControl with these shortcuts</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-bg-tertiary hover:bg-bg-dark text-text-secondary hover:text-text-primary transition-all flex items-center justify-center"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)] scrollbar-custom">
                    <div className="space-y-6">
                        {shortcuts.map((section, idx) => (
                            <div key={idx}>
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary mb-3">
                                    {section.category}
                                </h3>
                                <div className="space-y-2">
                                    {section.items.map((shortcut, itemIdx) => (
                                        <div
                                            key={itemIdx}
                                            className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary hover:bg-bg-dark transition-all group"
                                        >
                                            <span className="text-sm text-text-primary group-hover:text-primary transition-colors">
                                                {shortcut.description}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                {shortcut.keys.map((key, keyIdx) => (
                                                    <div key={keyIdx} className="flex items-center gap-1">
                                                        <kbd className="px-2.5 py-1.5 min-w-[2rem] text-center text-xs font-semibold text-text-primary bg-bg-dark border border-border rounded-md shadow-sm">
                                                            {key}
                                                        </kbd>
                                                        {keyIdx < shortcut.keys.length - 1 && (
                                                            <span className="text-text-tertiary text-xs">+</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-bg-tertiary/50">
                    <p className="text-xs text-text-tertiary text-center">
                        Press <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-bg-dark border border-border rounded">Esc</kbd> or click outside to close
                    </p>
                </div>
            </div>
        </div>
    );
}
