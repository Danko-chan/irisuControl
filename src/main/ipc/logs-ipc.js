const { ipcMain, dialog } = require('electron');
const fs = require('fs').promises;
const path = require('path');
const { getMainWindow } = require('../main');

// Export logs to file
ipcMain.handle('logs:export', async (_event, { processId, logs, format, processName, scriptName }) => {
    try {
        const mainWindow = getMainWindow();
        if (!mainWindow) {
            return { success: false, error: 'Main window not available' };
        }

        // Determine file extension and filter based on format
        let defaultPath, filters;
        switch (format) {
            case 'json':
                defaultPath = `${processName}-${scriptName}-logs.json`;
                filters = [{ name: 'JSON Files', extensions: ['json'] }];
                break;
            case 'html':
                defaultPath = `${processName}-${scriptName}-logs.html`;
                filters = [{ name: 'HTML Files', extensions: ['html'] }];
                break;
            default: // txt
                defaultPath = `${processName}-${scriptName}-logs.txt`;
                filters = [{ name: 'Text Files', extensions: ['txt'] }];
        }

        // Show save dialog
        const result = await dialog.showSaveDialog(mainWindow, {
            title: 'Export Logs',
            defaultPath,
            filters,
            properties: ['createDirectory', 'showOverwriteConfirmation']
        });

        if (result.canceled || !result.filePath) {
            return { success: false, canceled: true };
        }

        // Format and write logs
        let content;
        switch (format) {
            case 'json':
                content = JSON.stringify({
                    processId,
                    processName,
                    scriptName,
                    exportedAt: new Date().toISOString(),
                    logs: logs.map(log => ({
                        type: log.type,
                        text: log.text,
                        timestamp: new Date().toISOString()
                    }))
                }, null, 2);
                break;

            case 'html':
                content = generateHTMLLogs(processName, scriptName, logs);
                break;

            default: // txt
                content = `Process: ${processName} - ${scriptName}\n`;
                content += `Exported: ${new Date().toISOString()}\n`;
                content += `${'='.repeat(80)}\n\n`;
                logs.forEach(log => {
                    content += log.text;
                });
        }

        await fs.writeFile(result.filePath, content, 'utf8');

        return {
            success: true,
            filePath: result.filePath
        };
    } catch (error) {
        console.error('Error exporting logs:', error);
        return {
            success: false,
            error: error.message
        };
    }
});

function generateHTMLLogs(processName, scriptName, logs) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${processName} - ${scriptName} Logs</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            background: #0a0a0a;
            color: #e0e0e0;
            padding: 2rem;
            line-height: 1.6;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        .header h1 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: white;
        }
        .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.9rem;
        }
        .logs-container {
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        .log-entry {
            margin-bottom: 0.25rem;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .log-stdout {
            color: #e0e0e0;
        }
        .log-stderr {
            color: #ff6b6b;
        }
        .log-info {
            color: #51cf66;
            font-weight: 600;
        }
        .footer {
            margin-top: 2rem;
            text-align: center;
            color: #666;
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${processName} - ${scriptName}</h1>
        <p>Exported: ${new Date().toLocaleString()}</p>
    </div>
    <div class="logs-container">
${logs.map(log => {
        const className = log.type === 'stderr' ? 'log-stderr' :
            log.type === 'info' ? 'log-info' : 'log-stdout';
        const escapedText = escapeHtml(log.text);
        return `        <div class="log-entry ${className}">${escapedText}</div>`;
    }).join('\n')}
    </div>
    <div class="footer">
        <p>Generated by IrisuControl</p>
    </div>
</body>
</html>`;
    return html;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

module.exports = {};
