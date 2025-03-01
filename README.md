# Shiller App

A platform for crypto shillers to connect, share, and earn rewards.

## Features

- User registration and authentication with JWT
- Profile management with profile pictures
- Follow system for connecting with other shillers
- Shilling management system
- Rewards tracking
- Responsive design with Tailwind CSS

## Tech Stack

### Frontend
- React with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests

### Backend
- Node.js with Express
- TypeScript
- MongoDB for database
- JWT for authentication
- Multer for file uploads

## Project Structure

```
shiller-app/
├── client/             # Frontend React application
│   ├── public/         # Static assets
│   └── src/            # Source code
│       ├── assets/     # Images, fonts, etc.
│       ├── components/ # React components
│       ├── context/    # React context providers
│       ├── pages/      # Page components
│       ├── types/      # TypeScript type definitions
│       └── utils/      # Utility functions
└── server/             # Backend Express application
    ├── src/            # Source code
    │   ├── config/     # Configuration files
    │   ├── controllers/# Route controllers
    │   ├── middleware/ # Express middleware
    │   ├── models/     # Mongoose models
    │   └── routes/     # Express routes
    └── uploads/        # Uploaded files
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create `.env` file in the server directory
   - Create `.env` file in the client directory

4. Start the development servers:
   ```
   # Start the backend server
   cd server
   npm run dev

   # Start the frontend server
   cd ../client
   npm run dev
   ```

## License

MIT
