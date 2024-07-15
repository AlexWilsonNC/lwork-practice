const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors({
  origin: 'https://ptcg-legends-6abc11783376.herokuapp.com', // Replace with your frontend domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use(express.json());  // For parsing application/json

// Connect to MongoDB
const uri = process.env.MONGODB_URI;
console.log('Attempting to connect to MongoDB with URI:', uri);

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Ensure the following:');
    console.error('1. Your IP is whitelisted in MongoDB Atlas.');
    console.error('2. Your connection string is correct.');
  });

const eventSchema = new mongoose.Schema({
  id: String,
  name: String,
  eventType: String,
  eventLogo: String,
  date: String,
  flag: String,
  location: String,
  address: String,
  organizer: String,
  organizerLink: String,
  streamsDay1: String,
  streamsDay2: String,
  streamsDay3: String,
  format: String,
  dayOnePlayers: String,
  dayTwoPlayers: String,
  // Add other fields that might be in your event schema
});

const Event = mongoose.model('Event', eventSchema);

// Route to get an event by ID
app.get('/tournaments/:id', async (req, res) => {
  console.log(req.params.id);
  try {
    const event = await Event.findOne({ id: req.params.id });
    if (event) {
      res.json(event);
    } else {
      res.status(404).send('Event not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to get all event IDs
app.get('/api/event-ids', async (req, res) => {
  try {
    const events = await Event.find({}, 'id');
    const eventIds = events.map(event => event.id);
    res.json(eventIds);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch event IDs' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World! The server is running.'); // Basic response to indicate the server is running
});

app.listen(port, () => console.log(`Server running on port ${port}`));
