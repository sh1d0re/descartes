import React, { StrictMode } from 'react';
import GreetingScreen from './main/GreetingScreen.tsx';
import ImportScreen from './main/importer/ImportScreen.tsx';
import TitleBar from './main/TitleBar.tsx';
import '@/Global.css';
import Footer from './main/Footer.tsx';

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