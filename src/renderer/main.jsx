import { render } from 'preact';
import { App } from './App';
import './styles/index.css';

console.log('Main.jsx loaded');
console.log('irisucAPI available:', !!window.irisucAPI);

try {
    const appElement = document.getElementById('app');
    console.log('App element found:', !!appElement);

    if (!appElement) {
        throw new Error('App element not found');
    }

    console.log('Rendering App...');
    render(<App />, appElement);
    console.log('App rendered successfully');
} catch (error) {
    console.error('Error rendering app:', error);
    document.body.innerHTML = `
        <div style="padding: 20px; color: white; background: #0a0a0a;">
            <h1>Error Loading App</h1>
            <pre style="color: #ff6b6b;">${error.message}\n${error.stack}</pre>
        </div>
    `;
}
