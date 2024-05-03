import React from "react";

export function renderPromoCodesTable(promoCodes) {
    return (
        <table style={{width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px'}}>
            <thead>
            <tr>
                <th style={{width: '5ch'}}>Place</th>
                <th>Promo Code</th>
                <th className="count-header">Count</th>
            </tr>
            </thead>
            <tbody>
            {promoCodes.map((promoCode, index) => (
                <tr key={index} style={{border: '1px solid black', borderRadius: '10px', margin: '10px 0', backgroundColor: 'white'}}>
                    <td>#{index + 1}</td>
                    <td>{promoCode[0]}</td>
                    <td className="count">{promoCode[1]}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}