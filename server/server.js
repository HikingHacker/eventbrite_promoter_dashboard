require('dotenv').config();
const express = require('express');
const eventRoutes = require('./routes/events.js');

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
// app.use(cors()); // Use CORS


app.use('/api/events', eventRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });