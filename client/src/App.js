import React from 'react';
import './App.css';
import { useEventData, usePromoCodes } from './hooks/dataHooks';
import ErrorBoundary from './components/ErrorBoundary';
import Leaderboard from './components/Leaderboard';
import EventsTable from './components/EventsTable';

function App() {
    const { upcomingEvents, otherEvents, error } = useEventData();
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
                <h1 className="events-text">THIS WEEK</h1>
                <EventsTable events={upcomingEvents} />
            </div>
            <div className="other-events">
                <h1 className="events-text">FUTURE</h1>
                <EventsTable events={otherEvents} />
            </div>
        </div>
    );
}

export default App;