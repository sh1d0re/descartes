import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Settings from './SettingsScreen';

const rootEl = document.getElementById('root')!;
const root = createRoot(rootEl);

const isSettingsRoute = window.location.hash === '#/settings';

root.render(
    <StrictMode>
        {isSettingsRoute ? <Settings /> : <App />}
    </StrictMode>
);
