// Error handling function
function handleError(res, error, message) {
    console.error(message, error);
    res.status(500).send('Server Error');
}

// Response formatting function
function formatResponse(res, data, status = 200) {
    res.status(status).json(data);
}

// Parameter extraction functions
function getEventId(req) {
    return req.params.eventId;
}

module.exports = {
    handleError,
    formatResponse,
    getEventId
};