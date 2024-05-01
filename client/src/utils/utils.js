function filterEventsByStartDate(events, startDate) {
    return events.filter(event => new Date(event.start.utc) > new Date(startDate));
}

function formatDate(event) {
    return new Date(event.utc).toLocaleDateString() + ' ' + new Date(event.utc).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

module.exports = {
    filterEventsByStartDate,
    formatDate
};