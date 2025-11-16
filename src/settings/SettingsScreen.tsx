import React, { useEffect, useState, StrictMode } from 'react';
import SettingsTitleBar from './SettingsTitleBar.tsx';
import './SettingsScreen.css';
import '@/Global.css';

function Settings() {
    const handleSetAPIToken = () => {
        const newToken = document.getElementById("apiTokenField")?.value;
        console.log(newToken);
        if (newToken) {
            (window as any).__apiToken?.setAPIToken?.(newToken);
        }
    };
    const handleChangeProvider = (newProvider: string) => {
        setSelected(newProvider);
        if (newProvider) {
            (window as any).__descartes?.changeSetting?.("selectedProvider", newProvider);
        }
    };

    const [selectedProvider, setSelected] = useState("");
    useEffect(() => {
        (async () => {
            const result = await (window as any).__descartes?.getSetting?.("selectedProvider");
            if (result) setSelected(result);
        })();
    }, []);

    let apiToken: any;
    (async () => {
        apiToken = await (window as any).__apiToken?.getAPIToken?.();
    })();
    console.log(apiToken);

    return <>
        <StrictMode>
            <SettingsTitleBar />
            <div className="screenSpacer">
                <h1>Settings</h1>
                <p>This is the standalone settings screen (not rendered by App.tsx).</p>
                <div className="apiFieldParent">
                    <input className="inputField" id="apiTokenField" type="text" placeholder={apiToken} />
                    <button className="inputFieldUpdateButton" onClick={handleSetAPIToken}>Update</button>
                </div>
                <div className="apiFieldParent">
                    <img className={`providerButton ${selectedProvider === "gemini" ? "selectedButton" : ""}`} src="gemini.svg" onClick={() => handleChangeProvider("gemini")} />
                    <img className={`providerButton ${selectedProvider === "claude" ? "selectedButton" : ""}`} src="claude.svg" onClick={() => handleChangeProvider("claude")} />
                    <img className={`providerButton ${selectedProvider === "openai" ? "selectedButton" : ""}`} src="openai.svg" onClick={() => handleChangeProvider("openai")} />
                </div>
            </div>
        </StrictMode>
    </>;
}

export default Settings;