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
const playersUri = process.env.PLAYERS_MONGODB_URI;
const decksUri = process.env.DECKS_MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err));

const eventConnection = mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const cardConnection = mongoose.createConnection(cardUri, { useNewUrlParser: true, useUnifiedTopology: true });
const playersConnection = mongoose.createConnection(playersUri, { useNewUrlParser: true, useUnifiedTopology: true });
const decksConnection = mongoose.createConnection(decksUri, { useNewUrlParser: true, useUnifiedTopology: true });

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
  // console.log('Connected to playersConnection');
});
decksConnection.on('error', console.error.bind(console, 'MongoDB connection error for decksConnection:'));
decksConnection.once('open', () => {
  console.log('Connected to decksConnection');
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

const deckSchema = new mongoose.Schema({
  label: String,
  year: String,
  decks: [{
    playerId: String,
    playerName: String,
    eventId: String,
    eventName: String,
    eventDate: String,
    division: String,
    placement: Number,
    decklist: Object,
    sprite1: String,
    sprite2: String,
    format: String,
  }]
});

const Event = eventConnection.model('Event', eventSchema);
const Player = playersConnection.model('Player', playerSchema);
const Deck = decksConnection.model('Deck', deckSchema);

app.get('/events/:id', async (req, res) => {
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

  try {
    const collection = cardConnection.collection(set);
    if (!collection) {
      console.error(`Collection ${set} not found`);
      return res.status(404).json({ message: `Collection ${set} not found` });
    }

    const card = await collection.findOne({ number: String(number) });
    if (card) {
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

  if (!format) {
      console.error('Format is missing');
      return res.status(400).json({ message: 'Format is required' });
  }

  try {
      const setsToQuery = format.split(',');

      const cardPromises = setsToQuery.map(async set => {
          const collection = cardConnection.collection(set);
          if (!collection) {
              console.error(`Collection ${set} not found`);
              return [];
          }
          const cards = await collection.find({}).toArray();
          return cards;
      });

      const allCards = await Promise.all(cardPromises);
      const flattenedCards = allCards.flat();

      res.json(flattenedCards);
  } catch (err) {
      res.status(500).json({ message: 'Failed to fetch cards' });
  }
});

app.get('/api/cards/searchbyname/:name', async (req, res) => {
  const cardName = req.params.name.trim();
  console.log(`Searching for card with name: ${cardName}`);
  try {
      const regex = new RegExp(`^${cardName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
      const cards = await client.db('legends-cluster').collection('card-database').find({ name: regex }).toArray();

      if (cards.length === 0) {
          console.log(`No cards found for name: ${cardName}`);
          return res.status(404).json({ message: `Card not found with name: ${cardName}` });
      }

      console.log(`Found ${cards.length} cards for name: ${cardName}`);
      res.json(cards);
  } catch (error) {
      console.error('Error occurred while searching for card:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

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
    console.log('Received player ID:', playerId);
    const player = await Player.findOne({ id: playerId });
    if (player) {
      res.json(player);
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/decks', async (req, res) => {
  try {
    const decks = await Deck.find({});
    res.json(decks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/decks/:id', async (req, res) => {
  try {
    const deckId = req.params.id;
    console.log('Received deck ID:', deckId);
    const deck = await Deck.findById(deckId);
    if (deck) {
      res.json(deck);
    } else {
      res.status(404).json({ message: 'Deck not found' });
    }
  } catch (error) {
    console.error('Error fetching deck:', error);
    res.status(500).json({ message: error.message });
  }
});

app.use(express.static(path.join(__dirname, "./client/dist")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
