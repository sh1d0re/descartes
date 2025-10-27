import React from 'react';
import GreetingScreen from './GreetingScreen.tsx';
import TitleBar from './TitleBar.tsx';
import './App.css';

function App() {
    return (
        <div>
            <TitleBar />
            <GreetingScreen />
        </div>
    );
}

export default App;