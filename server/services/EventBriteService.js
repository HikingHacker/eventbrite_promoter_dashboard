/*
 * Services: Contains the core business logic of the application. Services handle data
 * processing, interact with the database, and perform specific operations required by
 * the application. By isolating business logic in services, you ensure that it's decoupled
 * from the web layer, which promotes reuse across different parts of the application and
 * simplifies unit testing.
 */

const axios = require('axios');
const NodeCache = require('node-cache');
const config = {
    eventBriteBaseUrl: process.env.EVENTBRITE_BASE_URL || 'DEFAULT',
    organizationId: process.env.EVENTBRITE_ORGANIZATION_ID || 'DEFAULT',
    oauth_token: process.env.EVENTBRITE_TOKEN || 'DEFAULT'
};

// cache setup
const SEVEN_DAY_IN_SECONDS = 7 * 86400;
const PROMO_CODES_KEY = "aggregateData"; // TODO: use organization id as key
const promoCodeCountCache = new NodeCache({ stdTTL: SEVEN_DAY_IN_SECONDS });

async function fetchPaginatedData(url, params, key) {
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

async function fetchPaginatedEvents() {
    const url = `${config.eventBriteBaseUrl}organizations/${config.organizationId}/events/`;
    const params = {
        time_filter: 'all',
        order_by: 'start_asc'
    };
    return fetchPaginatedData(url, params, 'events');
}

async function fetchPromoCodes(eventId) {
    const url = `${config.eventBriteBaseUrl}events/${eventId}/attendees/`;
    const params = {
        expand: 'promotional_code'
    };
    const attendees = await fetchPaginatedData(url, params, 'attendees');
    const promoCounts = {};
    attendees.forEach(attendee => {
        if (attendee && attendee.promotional_code) {
            const promoCode = attendee.promotional_code.code;
            if (promoCode) {
                promoCounts[promoCode] = (promoCounts[promoCode] || 0) + 1;
            }
        }
    });
    return promoCounts;
}

async function fetchAndCountPromoCodes() {
    const events = await fetchOrganizationEvents();
    console.log("events.count:" + events.length);

    const overallPromoCounts = new Map();
    for (let event of events) {
        console.log("event.id: " + event.id);
        const promoCounts = await fetchPromoCodes(event.id);
        for (let [code, count] of Object.entries(promoCounts)) {
            if (code !== 'FREE_TICKET_DEV_TEST') { // Skip the user named "FREE_TICKET_DEV_TEST"
                overallPromoCounts.set(code, (overallPromoCounts.get(code) || 0) + count);
            }
        }
    }
    // sort and clean up the promo codes
    const sortedPromoCodes = [...overallPromoCounts.entries()].sort((a, b) => b[1] - a[1]);
    // removePromoCode(sortedPromoCodes, 'FREE_TICKET_DEV_TEST');
    // combinePromoCodes(sortedPromoCodes) // TODO: add filtering logic

    // console.log(sortedPromoCodes); // Log the value being stored
    const success = promoCodeCountCache.set(PROMO_CODES_KEY, sortedPromoCodes);
    // console.log(success); // Log whether the value was successfully stored

    return sortedPromoCodes;
}

function fetchPromoCodeCountsFromCache() {
    return promoCodeCountCache.get(PROMO_CODES_KEY) || null;
}

function removePromoCode(promoCodes, promoCodeToRemove) {
    console.log("removePromoCode.promoCodes: " + promoCodes);

    if (promoCodes.has(promoCodeToRemove)) {
        promoCodes.delete(promoCodeToRemove);
    }
}

function combinePromoCodes(promoCodes) {
    const combinedPromoCodes = new Map();

    for (let [code, count] of promoCodes.entries()) {
        if (code.toString().endsWith('25')) {
            const baseCode = code.slice(0, -2);
            if (promoCodes.has(baseCode)) {
                const baseCount = promoCodes.get(baseCode);
                combinedPromoCodes.set(baseCode, baseCount + count);
            } else {
                combinedPromoCodes.set(code, count);
            }
        } else {
            combinedPromoCodes.set(code, count);
        }
    }
    return combinedPromoCodes;
}

module.exports = {
    fetchOrganizationEvents,
    fetchPaginatedEvents,
    fetchPromoCodes,
    fetchAndCountPromoCodes,
    fetchPromoCodeCountsFromCache
};
