import React from 'react';
import './App.css';
import { useEventData, usePromoCodes } from './hooks/dataHooks';
import ErrorBoundary from './components/ErrorBoundary';
import Leaderboard from './components/Leaderboard';
import EventsTable from './components/EventsTable';
import About from './components/About';
import logo from './images/Wave-Garden-Wave-Icon-(Blue).png'; // Import the image

function App() {
    const { upcomingEvents, error } = useEventData();
    const { promoCodes } = usePromoCodes();

    if (error) {
        return <ErrorBoundary error={error} />;
    }

    return (
        <div className="app-content">
            <img src={logo} alt="Description" className="logo" />
            <Leaderboard players={promoCodes} />
            <EventsTable events={upcomingEvents} />
            <About />
        </div>
    );
}

export default App;