import React from "react";

export function renderPromoCodesTable(promoCodes) {
    return (
        <table>
            <thead>
            <tr>
                <th>Promo Code</th>
                <th className="count-header">Count</th>
            </tr>
            </thead>
            <tbody>
            {promoCodes.map((promoCode, index) => (
                <tr key={index}>
                    <td>{promoCode[0]}</td> {/* First index for the code */}
                    <td className="count">{promoCode[1]}</td> {/* Second index for the count */}
                </tr>
            ))}
            </tbody>
        </table>
    );
}