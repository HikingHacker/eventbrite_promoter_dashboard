import { useState, useEffect } from 'react';
import axios from 'axios';
import { filterEventsByStartDate } from '../utils/utils';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function useEventData() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/events/getEvents`);
                console.log("getEvents: " + JSON.stringify(response));
                setEvents(filterEventsByStartDate(response.data, new Date()));
            } catch (err) {
                setError('Failed to fetch events');
                console.error('Error fetching events:', err);
            }
        };

        fetchEvents();
    }, []);

    return {
        upcomingEvents: events.slice(0, 3),
        otherEvents: events.slice(3),
        error
    };
}

export function usePromoCodes() {
    const [promoCodes, setPromoCodes] = useState([]);
    // load promocodes from cache
    useEffect(() => {
        const fetchCachedPromoCodes = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/events/aggregateCached`);
                setPromoCodes(response.data);
            } catch (err) {
                console.error('Error fetching promo codes:', err);
            }
        };

        fetchCachedPromoCodes();
    }, []);


    // fetch promocodes from API
    useEffect(() => {
        const fetchPromoCodes = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/events/aggregate`);
                setPromoCodes(response.data);
            } catch (err) {
                console.error('Error fetching promo codes:', err);
            }
        };

        fetchPromoCodes();
    }, []);

    return { promoCodes };
}