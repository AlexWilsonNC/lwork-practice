const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
require('dotenv').config();
const https = require('https');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const {
  MONGODB_URI,
  CARD_MONGODB_URI,
  PLAYERS_MONGODB_URI,
  DECKS_MONGODB_URI,
  EMAILS_MONGODB_URI,
  CARDSINDECKLISTS_MONGODB_URI,
  JWT_SECRET,
  SALT_ROUNDS = 10,
  USER_MONGODB_URI
} = process.env;

// ─── Connect to MongoDB ────────────────────────────────────────────────────────
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err));

const authConnection = mongoose.createConnection(
  USER_MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
authConnection.on('error', console.error.bind(console, 'Auth DB error:'));
authConnection.once('open', () => console.log('Connected to Auth DB'));

const eventConnection     = mongoose.createConnection(MONGODB_URI,            { useNewUrlParser: true, useUnifiedTopology: true });
const cardConnection      = mongoose.createConnection(CARD_MONGODB_URI,       { useNewUrlParser: true, useUnifiedTopology: true });
const playersConnection   = mongoose.createConnection(PLAYERS_MONGODB_URI,    { useNewUrlParser: true, useUnifiedTopology: true });
const decksConnection     = mongoose.createConnection(DECKS_MONGODB_URI,      { useNewUrlParser: true, useUnifiedTopology: true });
const decklistsDb         = mongoose.createConnection(CARDSINDECKLISTS_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const emailsConnection    = mongoose.createConnection(EMAILS_MONGODB_URI,     { useNewUrlParser: true, useUnifiedTopology: true });

[eventConnection, cardConnection, playersConnection, decksConnection, emailsConnection]
  .forEach(conn => {
    conn.on('error', console.error.bind(console, `MongoDB connection error for ${conn.name}:`));
    conn.once('open', () => console.log(`Connected to ${conn.name}`));
  });

  const userSchema = new mongoose.Schema({
    email:        { type: String, unique: true, required: true },
    passwordHash: { type: String,             required: true },
    decks: [{
      name:        { type: String, required: true },
      mascotCard:  { type: String, required: true },
      description: { type: String },
      decklist:    { type: Object, required: true },
      createdAt:   { type: Date,   default: Date.now }
    }]
});
const User = authConnection.model('User', userSchema, 'users');

// Auth middleware
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }
  const token = auth.split(' ')[1];
  try {
    const { sub } = jwt.verify(token, JWT_SECRET);
    req.userId = sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

const userDeckSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:         { type: String, required: true },
  mascotCard:       { type: String, required: true },       // e.g. “Pikachu #025”
  description:  { type: String },
  decklist:     { type: Object, required: true },       // the actual decklist JSON
  createdAt:    { type: Date, default: Date.now }
});
const UserDeck = authConnection.model('UserDeck', userDeckSchema, 'userdecks');

// Signup
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const passwordHash = await bcrypt.hash(password, Number(SALT_ROUNDS));
    const newUser = new User({ email, passwordHash });
    await newUser.save();

    const token = jwt.sign({ sub: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Email already in use' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/user/decks', requireAuth, async (req, res) => {
  const { name, mascotCard, description, decklist } = req.body;
  try {
    const user = await User.findById(req.userId);
    user.decks.push({ name, mascotCard, description, decklist });
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save deck' });
  }
});

// 3) GET /api/user/decks — list all decks for the logged‑in user
app.get('/api/user/decks', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('decks');
    res.json(user.decks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load decks' });
  }
});

// Define the schema for emails
const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  dateSubscribed: { type: Date, default: Date.now }
});

// Create the model for emails
const EmailSubscription = emailsConnection.model('EmailSubscription', emailSchema, 'emails');

// POST route for subscribing emails
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    // Save email to MongoDB
    const newEmail = new EmailSubscription({ email });
    await newEmail.save();
    console.log(`Successfully subscribed email: ${email}`);
    res.status(200).json({ success: true, message: 'Subscription successful' });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate email error
      res.status(400).json({ success: false, message: 'Email is already subscribed' });
    } else {
      console.error('Error saving email subscription:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
});


let standingsCache = null;
let cacheTimestamp = null;
const cacheDuration = 5 * 60 * 1000; // 5 minutes

const fetchStandings = () => {
  const eventUrl = 'https://pokedata.ovh/standings/0000128/masters/0000128_Masters.json';
  console.log('Fetching live standings from:', eventUrl);

  https.get(eventUrl, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        standingsCache = parsedData;
        cacheTimestamp = Date.now();
        console.log('Successfully fetched and cached standings data.');
      } catch (error) {
        console.error('Error parsing JSON:', error.message);
      }
    });

  }).on('error', (error) => {
    console.error('Error fetching live standings:', error.message);
  });
};

