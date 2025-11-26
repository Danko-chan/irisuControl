import { useEffect } from 'preact/hooks';

/**
 * Custom hook to manage global keyboard shortcuts
 * @param {Object} handlers - Object containing shortcut handlers
 * @param {Function} handlers.onSearch - Handler for Ctrl/Cmd + K (focus search)
 * @param {Function} handlers.onAddProject - Handler for Ctrl/Cmd + N (add project)
 * @param {Function} handlers.onCloseTab - Handler for Ctrl/Cmd + W (close active tab)
 * @param {Function} handlers.onNewGroup - Handler for Ctrl/Cmd + T (new group)
 * @param {Function} handlers.onExportLogs - Handler for Ctrl/Cmd + S (export logs)
 * @param {Function} handlers.onShowHelp - Handler for Ctrl/Cmd + / (show shortcuts)
 * @param {Function} handlers.onSwitchTab - Handler for Ctrl/Cmd + 1-9 (switch tabs)
 * @param {Function} handlers.onEscape - Handler for Escape key
 */
export function useKeyboardShortcuts(handlers) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifier = isMac ? e.metaKey : e.ctrlKey;

            // Ctrl/Cmd + K - Focus search
            if (modifier && e.key === 'k') {
                e.preventDefault();
                handlers.onSearch?.();
                return;
            }

            // Ctrl/Cmd + N - Add new project
            if (modifier && e.key === 'n') {
                e.preventDefault();
                handlers.onAddProject?.();
                return;
            }

            // Ctrl/Cmd + W - Close active tab
            if (modifier && e.key === 'w') {
                e.preventDefault();
                handlers.onCloseTab?.();
                return;
            }

            // Ctrl/Cmd + T - New group
            if (modifier && e.key === 't') {
                e.preventDefault();
                handlers.onNewGroup?.();
                return;
            }

            // Ctrl/Cmd + S - Export logs
            if (modifier && e.key === 's') {
                e.preventDefault();
                handlers.onExportLogs?.();
                return;
            }

            // Ctrl/Cmd + / - Show keyboard shortcuts help
            if (modifier && e.key === '/') {
                e.preventDefault();
                handlers.onShowHelp?.();
                return;
            }

            // Ctrl/Cmd + 1-9 - Switch between tabs
            if (modifier && e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                const tabIndex = parseInt(e.key) - 1;
                handlers.onSwitchTab?.(tabIndex);
                return;
            }

            // Escape - Close modals or deselect
            if (e.key === 'Escape') {
                handlers.onEscape?.();
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handlers]);

    // Helper function to get the modifier key name for display
    const getModifierKey = () => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        return isMac ? '⌘' : 'Ctrl';
    };

    return { getModifierKey };
}
