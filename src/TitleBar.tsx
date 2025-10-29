import "./Global.css"
import "./TitleBar.css";

function TitleBar() {
    const handleClose = () => {
        (window as any).__descartes?.closeApp?.();
    };
    const handleMinimize = () => {
        (window as any).__descartes?.minimizeApp?.();
    };
    const handleMaximize = () => {
        (window as any).__descartes?.maximizeApp?.();
    };
    const handleOpenSettings = () => {
        (window as any).__descartes?.openSettings?.();
    }
    const closeSettings = () => {
        (window as any).__descartes?.closeWindow?.("settings");
    };

    return <>
        <div className="titleBar">
            <div className="titleBarButtonsParent">
                <button className="titleBarButtons closeButton" onClick={handleClose}></button>
                <button className="titleBarButtons minimizeButton" onClick={handleMinimize}></button>
                <button className="titleBarButtons maximizeButton" onClick={handleMaximize}></button>
            </div>
            <img className="titleLogo" src="logo.svg" ></img>
            <img className="settings" src="gear.svg" onClick={handleOpenSettings}></img>
        </div>
        
    </>;
}

export default TitleBar;