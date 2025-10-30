import React, { StrictMode } from 'react';
import GreetingScreen from './GreetingScreen.tsx';
import ImportScreen from './ImportScreen.tsx';
import TitleBar from './TitleBar.tsx';
import './Global.css';
import Footer from './Footer.tsx';

function App() {
    return <>
        <TitleBar />
        <div className="screenSpacer">
            <GreetingScreen />
            <ImportScreen />
        </div>
        <Footer />
    </>;
}

export default App;