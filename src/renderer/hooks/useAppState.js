import { useState, useEffect, useCallback } from 'preact/hooks';

export function useAppState() {
    const [projects, setProjects] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupsCollapsed, setGroupsCollapsed] = useState({});
    const [processes, setProcesses] = useState(new Map());
    const [processLogs, setProcessLogs] = useState(new Map());
    const [activeProcessId, setActiveProcessId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [availableShells, setAvailableShells] = useState([]);
    const [selectedShell, setSelectedShell] = useState(null);
    const [favorites, setFavorites] = useState([]);

    // Load initial data
    useEffect(() => {
        loadProjects();
        loadGroups();
        loadShells();
        loadFavorites();

        // Set up IPC listeners
        const unsubscribeLog = window.irisucAPI.onLog((data) => {
            addLog(data.id, data.data, data.type);
        });

        const unsubscribeExit = window.irisucAPI.onExit((data) => {
            markProcessExited(data.id, data.code);
        });

        return () => {
            if (unsubscribeLog) unsubscribeLog();
            if (unsubscribeExit) unsubscribeExit();
        };
    }, []);

    const loadProjects = useCallback(async () => {
        const data = await window.irisucAPI.getProjects();
        setProjects(data);
    }, []);

    const loadGroups = useCallback(async () => {
        const groupsData = await window.irisucAPI.getGroups();
        const collapsedData = await window.irisucAPI.getGroupsCollapsed();
        setGroups(groupsData);
        setGroupsCollapsed(collapsedData);
    }, []);

    const loadShells = useCallback(async () => {
        const shells = await window.irisucAPI.getAvailableShells();
        const selected = await window.irisucAPI.getShellPreference();
        setAvailableShells(shells);
        setSelectedShell(selected);
    }, []);

    const loadFavorites = useCallback(async () => {
        const favs = await window.irisucAPI.getFavorites();
        setFavorites(favs);
    }, []);

    const setShell = useCallback(async (shell) => {
        await window.irisucAPI.setShellPreference(shell);
        setSelectedShell(shell);
    }, []);

    const toggleGroupCollapsed = useCallback(async (groupId) => {
        const result = await window.irisucAPI.toggleGroupCollapsed(groupId);
        if (result.success) {
            setGroupsCollapsed(prev => ({ ...prev, [groupId]: result.collapsed }));
        }
    }, []);

    const addProject = useCallback(async () => {
        const result = await window.irisucAPI.addProject();
        if (result.success) {
            await loadProjects();
        }
        return result;
    }, [loadProjects]);

    const removeProject = useCallback(async (path) => {
        await window.irisucAPI.removeProject(path);
        await loadProjects();
    }, [loadProjects]);

    const updateProjectGroup = useCallback(async (projectId, groupId) => {
        await window.irisucAPI.updateProjectGroup(projectId, groupId);
        await loadProjects();
    }, [loadProjects]);

    const createGroup = useCallback(async (name, color) => {
        const result = await window.irisucAPI.createGroup(name, color);
        if (result.success) {
            await loadGroups();
        }
        return result;
    }, [loadGroups]);

    const updateGroup = useCallback(async (groupId, updates) => {
        await window.irisucAPI.updateGroup(groupId, updates);
        await loadGroups();
    }, [loadGroups]);

    const deleteGroup = useCallback(async (groupId) => {
        await window.irisucAPI.deleteGroup(groupId);
        await loadGroups();
        await loadProjects();
    }, [loadGroups, loadProjects]);

    // Define addLog and markProcessExited first, before they're used in other callbacks
    const addLog = useCallback((id, text, type = 'stdout') => {
        setProcessLogs(prev => {
            const newLogs = new Map(prev);
            const logs = newLogs.get(id) || [];
            newLogs.set(id, [...logs, { text, type }]);
            return newLogs;
        });
    }, []);

    const markProcessExited = useCallback((id, code) => {
        setProcesses(prev => {
            const newProcesses = new Map(prev);
            const process = newProcesses.get(id);
            if (process) {
                process.status = 'exited';
                newProcesses.set(id, process);
            }
            return newProcesses;
        });
        const statusText = code === 0 ? 'completed successfully' : `exited with code ${code}`;
        addLog(id, `\n■ Process ${statusText}\n`, 'info');
    }, [addLog]);

    const runScript = useCallback(async (projectPath, scriptName, projectName) => {
        const result = await window.irisucAPI.runScript(projectPath, scriptName, projectName, selectedShell);
        if (result.success) {
            setProcesses(prev => new Map(prev).set(result.id, {
                id: result.id,
                projectName: result.projectName,
                scriptName: result.scriptName,
                status: 'running'
            }));
            setProcessLogs(prev => new Map(prev).set(result.id, []));
            setActiveProcessId(result.id);
            const shellInfo = result.shell ? ` (${result.shell})` : '';
            addLog(result.id, `\n▶ Running "${scriptName}" in ${projectName}${shellInfo}\n`, 'info');

            // Track recent project
            window.irisucAPI.trackRecentProject(projectPath, projectName);
        }
        return result;
    }, [selectedShell, addLog]);

    const stopProcess = useCallback(async (id) => {
        await window.irisucAPI.stopProcess(id);
        addLog(id, '\n⏹ Stop requested by user\n', 'info');
    }, [addLog]);

    const closeProcessTab = useCallback((id) => {
        setProcesses(prev => {
            const newProcesses = new Map(prev);
            newProcesses.delete(id);
            return newProcesses;
        });
        setProcessLogs(prev => {
            const newLogs = new Map(prev);
            newLogs.delete(id);
            return newLogs;
        });

        // If closing active tab, switch to another tab or null
        if (activeProcessId === id) {
            setActiveProcessId(prevId => {
                const remaining = Array.from(processes.keys()).filter(k => k !== id);
                return remaining.length > 0 ? remaining[0] : null;
            });
        }
    }, [activeProcessId, processes]);

    const getFilteredProjects = useCallback(() => {
        if (!searchQuery) return projects;
        const query = searchQuery.toLowerCase();
        return projects.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.path.toLowerCase().includes(query)
        );
    }, [projects, searchQuery]);

    const getProjectsByGroup = useCallback(() => {
        const filtered = getFilteredProjects();
        const grouped = { ungrouped: [] };

        groups.forEach(group => {
            grouped[group.id] = [];
        });

        filtered.forEach(project => {
            if (project.groupId && grouped[project.groupId]) {
                grouped[project.groupId].push(project);
            } else {
                grouped.ungrouped.push(project);
            }
        });

        return grouped;
    }, [getFilteredProjects, groups]);

    const exportLogs = useCallback(async (processId, format = 'txt') => {
        const process = processes.get(processId);
        const logs = processLogs.get(processId) || [];

        if (!process || logs.length === 0) {
            return { success: false, error: 'No logs to export' };
        }

        const result = await window.irisucAPI.exportLogs(
            processId,
            logs,
            format,
            process.projectName,
            process.scriptName
        );

        return result;
    }, [processes, processLogs]);

    const toggleFavorite = useCallback(async (projectPath, projectName, scriptName) => {
        const result = await window.irisucAPI.toggleFavorite(projectPath, projectName, scriptName);
        if (result.success) {
            await loadFavorites();
        }
        return result;
    }, [loadFavorites]);

    const isFavorite = useCallback((projectPath, scriptName) => {
        return favorites.some(
            f => f.projectPath === projectPath && f.scriptName === scriptName
        );
    }, [favorites]);

    return {
        projects,
        groups,
        groupsCollapsed,
        processes,
        processLogs,
        activeProcessId,
        searchQuery,
        availableShells,
        selectedShell,
        setSearchQuery,
        setActiveProcessId,
        setShell,
        toggleGroupCollapsed,
        addProject,
        removeProject,
        updateProjectGroup,
        createGroup,
        updateGroup,
        deleteGroup,
        runScript,
        stopProcess,
        closeProcessTab,
        getProjectsByGroup,
        exportLogs,
        favorites,
        toggleFavorite,
        isFavorite,
    };
}
