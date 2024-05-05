/*
 * Router: Handles the routing of HTTP requests to the appropriate controllers
 * based on the URL and HTTP method. It's responsible for defining endpoints and
 * may also handle some preliminary request processing like middleware application
 * for authentication or logging. This keeps your API endpoints organized and easy
 * to manage as the application grows.
*/

const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/EventBriteController.js');

/*
// Fetch events for a specific organization
router.get('/organizations/:orgId/events', eventsController.fetchOrganizationEvents);
// Fetch promo codes for a specific event
router.get('/events/:eventId/promocodes', eventsController.fetchEventPromoCodes);
// Fetch current counts of promo codes for all events within an organization
router.get('/organizations/:orgId/promocodes/counts', eventsController.fetchOrganizationPromoCodes);
// Fetch cached counts of promo codes for all events within an organization
router.get('/organizations/:orgId/promocodes/counts/cached', eventsController.fetchOrganizationCachedPromoCodes);

// Fetch all events for a specific organization
router.get('/organizations/:orgId/events/all', eventsController.fetchPaginatedOrganizationEvents);
 */

router.get('/getEvents', eventsController.fetchOrganizationEvents);
router.get('/:eventId/promocodes', eventsController.fetchPromoCodesForEvent);
router.get('/aggregate', eventsController.fetchAndCountPromoCodes);
router.get('/aggregateCached', eventsController.fetchPromoCodeCountsFromCache);
router.get('/paginated', eventsController.fetchPaginatedEvents);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = router;