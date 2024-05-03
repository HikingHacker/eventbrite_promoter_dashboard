import React, { useState } from 'react';

export function Leaderboard({ players }) {
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;

    // Calculate the indices of the first and last entries on the current page
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = players.slice(indexOfFirstEntry, indexOfLastEntry);

    // Change page handlers
    const nextPage = () => {
        setCurrentPage(prev => prev + 1);
    };
    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    return (
        <div>
            <div className="table">
                {currentEntries.map((player, index) => {
                    const style = { color: "black" };
                    // Updated gradientClass logic
                    const gradientClass = (currentPage === 1 && index === 0) ? "gradient-box-mvp" :
                        player[1] > 20 ? "gradient-box-vip" : "gradient-box-promoter";
                    // Determine if current entries are on the first page for medals
                    const emoji = (currentPage === 1 && (index === 0 || index === 1 || index === 2))
                        ? (index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉")
                        : "";
                    const position = indexOfFirstEntry + index + 1;

                    return (
                        <div className="row" key={index} style={{ display: 'flex', alignItems: 'stretch', margin: '10px 0' }}>
                            <div className={`position ${gradientClass}`} style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                #{position}
                            </div>
                            <div className={`user-score ${gradientClass}`} style={{ ...style, marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                <div className="username">{player[0]}</div>
                                <div className="score">{emoji} {player[1]}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px', gap: '10px' }}>
                <button onClick={prevPage} disabled={currentPage === 1} style={{ width: '100px', padding: '10px' }}>
                    Previous
                </button>
                <button onClick={nextPage} disabled={currentPage * entriesPerPage >= players.length} style={{ width: '100px', padding: '10px' }}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default Leaderboard;
