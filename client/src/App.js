import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { filterEventsByStartDate } from './utils/utils';
import { renderEventsTable } from './components/EventsTable';
import { renderPromoCodesTable } from './components/PromoCodesTable';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const GET_EVENTS_URL = `${API_URL}/api/events/getEvents`;
const GET_PROMO_CODES_URL = `${API_URL}/api/events/aggregate`;
const GET_CACHED_PROMO_CODES_URL = `${API_URL}/api/events/aggregateCached`;

function App() {
    const [events, setEvents] = useState([]);
    const [promoCodes, setPromoCodes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {

        // instantly display cached data
        const fetchCachedData = async () => {
            try {
                const promoCodesResponse = await axios.get(GET_CACHED_PROMO_CODES_URL);
                if (JSON.stringify(promoCodesResponse.data) !== JSON.stringify(promoCodes)) {
                    setPromoCodes(promoCodesResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data from cache:', error);
                setError(error)
            }
        }
        fetchCachedData();

        // update with live data
        const fetchLiveData = async () => {
            try {
                // get event schedule
                const eventsResponse = await axios.get(GET_EVENTS_URL);
                setEvents(eventsResponse.data);

                // get updated promo code counts
                const promoCodesResponse = await axios.get(GET_PROMO_CODES_URL);
                if (JSON.stringify(promoCodesResponse.data) !== JSON.stringify(promoCodes)) {
                    setPromoCodes(promoCodesResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            }
        };
        fetchLiveData();

        const intervalId = setInterval(fetchLiveData, 3600000); // Fetch data every hour
        return () => clearInterval(intervalId); // Clear interval on unmount
    }, []);

    // data formatting
    const filteredEvents = filterEventsByStartDate(events, new Date());
    const upcomingEvents = filteredEvents.slice(0, 3);
    const otherEvents = filteredEvents.slice(3);

    // find promocode with highest count
    const highestCount = Math.max(...promoCodes.map(promoCode => promoCode[1]));
    // vip threshold
    const threshold = 20; // Replace with your desired threshold

    // filter into MVP, VIP, and Promoters
    const highestCountPromoCodes = promoCodes.filter(promoCode => promoCode[1] === highestCount);
    const aboveThresholdPromoCodes = promoCodes.filter(promoCode => promoCode[1] >= threshold && promoCode[1] < highestCount);
    const remainingPromoCodes = promoCodes.filter(promoCode => promoCode[1] < threshold);

    return (
        <div>
            <div>
                <h1 className="promoter-leader">Promoter Leaderboard</h1>

                <h2>👑 MVP 👑</h2>
                {renderPromoCodesTable(highestCountPromoCodes)}

                <h2>⭐️ VIP ⭐️</h2>
                {renderPromoCodesTable(aboveThresholdPromoCodes)}

                <h2>🌊 PROMOTERS 🌊</h2>
                {renderPromoCodesTable(remainingPromoCodes)}

            </div>

            <div className="upcoming-events">
                <h2>UPCOMING EVENTS</h2>
                {renderEventsTable(upcomingEvents)}
            </div>

            <div className="other-events">
                <h2>OTHER EVENTS</h2>
                {renderEventsTable(otherEvents)}
            </div>
        </div>
    );

    if (error) {
        return (
            <div style={{ padding: '20px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '15px', borderRadius: '4px' }}>
                <h2>Error</h2>
                <p>{error}</p>
                <h3>Contact Us</h3>
                <form>
                    <label>
                        Name:
                        <input type="text" name="name" />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" />
                    </label>
                    <label>
                        Message:
                        <textarea name="message" />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default App;