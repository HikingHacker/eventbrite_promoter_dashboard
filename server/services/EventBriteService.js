const axios = require('axios');
const config = {
    eventBriteBaseUrl: process.env.EVENTBRITE_BASE_URL || 'DEFAULT',
    organizationId: process.env.EVENTBRITE_ORGANIZATION_ID || 'DEFAULT',
    oauth_token: process.env.EVENTBRITE_TOKEN || 'DEFAULT'
};

const { kv } = require('@vercel/kv');

// TODO: refactor API calls to to maintain past and fetch future events and form counts to prevent rate limiting
// TODO: add single initial fetch for all events on boot-up

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

const fetchActiveEventsForOrganization = async (organizationId, accessToken) => {
    const response = await fetch(`https://www.eventbriteapi.com/v3/organizations/${organizationId}/events/?status=live`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();
    return data.events;
};

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

    // adds all ticket sales from legacy levels platform
    promoCodeCounts.ALL = addLegacyPromoCodes(promoCodeCounts.ALL);

    console.log("Updating Redis cache");
    for (const [timeFrame, promoCounts] of Object.entries(promoCodeCounts)) {
        await updateCache(timeFrame, promoCounts);
    }

    return promoCodeCounts.MONTH;
}

async function countPromoCodes(events) {
    const overallPromoCounts = [];
    let num = 0;

    for (let event of events) {
        console.log(num + " event.id: " + event.id);
        const promoCounts = await fetchPromoCodes(event.id);
        overallPromoCounts.push({
            eventDate: event.start.utc,
            promoCounts
        });
        num++;
    }
    return overallPromoCounts; // Return array of {eventDate, promoCounts}
}

function isHiddenPromoCode(code) {
    let hidden = ['FREE_TICKET_DEV_TEST', 'WAVE', 'BASSEXHIBIT', 'BEEBO'];
    const uppercasedCode = code.toUpperCase();
    return hidden.includes(uppercasedCode);
}

function addLegacyPromoCodes(promoCodesList) {
    const legacyCountMap = {
        "NWPLUR": 118,
        "VIBRANTVIBEZ": 66,
        "CANCELTHECOUCH": 31,
        "ALYSSA": 29,
        "KEVIN": 28,
        "NAKATANI": 20,
        "RINN": 20,
        "KEITHM": 18,
        "GENSUO": 17,
        "LUCKYLIGHT": 15,
        "CHAO": 13,
        "KWATTS": 11,
        "BEARBASS": 11,
    }

    // add legacy counts
    let updatedPromoCodesList = promoCodesList.map(([promoCode, count]) => {
        const uppercasePromoCode = promoCode.toUpperCase();
        const newCount = legacyCountMap.hasOwnProperty(uppercasePromoCode) ? count + legacyCountMap[uppercasePromoCode] : count;
        return [promoCode, newCount];
    });

    // update sort & return
    return sortPromoCodesByValue(updatedPromoCodesList);
}

function sortPromoCodesByValue(promoCodesList) {
    return promoCodesList.sort((a, b) => b[1] - a[1]);
}

function filterPromoCounts(allPromoCounts, filterFn) {
    const filteredPromoCounts = new Map();
    for (const { eventDate, promoCounts } of allPromoCounts) {
        if (filterFn({ start: { utc: eventDate } })) { // Adjust the filtering logic based on the event's start time
            promoCounts.forEach(([code, count]) => {
                if (!isHiddenPromoCode(code)) {
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

async function fetchPromoCodeCountsFromCache(timeframe) {
    console.log("fetchPromoCodeCountsFromCache: " + timeframe);

    switch(timeframe) {
        case 'all':
            return await kv.get(PROMO_CODES_KEY.ALL) || null;
        case 'month':
            return await kv.get(PROMO_CODES_KEY.MONTH) || null;
        case 'week':
            return await kv.get(PROMO_CODES_KEY.WEEK) || null;
        default:
            return null;
    }
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
