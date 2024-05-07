import React, { useState } from 'react';

export function Leaderboard({ players }) {
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;

    // Calculate the indices of the first and last entries on the current page
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = players.slice(indexOfFirstEntry, indexOfLastEntry);

    // change time filter
    const handleButtonClick = (event) => {
        // Remove 'active' class from all buttons
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));

        // Add 'active' class to the clicked button
        event.target.classList.add('active');
    };

    // Change page handlers
    const nextPage = () => {
        setCurrentPage(prev => prev + 1);
    };
    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    // Determine the number of empty rows needed
    const numPlayersOnCurrentPage = Math.min(players.length - indexOfFirstEntry, entriesPerPage);
    const numEmptyRows = Math.max(entriesPerPage - numPlayersOnCurrentPage, 0);


    // Fill empty rows with "Refer A Friend" and score 0
    const emptyRows = Array.from({ length: numEmptyRows }, () => (["EMPTY", 0]));

    const currentEntriesWithEmptyRows = [...currentEntries, ...emptyRows];

    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });


    return (
        <div>
            <h1 className="promoter-leaderboard">LEADERBOARD</h1>
            {/*<br></br>*/}
            {/*<div className="filter-buttons">*/}
            {/*    <button id="all" className="filter-button" onClick={handleButtonClick}>ALL</button>*/}
            {/*    <button id="month" className="filter-button active" onClick={handleButtonClick}>MONTH</button>*/}
            {/*    <button id="week" className="filter-button" onClick={handleButtonClick}>WEEK</button>*/}
            {/*</div>*/}

            <div className="table">
                {currentEntriesWithEmptyRows.map((player, index) => {
                    const style = {color: (currentPage === 1 && index === 0) ? "white" : "black" };
                    // Updated gradientClass logic
                    const gradientClass = (currentPage === 1 && index === 0) ? "gradient-box-mvp" :
                        player[1] >= 20  ? "gradient-box-vip" : "gradient-box-promoter";
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


            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '15px', gap: '10px' }}>
                <button onClick={prevPage} disabled={currentPage === 1} style={{ width: '50%', padding: '15px', backgroundColor: (currentPage === 1) ? 'darkgray' : 'black', color: 'white', boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)' }}>
                    PREVIOUS
                </button>
                <button onClick={nextPage} disabled={currentPage * entriesPerPage >= players.length} style={{ width: '50%', padding: '10px', backgroundColor: (currentPage * entriesPerPage >= players.length) ? 'darkgray' : 'black', color: 'white', boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)' }}>
                    NEXT
                </button>
            </div>
        </div>
    );
}

export default Leaderboard;