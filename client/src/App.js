import React from 'react';
import './App.css';
import { useEventData, usePromoCodes } from './hooks/dataHooks';
import ErrorBoundary from './components/ErrorBoundary';
import Leaderboard from './components/Leaderboard';
import EventsTable from './components/EventsTable';

function App() {
    const { upcomingEvents, error } = useEventData();
    const { promoCodes } = usePromoCodes();

    if (error) {
        return <ErrorBoundary error={error} />;
    }

    return (
        <div className="app-content">
            <div>
                <Leaderboard players={promoCodes} />
            </div>
            <div className="upcoming-events">
                <h1 className="events-text">EVENTS</h1>
                <EventsTable events={upcomingEvents} />
            </div>
        </div>
    );
}

export default App;