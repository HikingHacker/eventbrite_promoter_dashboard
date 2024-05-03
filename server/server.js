require('dotenv').config();
const express = require('express');
const eventBriteRoutes = require('./routes/EventBriteRouter.js');
// const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');

// const corsOptions = {
//     origin: ['https://eventbrite-promoter-dashboard.vercel.app', 'https://wavegarden-a9640094dac7.herokuapp.com/'],
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
//
// const cors = require('cors');
//
// // Enable CORS for specific websites
// app.use(cors(corsOptions));

// Serve static files from the React app in production
// if (process.env.NODE_ENV === 'local') {
// // Serve static files from the 'public' directory
//     app.use(express.static(path.join(__dirname, 'public')));
// }
app.use(express.static(path.join(__dirname, 'public')));


// Parse JSON bodies
app.use(express.json());

// // Apply rate limiter to all API routes
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use('/api/', limiter);

// Use modular routes
app.use('/api/events', eventBriteRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});