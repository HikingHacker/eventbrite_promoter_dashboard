const {format} = require("date-fns");

export function filterEventsByStartDate(events, startDate) {
    return events.filter(event => new Date(event.start.utc) > new Date(startDate));
}

export function formatDate(event) {
    return new Date(event.utc).toLocaleDateString() + ' ' + new Date(event.utc).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function formatDay(event) {
    return new Date(event.utc).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
}

export function FormattedDay(event) {
    const dayOfMonth = new Date(event.utc).toLocaleDateString('en-US', { day: 'numeric' });
    const dayOfWeek = new Date(event.utc).toLocaleDateString('en-US', { weekday: 'short' });

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div>{dayOfWeek}</div>
            <div style={{border: '2px solid blue', borderRadius: '200%', padding: '5px', width: '30px', textAlign: 'center'}}>{dayOfMonth}</div>
        </div>
    );
}

export function formatTimeRange(start, end) {
    // Create Date instances from UTC time strings
    const startDate = new Date(start.utc);
    const endDate = new Date(end.utc);

    try {
        // Custom formatter to remove ':00' when minutes are zero
        const customFormat = (date) => {
            const formatted = format(date, 'h:mm a');
            return formatted.endsWith(':00') ? formatted.slice(0, -6) + formatted.slice(-3) : formatted;
        };

        // Format the start and end times using the custom formatter
        const formattedStart = customFormat(startDate);
        const formattedEnd = customFormat(endDate);

        // Ensure time range format is compact and does not repeat AM/PM if the same
        let timeRange = `${formattedStart} - ${formattedEnd}`;
        if (timeRange.endsWith(' AM') && timeRange.startsWith(' AM') || timeRange.endsWith(' PM') && timeRange.startsWith(' PM')) {
            timeRange = `${formattedStart.slice(0, -3)} - ${formattedEnd}`;
        }
        return timeRange;
    } catch (error) {
        // Log and rethrow any errors encountered during formatting
        console.error('Error formatting dates:', error);
        throw error;
    }
}