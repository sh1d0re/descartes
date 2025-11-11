import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Settings from './settings/SettingsScreen';
try {
    const rootEl = document.getElementById('root')!;
    const root = createRoot(rootEl);
    console.log('renderer: root created, hash=', window.location.hash);

    const isSettingsRoute = window.location.hash === '#/settings';

    root.render(
        <StrictMode>
            {isSettingsRoute ? <Settings /> : <App />}
        </StrictMode>
    );
} catch (err) {
    console.error('renderer: bootstrap error', err);
}
