import "./Global.css"
import "./TitleBar.css";

function TitleBar() {
    const closeSettings = () => {
        (window as any).__descartes?.closeWindow?.("settings");
    };

    return <>
        <div className="titleBar">
            <div className="titleBarButtonsParent">
                <button className="titleBarButtons closeButton" onClick={closeSettings}></button>
            </div>
            <img className="titleLogo" src="logo.svg" ></img>
        </div>
        
    </>;
}

export default TitleBar;