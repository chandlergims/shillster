# Railway Deployment Guide

## Environment Variables

To deploy this application on Railway, you need to set up the following environment variables:

### Required Environment Variables

1. **MONGODB_URI**: Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`
   - This is required for the server to connect to your MongoDB database

2. **JWT_SECRET**: Secret key for JWT token generation
   - Example: `your_jwt_secret_key`
   - Used for authentication

3. **PORT**: The port your server will run on (Railway will override this, but it's good to have as a fallback)
   - Example: `5000`

### Optional Environment Variables

1. **NODE_ENV**: Set to `production` for production environment
   - Example: `production`

2. **CLIENT_ORIGIN**: URL of your client application (for CORS)
   - Example: `https://your-app-name.up.railway.app`

## How to Set Environment Variables in Railway

1. Go to your project in the Railway dashboard
2. Click on the "Variables" tab
3. Add each environment variable as a key-value pair
4. Click "Add" after entering each variable
5. Railway will automatically redeploy your application with the new environment variables

## Troubleshooting

If you see the error: `MongoDB URI is not defined. Please set the MONGODB_URI environment variable.`, it means you haven't set the MONGODB_URI environment variable in your Railway project.

## Local Development vs Railway Deployment

- In local development, these variables are loaded from the `.env` file
- For Railway deployment, you need to set these variables in the Railway dashboard
- The `.env` file is not uploaded to GitHub for security reasons
