const {format} = require("date-fns");

export function filterEventName(eventName) {
    const regex = /\b(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday) \d{1,2}\/\d{1,2}\b \|/;
    return eventName.replace(regex, "").trim();
}

// only display valid future events
export function filterEvents(events, startDate) {
    return events
        .filter(event => !event.deleted)
        .filter(event => new Date(event.end.utc) > new Date(startDate))
        .filter(event => event.status === "live" && event.listed == true);
}

export function formatDayAndMonth(event) {
    const dayOfMonth = new Date(event.utc).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    const dayOfWeek = new Date(event.utc).toLocaleDateString('en-US', { weekday: 'short' });

    return (
        <div className="day-and-month" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
            <div className="day-of-week">{dayOfWeek}</div>
            <div className="day-of-week">{dayOfMonth}</div>
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
            return formatted.replace(/:00(?=\s|$)/g, '');
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

// replaces PROMOCODE with ACTUAL NAMES
export function replacePromoCodesWithNames(promoCodesList) {
    const codeToName = {
        "SILLYGUY": "ALLEN PUTICH",
        "KYLEG": "KYLE GRANT",
        "KWATTS": "ERVIN RODRIGUEZ",
        "MELFINV": "MELFINA VIENGSOMBAT",
        "VK": "KESHUN BABER",
        "KLOW": "KEVIN LOPEZ",
        "TORI": "VICTORIA VALENZUELA",
        "VIBRANTVIBEZ": "VICTORIA VALENZUELA",
        "TRACE": "TRACEY KHUC",
        "KOOKMONSTA": "KAI YOON",
        "CTC": "NOND HASBAMRER",
        "CANCELTHECOUCH": "NOND HASBAMRER",
        "RELEXD": "DINO BRCANINOVIC",
        "ARIEL": "ARIEL ESPINOSA",
        "NWPLUR": "MADELINE NELSON",
        "GRIME": "CAMERON GIMGESTAD",
        "MECHA": "DAVID ALVARADO",
        "SANGABSS": "SANDRA CHROSTOWSKA",
        "SKA": "SANDRA CHROSTOWSKA",
    };

    return promoCodesList.map(([promoCode, count]) => {
        const uppercasedPromoCode = promoCode.toUpperCase();
        const name = codeToName.hasOwnProperty(uppercasedPromoCode) ? codeToName[uppercasedPromoCode] : promoCode;
        return [name, count];
    });
}

export function combinePromoCodes(promoCodes) {
    let combinedCodes = {};

    // Iterate through each entry in the promoCodes list
    for (let [code, value] of promoCodes) {
        // If the code already exists in combinedCodes, add the value
        if (combinedCodes[code]) {
            combinedCodes[code] += value;
        } else {
            // Otherwise, create a new entry with the code and value
            combinedCodes[code] = value;
        }
    }

    // Convert the combinedCodes object back into an array format
    return Object.entries(combinedCodes);
}
