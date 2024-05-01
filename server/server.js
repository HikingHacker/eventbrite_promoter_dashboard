require('dotenv').config();
const express = require('express');
const eventBriteRoutes = require('./routes/EventBriteRouter.js');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// // Enable CORS
// app.use(cors());
//const cors = require('cors');

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