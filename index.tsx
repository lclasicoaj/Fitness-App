import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global error handler for startup issues
window.addEventListener('error', (event) => {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'color: #ef4444; background: #1e293b; padding: 20px; font-family: monospace; height: 100vh; overflow: auto;';
    errorDiv.innerHTML = `
      <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Application Error</h2>
      <p style="margin-bottom: 1rem;">The application failed to start.</p>
      <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 0.5rem;">
        ${event.message}
      </div>
    `;
    document.body.innerHTML = '';
    document.body.appendChild(errorDiv);
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);