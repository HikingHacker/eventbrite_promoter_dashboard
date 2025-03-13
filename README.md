# WaveGarden Promoter Dashboard

This project is a web application that fetches and displays promo code usage data from the Eventbrite API, allowing promoters to track their performance and share event links.

## Features

- **Leaderboard**: Displays promoter rankings with:
  - Time filtering options (all-time, month, week)
  - Medal indicators for top performers (🥇🥈🥉)
  - Pagination for browsing all promoters
- **Events Table**: Shows upcoming events with:
  - Event details and direct links
  - Promo code link generator tool
  - Date and time formatting
- **Performance Optimizations**:
  - Redis caching for API responses
  - Background cache updates
  - Immediate display of cached data with fresh data updates
- **User Interface**:
  - Dark theme with teal accents
  - Responsive design
  - Error boundary handling

## Installation

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Install Redis for caching functionality.
4. Create a `.env` file in the root directory and add your Eventbrite API key:

```
EVENTBRITE_API_KEY=your_api_key_here
REDIS_URL=your_redis_url (optional for local development)
```

5. Run `npm start` to start both the client and server.

## Development

- Client only: `cd client && npm start`
- Server only: `cd server && npm start`
- Full stack: `npm start` (runs both concurrently)
- Build client: `cd client && npm run build`
- Deploy server: `npm run deploy-server`

## Usage

Open your browser and navigate to `http://localhost:3000` to view the application.

The dashboard provides:
- A leaderboard showing promoter performance with time filtering options
- An upcoming events table with promo code link generation functionality
- An intuitive dark UI theme optimized for promoter workflows

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)