// client/src/components/Leaderboard.js

import React from 'react';

export function Leaderboard({ players }) {
    return (
        <div className="table">
            {players.map((player, index) => {
                let style = {};
                let rowClass = "row";
                let gradientClass = "";
                let emoji = "";

                // 1st, 2nd, 3rd ranked promoters
                if (index === 0) {
                    emoji = "🥇"; // Gold medal for 1st place
                } else if (index === 1) {
                    emoji = "🥈"; // Gold medal for 1st place
                } else if (index === 2) {
                    emoji = "🥉";
                }

                // Styling Rows
                if (index === 0) {
                    // MVP
                    gradientClass = "gradient-box-mvp";
                    style = {color: 'white'}; // Set text color to black
                } else if (player[1] > 10) {
                    // VIP
                    gradientClass = "gradient-box-vip";
                    style = {color: 'black'}; // Set text color to black
                } else {
                    // Promoter
                    gradientClass = "gradient-box-promoter"
                    style = {color: 'black'}; // Set text color to black
                }

                return (
                    <div className={rowClass} key={index} style={{display: 'flex', alignItems: 'stretch', margin: '10px 0'}}>
                        <div className={`position ${gradientClass}`} style={{...style, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>#{index + 1}</div>
                        <div className={`user-score ${gradientClass}`} style={{...style, marginLeft: '10px', display: 'flex', alignItems: 'center'}}>
                            <div className="username">{player[0]}</div>
                            <div className="score">{emoji} {player[1]}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Leaderboard;