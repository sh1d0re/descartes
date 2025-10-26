import React from 'react';
import GreetingScreen from './GreetingScreen.tsx';
import './App.css';

function App() {
    const handleClose = () => {
        (window as any).__descartes?.closeApp?.();
    };

    return (
        <div>
            <div className="appTitlebar">
                <button className="titleBtn" onClick={handleClose}></button>
            </div>
            <GreetingScreen />
        </div>
    );
}

export default App;