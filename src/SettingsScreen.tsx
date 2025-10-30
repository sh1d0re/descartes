import React, { StrictMode } from 'react';
import SettingsTitleBar from './SettingsTitleBar.tsx';
import './Global.css';

function Settings() {
    const handleClose = () => {
        (window as any).__descartes?.closeWindow?.('settings');
    };

    return <>
        <StrictMode>
            <SettingsTitleBar />
            <div className="screenSpacer">
                <h1>Settings</h1>
                <p>This is the standalone settings screen (not rendered by App.tsx).</p>
                <button onClick={handleClose}>Close Settings</button>
            </div>
        </StrictMode>
    </>;
}

export default Settings;