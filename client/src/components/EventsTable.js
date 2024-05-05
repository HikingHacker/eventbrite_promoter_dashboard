import React from "react";
import {filterEventName, formatDayAndMonth, formatTimeRange} from "../utils/utils";

export function EventsTable({ events }) {
    return (
        <div>
            <div className="events-table">

                <table>
                    <tbody>
                    {events.map(event => (
                        <tr key={event.id}>
                            <td>{formatDayAndMonth(event.start)}</td>
                            <td>
                                <div><a href={event.url} target="_blank" rel="noopener noreferrer">{filterEventName(event.name.text)}</a>
                                </div>
                                <div style={{marginTop: '5px'}}>{formatTimeRange(event.start, event.end)}</div>
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