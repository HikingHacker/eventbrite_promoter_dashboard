import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {replacePromoCodesWithNames, combinePromoCodes} from "../utils/utils";
import './Leaderboard.css';  // Import the CSS file

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function Leaderboard({ players }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [timeFrame, setTimeFrame] = useState('month');
    const [filteredPromoCodes, setFilteredPromoCodes] = useState(players);
    const entriesPerPage = 10;
    // Calculate the indices of the first and last entries on the current page
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredPromoCodes.slice(indexOfFirstEntry, indexOfLastEntry);

    // Fetch promo codes from cache when timeFrame changes
    useEffect(() => {
        const fetchPromoCodeCountsFromCache = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/events/aggregateCached/${timeFrame}`);
                setFilteredPromoCodes(combinePromoCodes(replacePromoCodesWithNames(response.data)));
                setCurrentPage(1); // Reset to first page on filter change
            } catch (err) {
                console.error('Error fetching promo codes:', err);
            }
        };

        fetchPromoCodeCountsFromCache();
    }, [timeFrame]);

    // Change time filter
    const handleButtonClick = (event) => {
        // Remove 'active' class from all buttons
        document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));

        // Add 'active' class to the clicked button
        event.target.classList.add('active');

        // Set timeFrame to the id of the clicked button
        setTimeFrame(event.target.id);
    };

    // Change page handlers
    const nextPage = () => {
        setCurrentPage(prev => prev + 1);
    };
    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    // Determine the number of empty rows needed
    const numPlayersOnCurrentPage = Math.min(filteredPromoCodes.length - indexOfFirstEntry, entriesPerPage);
    const numEmptyRows = Math.max(entriesPerPage - numPlayersOnCurrentPage, 0);

    // Fill empty rows with "Refer A Friend" and score 0
    const emptyRows = Array.from({ length: numEmptyRows }, () => (["Refer A Friend", 0]));

    const currentEntriesWithEmptyRows = [...currentEntries, ...emptyRows];

    return (
        <div>
            <h1 className="promoter-leaderboard">LEADERBOARD</h1>

            <div className="filter-buttons">
                <button id="all" className="filter-button" onClick={handleButtonClick}>ALL</button>
                <button id="month" className="filter-button active" onClick={handleButtonClick}>MONTH</button>
                <button id="week" className="filter-button" onClick={handleButtonClick}>WEEK</button>
            </div>

            <div className="table">
                {currentEntriesWithEmptyRows.map((player, index) => {
                    const style = { color: (currentPage === 1 && index === 0) ? "white" : "black" };
                    const gradientClass = (currentPage === 1 && index === 0) ? "gradient-box-mvp" :
                        player[1] >= 20 ? "gradient-box-vip" : "gradient-box-promoter";
                    const emoji = (currentPage === 1 && (index === 0 || index === 1 || index === 2))
                        ? (index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉")
                        : "";
                    const position = indexOfFirstEntry + index + 1;

                    return (
                        <div className="row" key={index}>
                            <div className={`position ${gradientClass}`} style={style}>
                                #{position}
                            </div>
                            <div className={`user-score ${gradientClass}`} style={style}>
                                <div className="username">{player[0]}</div>
                                <div className="score">{emoji} {player[1]}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="pagination-container">
                <button
                    className="pagination-button"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                >
                    PREVIOUS
                </button>
                <button
                    className="pagination-button"
                    onClick={nextPage}
                    disabled={currentPage * entriesPerPage >= filteredPromoCodes.length}
                >
                    NEXT
                </button>
            </div>
        </div>
    );
}

export default Leaderboard;