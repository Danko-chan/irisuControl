import { useState, useRef, useCallback } from 'preact/hooks';
import { useAppState } from './hooks/useAppState';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { GroupModal } from './components/GroupModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';

export function App() {
    const state = useAppState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
    const searchInputRef = useRef(null);

    const openModal = useCallback((group = null) => {
        setEditingGroup(group);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setEditingGroup(null);
        setIsModalOpen(false);
    }, []);

    // Keyboard shortcut handlers - memoized to prevent unnecessary re-renders
    const onSearch = useCallback(() => {
        // Focus search input - will be passed to Sidebar via ref
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    const onAddProject = useCallback(() => {
        state.addProject();
    }, [state.addProject]);

    const onCloseTab = useCallback(() => {
        if (state.activeProcessId) {
            state.closeProcessTab(state.activeProcessId);
        }
    }, [state.activeProcessId, state.closeProcessTab]);

    const onNewGroup = useCallback(() => {
        openModal();
    }, [openModal]);

    const onExportLogs = useCallback(() => {
        if (state.activeProcessId) {
            state.exportLogs(state.activeProcessId, 'txt');
        }
    }, [state.activeProcessId, state.exportLogs]);

    const onShowHelp = useCallback(() => {
        setIsShortcutsModalOpen(true);
    }, []);

    const onSwitchTab = useCallback((tabIndex) => {
        const processArray = Array.from(state.processes.keys());
        if (tabIndex < processArray.length) {
            state.setActiveProcessId(processArray[tabIndex]);
        }
    }, [state.processes, state.setActiveProcessId]);

    const onEscape = useCallback(() => {
        if (isModalOpen) {
            closeModal();
        } else if (isShortcutsModalOpen) {
            setIsShortcutsModalOpen(false);
        }
    }, [isModalOpen, isShortcutsModalOpen, closeModal]);

    const shortcutHandlers = {
        onSearch,
        onAddProject,
        onCloseTab,
        onNewGroup,
        onExportLogs,
        onShowHelp,
        onSwitchTab,
        onEscape
    };

    // Initialize keyboard shortcuts
    useKeyboardShortcuts(shortcutHandlers);

    return (
        <div className="flex h-screen">
            <Sidebar
                state={state}
                onOpenGroupModal={openModal}
                searchInputRef={searchInputRef}
                onShowShortcuts={() => setIsShortcutsModalOpen(true)}
            />
            <MainContent state={state} />
            <GroupModal
                isOpen={isModalOpen}
                group={editingGroup}
                groups={state.groups}
                onClose={closeModal}
                onSave={editingGroup ? state.updateGroup : state.createGroup}
            />
            <KeyboardShortcutsModal
                isOpen={isShortcutsModalOpen}
                onClose={() => setIsShortcutsModalOpen(false)}
            />
        </div>
    );
}
