import React, { StrictMode } from 'react';
import GreetingScreen from './GreetingScreen.tsx';
import ImportScreen from './ImportScreen.tsx';
import TitleBar from './TitleBar.tsx';
import './Global.css';

function App() {
    return <>
        <StrictMode>
            <TitleBar />
            <div className="screenSpacer">
                <GreetingScreen />
                <ImportScreen />
            </div>
        </StrictMode>
    </>;
}

export default App;