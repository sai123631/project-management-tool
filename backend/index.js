require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// Default route
app.get('/', (req, res) => {
  res.send('Project Management API');
});

const startServer = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    // Try to start mongodb-memory-server for local preview
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
    
    await mongoose.connect(mongoUri);
    console.log('Connected to In-Memory MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

startServer();
