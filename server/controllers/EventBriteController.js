/*
 * Controller: Acts as an intermediary between the router and service layers. Controllers
 * handle incoming requests, validate input, and then call the appropriate services to
 * perform business logic. After the business logic is executed, controllers format the
 * response to be sent back to the client. This separation ensures that the business logic
 * is kept separate from the HTTP interface, which improves the testability and reusability
 * of the code.
 */
const { handleError, formatResponse, getEventId } = require('./controllerHelpers');
const eventBriteService = require('../services/EventBriteService.js');

// Fetches all events for the organization from the EventBrite API.
exports.fetchOrganizationEvents = async (req, res) => {
    try {
        const events = await eventBriteService.fetchOrganizationEvents();
        formatResponse(res, events);
    } catch (error) {
        handleError(res, error, 'Error fetching events:');
    }
};

// Fetches all promo codes for a specific event from the EventBrite API.
exports.fetchPromoCodesForEvent = async (req, res) => {
    try {
        const eventId = getEventId(req);
        const promoCodes = await eventBriteService.fetchPromoCodes(eventId);
        formatResponse(res, promoCodes);
    } catch (error) {
        handleError(res, error, 'Error fetching promo codes:');
    }
};

// Fetches and counts all promo codes for all events from the EventBrite API.
exports.fetchAndCountPromoCodes = async (req, res) => {
    try {
        const promoCodes = await eventBriteService.fetchAndCountPromoCodes();
        formatResponse(res, promoCodes);
    } catch (error) {
        handleError(res, error, 'Error aggregating promo codes:');
    }
};

// Fetches the cached promo code counts.
exports.fetchPromoCodeCountsFromCache = async (req, res) => {
    try {
        const promoCodeCounts = await eventBriteService.fetchPromoCodeCountsFromCache();
        if (promoCodeCounts !== null) {
            formatResponse(res, promoCodeCounts);
        } else {
            console.log("GOT NULL RESULT")
            res.status(404).send('No cached data found');
        }
        console.log("fetchPromoCodeCountsFromCache ran successfully")
    } catch (error) {
        handleError(res, error, 'Error retrieving cached promo codes:');
    }
};

// Fetches all events for the organization from the EventBrite API in a paginated manner.
exports.fetchPaginatedEvents = async (req, res) => {
    try {
        const events = await eventBriteService.fetchPaginatedEvents();
        formatResponse(res, events);
    } catch (error) {
        handleError(res, error, 'Error fetching paginated events:');
    }
};