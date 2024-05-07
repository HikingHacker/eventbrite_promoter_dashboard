// // change time filter
// const handleButtonClick = (event) => {
//     // Remove 'active' class from all buttons
//     document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
//
//     // Add 'active' class to the clicked button
//     event.target.classList.add('active');
// };
//
// export function TimeFiltering() {
//     return (
//         <div className="filter-buttons">
//             <button id="all" className="filter-button" onClick={handleButtonClick}>ALL</button>
//             <button id="month" className="filter-button active" onClick={handleButtonClick}>MONTH</button>
//             <button id="week" className="filter-button" onClick={handleButtonClick}>WEEK</button>
//         </div>
//     );
// }