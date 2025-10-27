import "./public.css"
import "./TitleBar.css";

function TitleBar() {
    const handleClose = () => {
        (window as any).__descartes?.closeApp?.();
    };
    const handleMinimize = () => {
        (window as any).__descartes?.minimize?.();
    };
    const handleMaximize = () => {
        (window as any).__descartes?.maximize?.();
    };

    return <>
        <div className="titleBar">
            <div className="titleBarButtonsParent">
                <button className="titleBarButtons closeButton" onClick={handleClose}></button>
                <button className="titleBarButtons minimizeButton" onClick={handleMinimize}></button>
                <button className="titleBarButtons maximizeButton" onClick={handleMaximize}></button>
            </div>
            <img className="titleLogo logo" src="logo.svg" ></img>
            <img className="settings logo" src="gear.svg"></img>
        </div>
        
    </>;
}

export default TitleBar;