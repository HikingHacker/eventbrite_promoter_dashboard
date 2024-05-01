import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Export the PORT variable, defaulting to 3001 if not set in the environment
export const PORT = process.env.PORT || 3001;