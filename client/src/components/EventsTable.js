import React, { useState } from "react";
import { filterEventName, formatDayAndMonth, formatTimeRange } from "../utils/utils";

export function EventsTable({ events }) {
    const [promoCode, setPromoCode] = useState("");
    const [isClicked, setIsClicked] = useState(false);

    const applyPromoCode = (url) => {
        return `${url}?discount=${encodeURIComponent(promoCode)}`;
    };

    const handleInputChange = (e) => {
        setPromoCode(e.target.value);
        setIsClicked(true); // Update to true when text changes
    };

    return (
        <div>
            <div style={styles.promoContainer}>
                <label htmlFor="promo-code" style={styles.label}>PROMO CODE:</label>
                <input
                    type="text"
                    id="promo-code"
                    value={promoCode}
                    onChange={handleInputChange}
                    style={styles.input}
                />
                <button style={styles.button}>
                    {isClicked ? '✅' : '☑️'}
                </button>
            </div>

            <div style={styles.eventsTable}>
                <table>
                    <tbody>
                    {events.map(event => (
                        <tr key={event.id}>
                            <td>{formatDayAndMonth(event.start)}</td>
                            <td>
                                <div>
                                    <a href={applyPromoCode(event.url)} target="_blank" rel="noopener noreferrer">
                                        {filterEventName(event.name.text)}
                                    </a>
                                </div>
                                <div style={styles.timeRange}>{formatTimeRange(event.start, event.end)}</div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


const styles = {
    promoContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: '10px',
        marginTop: '10px',
        color: 'white',
        height: '50px', // Add this line
    },
    label: {
        marginRight: '10px',
        padding: '10px',
        width: '30%',
        fontWeight: 'bold',
        textAlign: 'right',
        whiteSpace: 'nowrap', // Add this line
    },
    input: {
        border: 'none',
        padding: '7px',
        borderRadius: '5px',
        fontSize: '16px',
        width: '55%', // Add this line
    },
    button: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        float: 'left',
        textAlign: 'left', // Add this line
        fontSize: '32px',
        width: '15%', // Add this line
    },
    eventsTable: {
        marginTop: '20px',
    },
    timeRange: {
        marginTop: '5px',
    }
};

export default EventsTable;
