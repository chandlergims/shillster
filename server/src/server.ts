import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import shillRoutes from './routes/shillRoutes';
import imageRoutes from './routes/imageRoutes';

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

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log(`Creating uploads directory: ${uploadsDir}`);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Make uploads folder static with debugging
app.use('/uploads', (req, res, next) => {
  console.log(`Uploads request: ${req.url}`);
  const filePath = path.join(uploadsDir, req.url);
  console.log(`Checking file: ${filePath}`);
  if (fs.existsSync(filePath)) {
    console.log(`File exists: ${filePath}`);
  } else {
    console.log(`File does not exist: ${filePath}`);
  }
  next();
}, express.static(uploadsDir));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/shills', shillRoutes);
app.use('/api/images', imageRoutes);

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app build directory
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
  
  // For any request that doesn't match an API route, send the React app
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // Health check route for development
  app.get('/', (req: Request, res: Response) => {
    res.json({ 
      message: 'Shiller API is running',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  });
}

// Listen on a port for both development and Railway deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Uploads directory: ${uploadsDir}`);
  
  // List files in uploads directory
  if (fs.existsSync(uploadsDir)) {
    console.log('Uploads directory exists');
    const files = fs.readdirSync(uploadsDir);
    console.log(`Files in uploads directory: ${files.length}`);
    files.forEach(file => {
      console.log(` - ${file}`);
    });
  } else {
    console.log('Uploads directory does not exist');
  }
});

// Export for Vercel (if needed)
export default app;
