import React, { useEffect, useState, StrictMode } from 'react';
import SettingsTitleBar from './SettingsTitleBar.tsx';
import './SettingsScreen.css';
import '@/Global.css';

function Settings() {
    const handleSetAPIToken = () => {
        const newToken = document.getElementById("apiTokenField")?.value;
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
    const [apiToken, setApiToken] = useState<string>();

    useEffect(() => {
        (async () => {
            const provider = await (window as any).__descartes?.getSetting?.("selectedProvider");
            if (provider) setSelected(provider);

            const token = await (window as any).__apiToken?.getAPIToken?.();
            if (token) setApiToken(token);
            //console.log("loaded token:", token);
        })();
    }, []);

    return <>
        <StrictMode>
            <SettingsTitleBar />
            <div className="screenSpacer">
                <h1>Settings</h1>
                <p>AI API Token Settings Field</p>
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