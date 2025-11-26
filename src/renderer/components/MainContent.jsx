import { useState } from 'preact/hooks';
import { ProcessTabs } from './ProcessTabs';
import { LogViewer } from './LogViewer';
import { WelcomeScreen } from './WelcomeScreen';
import { SplitViewManager } from './SplitViewManager';

export function MainContent({ state }) {
    const [splitViewEnabled, setSplitViewEnabled] = useState(false);
    const hasProjects = state.projects && state.projects.length > 0;
    const hasActiveProcess = state.activeProcessId && state.processes.has(state.activeProcessId);
    const hasMultipleProcesses = state.processes.size >= 2;

    return (
        <main className="flex-1 flex flex-col bg-bg-dark">
            <header className="bg-bg-secondary border-b border-border p-0 overflow-x-auto scrollbar-custom flex items-center">
                <div className="flex-1">
                    <ProcessTabs
                        processes={state.processes}
                        activeProcessId={state.activeProcessId}
                        onSetActive={state.setActiveProcessId}
                        onStop={state.stopProcess}
                        onClose={state.closeProcessTab}
                    />
                </div>
                {hasMultipleProcesses && (
                    <button
                        onClick={() => setSplitViewEnabled(!splitViewEnabled)}
                        className={`mr-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${splitViewEnabled
                                ? 'bg-primary text-white'
                                : 'bg-bg-tertiary text-text-secondary hover:bg-bg-dark hover:text-text-primary'
                            }`}
                        title="Toggle Split View"
                    >
                        <div className="flex items-center gap-1.5">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="18"></rect>
                                <rect x="14" y="3" width="7" height="18"></rect>
                            </svg>
                            <span>Split View</span>
                        </div>
                    </button>
                )}
            </header>
            <section className="flex-1 overflow-hidden">
                {!hasProjects ? (
                    <WelcomeScreen onAddProject={state.addProject} />
                ) : splitViewEnabled ? (
                    <SplitViewManager state={state} />
                ) : hasActiveProcess ? (
                    <div className="h-full p-4">
                        <LogViewer
                            processLogs={state.processLogs}
                            activeProcessId={state.activeProcessId}
                            processes={state.processes}
                            onExportLogs={state.exportLogs}
                        />
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center text-text-tertiary">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-4 opacity-50">
                                <polyline points="4 17 10 11 4 5"></polyline>
                                <line x1="12" y1="19" x2="20" y2="19"></line>
                            </svg>
                            <p className="text-sm">Select a project and run a script to see logs here</p>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}
