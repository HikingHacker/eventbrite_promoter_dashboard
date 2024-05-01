# WaveGarden Promoter Dashboard

This project is a web application that fetches and displays promo code usage data from the Eventbrite API.

## Features

- Fetches event data from the Eventbrite API.
- Aggregates promo code usage across all events.
- Displays promo code usage in a table, sorted by usage count.
- Caches promo code usage data to improve performance.
- Updates the cache in the background to ensure data is up-to-date.
- Immediately displays cached data on page load, then updates with fresh data once it's available.

## Installation

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Create a `.env` file in the root directory and add your Eventbrite API key:

```
EVENTBRITE_API_KEY=your_api_key_here
```

4. Run `npm start` to start the server.

## Usage

Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)