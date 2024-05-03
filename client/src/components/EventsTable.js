import React from "react";
import {formatDay, FormattedDay, formatTimeRange} from "../utils/utils";

export function EventsTable({ events }) {
    return (
        <table>
            <tbody>
            {events.map(event => (
                <tr key={event.id}>
                    <td>{FormattedDay(event.start)}</td>
                    <td>
                        <div><a href={event.url} target="_blank" rel="noopener noreferrer">{event.name.text}</a></div>
                        <div style={{marginTop: '5px'}}>{formatTimeRange(event.start, event.end)}</div>                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default EventsTable;