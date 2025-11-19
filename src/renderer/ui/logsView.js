export class LogsView {
  constructor(state) {
    this.state = state;
    this.state.subscribe(() => this.render());
  }

  render() {
    this.renderTabs();
    this.renderLogContent();
  }

  renderTabs() {
    const tabsContainer = document.getElementById('processTabs');
    tabsContainer.innerHTML = '';

    const processes = Array.from(this.state.processes.values());

    if (processes.length === 0) {
      const noTabs = document.createElement('div');
      noTabs.className = 'tab-item no-tabs';
      noTabs.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="15" y2="15"></line>
          <line x1="15" y1="9" x2="9" y2="15"></line>
        </svg>
        <span>No active processes</span>
      `;
      tabsContainer.appendChild(noTabs);
      return;
    }

    processes.forEach(process => {
      const tab = document.createElement('div');
      tab.className = 'tab-item';
      if (process.id === this.state.activeProcessId) {
        tab.classList.add('active');
      }

      const info = document.createElement('div');
      info.className = 'tab-info';
      info.onclick = () => this.state.setActiveProcess(process.id);

      const statusIcon = document.createElement('span');
      statusIcon.className = `status-icon ${process.status}`;

      const label = document.createElement('span');
      label.textContent = `${process.projectName} • ${process.scriptName}`;

      info.appendChild(statusIcon);
      info.appendChild(label);

      const actions = document.createElement('div');
      actions.className = 'tab-actions';

      // Stop button (only for running processes)
      if (process.status === 'running') {
        const stopBtn = document.createElement('button');
        stopBtn.className = 'tab-stop';
        stopBtn.title = 'Stop process';
        stopBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12"></rect></svg>';
        stopBtn.onclick = (e) => {
          e.stopPropagation();
          this.state.stopProcess(process.id);
        };
        actions.appendChild(stopBtn);
      }

      const closeBtn = document.createElement('button');
      closeBtn.className = 'tab-close';
      closeBtn.title = 'Close tab';
      closeBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        if (process.status === 'running') {
          this.state.stopProcess(process.id);
        }
        // Remove from UI
        setTimeout(() => {
          this.state.processes.delete(process.id);
          if (this.state.activeProcessId === process.id) {
            const remaining = Array.from(this.state.processes.keys());
            this.state.activeProcessId = remaining[0] || null;
          }
          this.state.notify();
        }, 100);
      };

      tab.appendChild(info);
      tab.appendChild(actions);
      actions.appendChild(closeBtn);
      tabsContainer.appendChild(tab);
    });
  }

  renderLogContent() {
    const logContent = document.getElementById('logContent');
    logContent.innerHTML = '';

    if (!this.state.activeProcessId) {
      const empty = document.createElement('div');
      empty.className = 'empty-log';
      empty.innerHTML = `
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <p>Run a script to see output here</p>
      `;
      logContent.appendChild(empty);
      return;
    }

    const logs = this.state.processLogs.get(this.state.activeProcessId) || [];
    logs.forEach(log => {
      const line = document.createElement('span');
      line.textContent = log.text;
      line.className = `log-${log.type}`;
      logContent.appendChild(line);
    });

    logContent.scrollTop = logContent.scrollHeight;
  }
}