import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/server';

// This is the serverless function handler for Vercel
export default async (req: VercelRequest, res: VercelResponse) => {
  // Forward the request to our Express app
  return new Promise((resolve, reject) => {
    try {
      // Create a mock response object that captures the Express response
      const mockRes: any = {};
      
      // Store the original methods
      const originalSetHeader = res.setHeader;
      const originalEnd = res.end;
      const originalJson = res.json;
      
      // Override methods to capture and forward
      res.setHeader = function(name, value) {
        originalSetHeader.call(this, name, value);
        return this;
      };
      
      res.end = function(chunk) {
        originalEnd.call(this, chunk);
        resolve(undefined);
        return this;
      };
      
      res.json = function(body) {
        originalJson.call(this, body);
        resolve(undefined);
        return this;
      };
      
      // Process the request through the Express app
      app(req, res);
    } catch (error) {
      console.error('Error in serverless function:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      resolve(undefined);
    }
  });
};
