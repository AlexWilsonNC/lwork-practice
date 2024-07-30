const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const cardUri = process.env.CARD_MONGODB_URI;
const playersUri = process.env.PLAYERS_MONGODB_URI; // New URI for players database

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err));

const eventConnection = mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const cardConnection = mongoose.createConnection(cardUri, { useNewUrlParser: true, useUnifiedTopology: true });
const playersConnection = mongoose.createConnection(playersUri, { useNewUrlParser: true, useUnifiedTopology: true }); // New connection for players

eventConnection.on('error', console.error.bind(console, 'MongoDB connection error for eventConnection:'));
eventConnection.once('open', () => {
  // console.log('Connected to eventConnection');
});

cardConnection.on('error', console.error.bind(console, 'MongoDB connection error for cardConnection:'));
cardConnection.once('open', () => {
  // console.log('Connected to cardConnection');
});

playersConnection.on('error', console.error.bind(console, 'MongoDB connection error for playersConnection:'));
playersConnection.once('open', () => {
  console.log('Connected to playersConnection');
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
});

const cardSchema = new mongoose.Schema({
  id: String,
  name: String,
  supertype: String,
  setAbbrev: String,
  subtypes: [Object],
  hp: Number,
  types: [Object],
  attacks: [Object],
  weaknesses: [Object],
  resistances: [Object],
  convertedRetreatCost: Number,
  set: {
    id: String,
    number: String,
    printedTotal: Number,
    releaseDate: String,
  },
  number: String,
  rarity: String,
  images: {
    small: String,
    large: String,
  }
});

const playerSchema = new mongoose.Schema({
  id: String,
  name: String,
  flag: String,
  results: [{
      eventId: String,
      decklist: String
  }]
});

const Event = eventConnection.model('Event', eventSchema);
const Player = playersConnection.model('Player', playerSchema); // New model for players

// Define API routes before static files and catch-all route
app.get('/events/:id', async (req, res) => {
  // console.log(req.params.id)
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

app.get('/event-ids', async (req, res) => {
  try {
    const events = await Event.find({}, 'id');
    const eventIds = events.map(event => event.id);
    res.json(eventIds);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch event IDs' });
  }
});

app.get('/api/cards/:set/:number', async (req, res) => {
  const { set, number } = req.params;
  // console.log(`Fetching card from set: ${set}, number: ${number}`);

  try {
    const collection = cardConnection.collection(set);
    if (!collection) {
      console.error(`Collection ${set} not found`);
      return res.status(404).json({ message: `Collection ${set} not found` });
    }

    // Ensure number is treated as a string
    const card = await collection.findOne({ number: String(number) });
    if (card) {
      // console.log('Card found:', card);
      res.status(200).json(card);
    } else {
      console.error(`Card not found in set: ${set}, number: ${number}`);
      res.status(404).json({ message: `Card not found in set: ${set}, number: ${number}` });
    }
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).send('Error fetching card');
  }
});

app.get('/api/cards/:collectionName', async (req, res) => {
  const collectionName = req.params.collectionName;

  try {
    const collection = cardConnection.collection(collectionName);
    const cards = await collection.find({}).toArray();

    res.status(200).json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).send('Error fetching cards');
  }
});

app.get('/api/cards', async (req, res) => {
  const format = req.query.format;
  // console.log(`Fetching cards for format: ${format}`);

  if (!format) {
      console.error('Format is missing');
      return res.status(400).json({ message: 'Format is required' });
  }

  try {
      const setsToQuery = format.split(',');
      // console.log('Sets to query:', setsToQuery);

      const cardPromises = setsToQuery.map(async set => {
          // console.log(`Fetching cards for set: ${set}`);
          const collection = cardConnection.collection(set);
          if (!collection) {
              console.error(`Collection ${set} not found`);
              return [];
          }
          const cards = await collection.find({}).toArray();
          // console.log(`Fetched ${cards.length} cards for set: ${set}`);
          return cards;
      });

      const allCards = await Promise.all(cardPromises);
      const flattenedCards = allCards.flat();

      // console.log('Fetched cards:', flattenedCards.length);
      res.json(flattenedCards);
  } catch (err) {
      console.error('Error fetching cards:', err);
      res.status(500).json({ message: 'Failed to fetch cards' });
  }
});

app.get('/api/cards/searchbyname/:name', async (req, res) => {
  const cardName = decodeURIComponent(req.params.name);
  console.log(`Searching for card with name: ${cardName}`);
  try {
      // Use a case-insensitive search
      const cards = await Card.find({ name: new RegExp(`^${cardName}$`, 'i') });
      console.log(`Found ${cards.length} cards`);
      if (cards.length === 0) {
          return res.status(404).json({ message: `Card not found with name: ${cardName}` });
      }
      res.json(cards);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

// New route to get all players
app.get('/api/players', async (req, res) => {
  try {
    const players = await Player.find({});
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/players/:id', async (req, res) => {
  try {
    const playerId = decodeURIComponent(req.params.id);
    console.log('Received player ID:', playerId); // Add this line for logging
    const player = await Player.findOne({ id: playerId });
    if (player) {
      res.json(player);
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    console.error('Error fetching player:', error); // Add this line for error logging
    res.status(500).json({ message: error.message });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "./client/dist")));

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
