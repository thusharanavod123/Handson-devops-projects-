require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Configuration
const PORT = process.env.PORT || 5000;
// Default to localhost, but allow override for Docker networking
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/todos';

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log(`Connected to MongoDB at ${MONGO_URI}`))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    // In a real DevOps env, you might want to exit if DB fails
    // process.exit(1); 
  });

// Schema
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    if (!req.body.text) return res.status(400).json({ error: 'Text is required' });
    const newTodo = new Todo({ text: req.body.text });
    await newTodo.save();
    res.json(newTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
