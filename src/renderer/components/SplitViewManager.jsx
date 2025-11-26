import { useState, useEffect } from 'preact/hooks';
import { LogViewer } from './LogViewer';

export function SplitViewManager({ state }) {
    const [layout, setLayout] = useState('horizontal'); // horizontal, vertical, grid
    const [selectedProcesses, setSelectedProcesses] = useState([]);
    const [paneSizes, setPaneSizes] = useState([50, 50]); // percentages
    const [isResizing, setIsResizing] = useState(false);

    const processArray = Array.from(state.processes.keys());

    // Auto-select up to 2 processes if none selected
    useEffect(() => {
        if (selectedProcesses.length === 0 && processArray.length > 0) {
            const initial = processArray.slice(0, Math.min(2, processArray.length));
            setSelectedProcesses(initial);
        }
    }, [processArray.length, selectedProcesses.length]);

    const handleProcessSelect = (processId, index) => {
        const newSelected = [...selectedProcesses];
        newSelected[index] = processId;
        setSelectedProcesses(newSelected);
    };

    const handleMouseDown = (e) => {
        setIsResizing(true);
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (!isResizing) return;

        const container = e.currentTarget.parentElement;
        const rect = container.getBoundingClientRect();

        if (layout === 'horizontal') {
            const newSize = ((e.clientX - rect.left) / rect.width) * 100;
            setPaneSizes([Math.max(20, Math.min(80, newSize)), 100 - newSize]);
        } else {
            const newSize = ((e.clientY - rect.top) / rect.height) * 100;
            setPaneSizes([Math.max(20, Math.min(80, newSize)), 100 - newSize]);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    if (selectedProcesses.length < 2) {
        return (
            <div className="h-full flex items-center justify-center text-text-tertiary">
                <div className="text-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-4 opacity-50">
                        <rect x="3" y="3" width="7" height="18"></rect>
                        <rect x="14" y="3" width="7" height="18"></rect>
                    </svg>
                    <p className="text-sm">Run at least 2 scripts to use split view</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="h-full flex flex-col"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {/* Layout Controls */}
            <div className="flex items-center justify-between p-3 border-b border-border bg-bg-secondary">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-text-tertiary uppercase">Split View</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setLayout('horizontal')}
                            className={`p-1.5 rounded ${layout === 'horizontal' ? 'bg-primary text-white' : 'bg-bg-tertiary text-text-secondary hover:bg-bg-dark'}`}
                            title="Horizontal Split"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="18"></rect>
                                <rect x="14" y="3" width="7" height="18"></rect>
                            </svg>
                        </button>
                        <button
                            onClick={() => setLayout('vertical')}
                            className={`p-1.5 rounded ${layout === 'vertical' ? 'bg-primary text-white' : 'bg-bg-tertiary text-text-secondary hover:bg-bg-dark'}`}
                            title="Vertical Split"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="7"></rect>
                                <rect x="3" y="14" width="18" height="7"></rect>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Split Panes */}
            <div className={`flex-1 flex ${layout === 'horizontal' ? 'flex-row' : 'flex-col'} overflow-hidden`}>
                {/* Pane 1 */}
                <div style={{ [layout === 'horizontal' ? 'width' : 'height']: `${paneSizes[0]}%` }} className="flex flex-col">
                    <div className="p-2 bg-bg-tertiary border-b border-border">
                        <select
                            value={selectedProcesses[0] || ''}
                            onChange={(e) => handleProcessSelect(e.target.value, 0)}
                            className="w-full px-2 py-1 bg-bg-secondary border border-border rounded text-text-primary text-xs"
                        >
                            {processArray.map(pid => {
                                const proc = state.processes.get(pid);
                                return (
                                    <option key={pid} value={pid}>
                                        {proc.projectName} - {proc.scriptName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="flex-1 p-2 overflow-hidden">
                        <LogViewer
                            processLogs={state.processLogs}
                            activeProcessId={selectedProcesses[0]}
                            processes={state.processes}
                            onExportLogs={state.exportLogs}
                        />
                    </div>
                </div>

                {/* Resize Handle */}
                <div
                    className={`${layout === 'horizontal' ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'} bg-border hover:bg-primary transition-colors ${isResizing ? 'bg-primary' : ''}`}
                    onMouseDown={handleMouseDown}
                ></div>

                {/* Pane 2 */}
                <div style={{ [layout === 'horizontal' ? 'width' : 'height']: `${paneSizes[1]}%` }} className="flex flex-col">
                    <div className="p-2 bg-bg-tertiary border-b border-border">
                        <select
                            value={selectedProcesses[1] || ''}
                            onChange={(e) => handleProcessSelect(e.target.value, 1)}
                            className="w-full px-2 py-1 bg-bg-secondary border border-border rounded text-text-primary text-xs"
                        >
                            {processArray.map(pid => {
                                const proc = state.processes.get(pid);
                                return (
                                    <option key={pid} value={pid}>
                                        {proc.projectName} - {proc.scriptName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="flex-1 p-2 overflow-hidden">
                        <LogViewer
                            processLogs={state.processLogs}
                            activeProcessId={selectedProcesses[1]}
                            processes={state.processes}
                            onExportLogs={state.exportLogs}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
