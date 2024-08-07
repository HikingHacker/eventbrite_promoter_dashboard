import React, { useState } from "react";
import { filterEventName, formatDayAndMonth, formatTimeRange } from "../utils/utils";
import './EventsTable.css';  // Import the CSS file

export function EventsTable({ events }) {
    const [promoCode, setPromoCode] = useState("");
    const [isClicked, setIsClicked] = useState(false);

    const applyPromoCode = (url) => {
        return `${url}?discount=${encodeURIComponent(promoCode)}`;
    };

    const handleInputChange = (e) => {
        setPromoCode(e.target.value);
        setIsClicked(true);
    };

    return (
        <div>
            <h1 className="events-text">EVENTS</h1>

            <div className="promo-container">
                <label htmlFor="promo-code" className="promo-label">PROMO CODE:</label>
                <input
                    type="text"
                    id="promo-code"
                    value={promoCode}
                    onChange={handleInputChange}
                    className="promo-input"
                />
                <button className="promo-button">
                    {isClicked ? '✅' : '☑️'}
                </button>
            </div>

            <div className="events-table">
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
                                <div className="time-range">{formatTimeRange(event.start, event.end)}</div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EventsTable;