// Initial fetch to populate cache
fetchStandings();

// Regular interval fetch to refresh cache
setInterval(fetchStandings, cacheDuration);

app.get('/api/live-standings', (req, res) => {
  const { eventId, isEventCompleted, finalDataUrl } = req.query;

  let urlToFetch;
  if (isEventCompleted === 'true' && finalDataUrl) {
      urlToFetch = finalDataUrl;  // Use the final data URL if the event is completed
  } else if (isEventCompleted === 'false') {
      urlToFetch = 'https://pokedata.ovh/standings/0000129/masters/0000129_Masters.json';  // Replace with actual live URL
  } else {
      return res.status(400).json({ error: 'No valid URL available for fetching standings.' });
  }

  console.log('Fetching live standings from:', urlToFetch);

  https.get(urlToFetch, (response) => {
      let data = '';

      response.on('data', (chunk) => {
          data += chunk;
      });

      response.on('end', () => {
          try {
              const parsedData = JSON.parse(data);
              res.json(parsedData);
          } catch (error) {
              console.error('Error parsing JSON:', error.message);
              res.status(500).json({ error: 'Error parsing JSON or no data received' });
          }
      });

  }).on('error', (error) => {
      console.error('Error fetching live standings:', error.message);
      res.status(500).json({ error: 'Error fetching live standings: ' + error.message });
  });
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

app.get('/api/cards/searchbyname/partial/:name', async (req, res) => {
  let cardName = req.params.name.trim().toLowerCase();
  console.log(`Searching for cards with names containing: ${cardName}`);
  
  try {
      const collection = cardConnection.collection('card-database');

      // Normalize the search query by removing non-alphanumeric characters
      const normalizedCardName = cardName.replace(/[^a-z0-9]/gi, '');

      // Use a regular expression to match normalized card names
      const cards = await collection.find({
          name: {
              $regex: new RegExp(normalizedCardName.split("").join("[^a-z0-9]*"), 'i')
          }
      }).toArray();

      if (cards.length === 0) {
          return res.status(404).json({ message: `No cards found containing: ${cardName}` });
      }

      console.log(`Found ${cards.length} cards containing name: ${cardName}`);
      res.json(cards);
  } catch (error) {
      console.error('Error occurred while searching for cards:', error);
      res.status(500).json({ message: 'Server error occurred' });
  }
});

app.get('/api/cards/searchbyname/:name', async (req, res) => {
  const cardName = req.params.name.trim();
  console.log(`Searching for card with name: ${cardName}`);
  try {
    const collection = cardConnection.collection('card-database');
      const cards = await collection.find({ name: cardName }).toArray();      
      if (cards.length === 0) {
          return res.status(404).json({ message: `Card not found with name: ${cardName}` });
      }

      console.log(`Found ${cards.length} cards for name: ${cardName}`);
      res.json(cards);
  } catch (error) {
      console.error('Error occurred while searching for card:', error);
      res.status(500).json({ message: 'card name', cardName });
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

app.get('/api/decks/:label', async (req, res) => {
  try {
    const label = req.params.label.replace(/-/g, ' ').toLowerCase();
    const decks = await Deck.find({ label: new RegExp(`^${label}$`, 'i') });
    if (!decks || decks.length === 0) {
      return res.status(404).json({ message: 'No decks found for the given label' });
    }
    res.json(decks);
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/cardDecklists', async (req, res) => {
  try {
    let { set, number } = req.query;
    if (!set || !number) {
      return res.status(400).json({ error: 'Missing set or number parameter' });
    }

    // Always upper-case the set code
    set = set.toUpperCase();
    number = String(number);

    const collection = decklistsDb.collection('cardDecklists');
    const idKey = `${set}-${number}`;
    console.log(`[cardDecklists] lookup by _id: ${idKey}`);

    // 1) Try the document _id first
    let doc = await collection.findOne({ _id: idKey });

    // 2) Fallback: match on fields if that failed
    if (!doc) {
      console.log(`[cardDecklists] _id miss, trying {set,number}`);
      doc = await collection.findOne({ set, number });
    }

    const occ = (doc && doc.occurrences) || [];
    console.log(`[cardDecklists] found ${occ.length} occurrences for ${set}-${number}`);
    return res.json({ occurrences: occ });
  } catch (err) {
    console.error('Error in /api/cardDecklists:', err);
    return res.status(500).json({ error: 'Server error fetching card decklists' });
  }
});

app.use(express.static(path.join(__dirname, "./client/dist")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
