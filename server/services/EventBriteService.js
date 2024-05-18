const axios = require('axios');
const config = {
    eventBriteBaseUrl: process.env.EVENTBRITE_BASE_URL || 'DEFAULT',
    organizationId: process.env.EVENTBRITE_ORGANIZATION_ID || 'DEFAULT',
    oauth_token: process.env.EVENTBRITE_TOKEN || 'DEFAULT'
};

const { kv } = require('@vercel/kv');

async function fetchPaginatedEvents(url, params, key) {
    let page = 1;
    let allData = [];
    while (true) {
        params.page = page;
        try {
            const response = await axios.get(url, {
                params: {
                    ...params,
                    expand: 'promotional_code'
                },
                headers: {
                    Authorization: `Bearer ${config.oauth_token}`
                }
            });
            const data = response.data;
            if (data[key]) {
                allData = allData.concat(data[key]);
            }
            if (!data.pagination || !data.pagination.has_more_items) {
                break;
            }
            page++;
        } catch (error) {
            console.error(`Failed to fetch data: ${error.response?.data?.error_description || 'No error description'}`);
            throw new Error('Failed to fetch data from EventBrite API');
        }
    }
    return allData;
}

async function fetchOrganizationEvents() {
    const url = `${config.eventBriteBaseUrl}organizations/${config.organizationId}/events/`;
    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${config.oauth_token}`
        }
    });
    return response.data.events;
}

async function fetchPromoCodes(eventId) {
    const url = `${config.eventBriteBaseUrl}events/${eventId}/attendees/`;
    const params = {
        expand: 'promotional_code'
    };
    const attendees = await fetchPaginatedEvents(url, params, 'attendees');
    const promoCounts = {};
    attendees.forEach(attendee => {
        if (attendee && attendee.promotional_code) {
            const promoCode = attendee.promotional_code.code;
            if (promoCode) {
                promoCounts[promoCode] = (promoCounts[promoCode] || 0) + 1;
            }
        }
    });
    return Object.entries(promoCounts); // Convert to 2D array format [PROMOCODE, COUNT]
}

const PROMO_CODES_KEY = {
    ALL: 'promoCodes:ALL',
    MONTH: 'promoCodes:MONTH',
    WEEK: 'promoCodes:WEEK'
};

async function fetchAndCountPromoCodes() {
    const currentDate = new Date();
    const oneWeekAgo = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
    const oneMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());

    const timeFrames = {
        ALL: () => true,
        MONTH: event => new Date(event.start.utc) >= oneMonthAgo,
        WEEK: event => new Date(event.start.utc) >= oneWeekAgo
    };

    const allEvents = await fetchOrganizationEvents();
    const allPromoCounts = await countPromoCodes(allEvents);

    const promoCodeCounts = {
        ALL: filterPromoCounts(allPromoCounts, timeFrames.ALL),
        MONTH: filterPromoCounts(allPromoCounts, timeFrames.MONTH),
        WEEK: filterPromoCounts(allPromoCounts, timeFrames.WEEK)
    };

    console.log("Updating Redis cache");
    for (const [timeFrame, promoCounts] of Object.entries(promoCodeCounts)) {
        await updateCache(timeFrame, promoCounts);
    }

    return promoCodeCounts.ALL;
}

async function countPromoCodes(events) {
    const overallPromoCounts = [];
    for (let event of events) {
        console.log("event.id: " + event.id);
        const promoCounts = await fetchPromoCodes(event.id);
        overallPromoCounts.push({
            eventDate: event.start.utc,
            promoCounts
        });
    }
    return overallPromoCounts; // Return array of {eventDate, promoCounts}
}

function filterPromoCounts(allPromoCounts, filterFn) {
    const filteredPromoCounts = new Map();
    for (const { eventDate, promoCounts } of allPromoCounts) {
        if (filterFn({ start: { utc: eventDate } })) { // Adjust the filtering logic based on the event's start time
            promoCounts.forEach(([code, count]) => {
                if (code !== 'FREE_TICKET_DEV_TEST') {
                    filteredPromoCounts.set(code, (filteredPromoCounts.get(code) || 0) + count);
                }
            });
        }
    }
    return [...filteredPromoCounts.entries()].sort((a, b) => b[1] - a[1]); // Return as 2D array format [PROMOCODE, COUNT]
}

async function updateCache(timeFrame, promoCounts) {
    console.log("Updating... [" + timeFrame + "] " + "updateCache.promoCounts: " + promoCounts);
    await kv.set(PROMO_CODES_KEY[timeFrame], promoCounts);
}

async function fetchPromoCodeCountsFromCache() {
    return await kv.get(PROMO_CODES_KEY.ALL) || null;
}

function combinePromoCodes(promoCodes) {
    const combinedPromoCodes = new Map();
    promoCodes.forEach(([code, count]) => {
        if (code.toString().endsWith('25')) {
            const baseCode = code.slice(0, -2);
            if (combinedPromoCodes.has(baseCode)) {
                combinedPromoCodes.set(baseCode, combinedPromoCodes.get(baseCode) + count);
            } else {
                combinedPromoCodes.set(code, count);
            }
        } else {
            combinedPromoCodes.set(code, count);
        }
    });
    return [...combinedPromoCodes.entries()]; // Return as 2D array format [PROMOCODE, COUNT]
}

module.exports = {
    fetchOrganizationEvents,
    fetchPaginatedEvents,
    fetchPromoCodes,
    fetchAndCountPromoCodes,
    fetchPromoCodeCountsFromCache
};
