import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS setup for allowing requests from frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running', 
    version: '1.0.0',
    timestamp: new Date().toISOString() 
  });
});

// Sample API endpoints
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
  ]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
