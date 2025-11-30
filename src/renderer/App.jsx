import { useState, useRef } from 'preact/hooks';
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

    const openModal = (group = null) => {
        setEditingGroup(group);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingGroup(null);
        setIsModalOpen(false);
    };

    // Keyboard shortcut handlers
    const shortcutHandlers = {
        onSearch: () => {
            // Focus search input - will be passed to Sidebar via ref
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        },
        onAddProject: () => {
            state.addProject();
        },
        onCloseTab: () => {
            if (state.activeProcessId) {
                state.closeProcessTab(state.activeProcessId);
            }
        },
        onNewGroup: () => {
            openModal();
        },
        onExportLogs: () => {
            if (state.activeProcessId) {
                state.exportLogs(state.activeProcessId, 'txt');
            }
        },
        onShowHelp: () => {
            setIsShortcutsModalOpen(true);
        },
        onSwitchTab: (tabIndex) => {
            const processArray = Array.from(state.processes.keys());
            if (tabIndex < processArray.length) {
                state.setActiveProcessId(processArray[tabIndex]);
            }
        },
        onEscape: () => {
            if (isModalOpen) {
                closeModal();
            } else if (isShortcutsModalOpen) {
                setIsShortcutsModalOpen(false);
            }
        }
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
