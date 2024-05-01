import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get('/api/events')
            .then(response => setEvents(response.data))
            .catch(error => console.error('Error fetching events:', error));
    }, []);

    return (
        <div>
            <h1>Events</h1>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                </tr>
                </thead>
                <tbody>
                {events.map(event => (
                    <tr key={event.id}>
                        <td>{event.name.text}</td>
                        <td>{new Date(event.start.utc).toLocaleString()}</td>
                        <td>{new Date(event.end.utc).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
