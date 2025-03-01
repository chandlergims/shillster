import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import shillRoutes from './routes/shillRoutes';

// Load environment variables
dotenv.config();

// Initialize MongoDB connection
connectDB();

const app: Express = express();

// Middleware
// Always use CORS with appropriate settings for Vercel
app.use(cors({
  origin: '*', // Allow all origins - will be restricted by Vercel.json
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Make uploads folder static if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
}

// Routes
app.use('/api/users', userRoutes);
app.use('/api/shills', shillRoutes);

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Shiller API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Listen on a port for both development and Railway deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Export for Vercel (if needed)
export default app;
