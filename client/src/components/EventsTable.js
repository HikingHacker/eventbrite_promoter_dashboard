import React from "react";
import {formatDate} from "../utils/utils";

export function renderEventsTable(events) {
    return (
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Start</th>
                <th>End</th>
            </tr>
            </thead>
            <tbody>
            {events.map(event => (
                <tr key={event.id}>
                    <td>{event.name.text}</td>
                    <td>{formatDate(event.start)}</td>
                    <td>{formatDate(event.end)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}