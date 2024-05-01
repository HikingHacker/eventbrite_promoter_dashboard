const axios = require('axios');

exports.getEvents = async (req, res) => {
    try {
        const response = await axios.get(`https://www.eventbriteapi.com/v3/organizations/${process.env.EVENTBRITE_ORGANIZATION_ID}/events/`, {
            headers: {
                Authorization: `Bearer ${process.env.EVENTBRITE_TOKEN}`
            }
        });
        res.json(response.data.events);
    } catch (error) {
        console.error('Error fetching events.js:', error);
        res.status(500).send('Server Error');
    }
};