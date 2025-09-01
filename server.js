const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const https = require('https');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let cachedCards = null;
let cachedNormalizedNames = null;

const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err));

const authConnection = mongoose.createConnection(
  USER_MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
authConnection.on('error', console.error.bind(console, 'Auth DB error:'));
authConnection.once('open', () => console.log('Connected to Auth DB'));

const eventConnection = mongoose.createConnection(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const cardConnection = mongoose.createConnection(CARD_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const playersConnection = mongoose.createConnection(PLAYERS_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const decksConnection = mongoose.createConnection(DECKS_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const decklistsDb = mongoose.createConnection(CARDSINDECKLISTS_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const emailsConnection = mongoose.createConnection(EMAILS_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

[eventConnection, cardConnection, playersConnection, decksConnection, emailsConnection]
  .forEach(conn => {
    conn.on('error', console.error.bind(console, `MongoDB connection error for ${conn.name}:`));
    conn.once('open', () => console.log(`Connected to ${conn.name}`));
  });

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  decks: [{
    name: { type: String, required: true },
    mascotCard: { type: String, required: true },
    secondaryMascotCard: { type: String, default: null },
    description: { type: String },
    decklist: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
    favorite: { type: Boolean, default: false }
  }],
  folders: [{
    name: { type: String, required: true },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    locked: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    color: { type: String, default: '#1290eb' }
  }]
});
const User = authConnection.model('User', userSchema, 'users');

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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  mascotCard: { type: String, required: true },
  secondaryMascotCard: { type: String, default: null },
  description: { type: String },
  decklist: { type: Object, required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
  createdAt: { type: Date, default: Date.now }
});
const UserDeck = authConnection.model('UserDeck', userDeckSchema, 'userdecks');

app.post('/api/auth/signup', async (req, res) => {
  const { email, password, username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const normalizedEmail = email.toLowerCase();

  try {
    const conflict = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { username }
      ]
    });
    if (conflict) {
      if (conflict.email === normalizedEmail) {
        return res.status(400).json({ error: 'Email already in use' });
      } else {
        return res.status(400).json({ error: 'Username already in use' });
      }
    }

    const passwordHash = await bcrypt.hash(password, Number(SALT_ROUNDS));
    const newUser = new User({ username, email, passwordHash });
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

app.post('/api/auth/login', async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) return res.status(400).json({ error: 'Identifier and password are required' });

  try {
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier }
      ]
    });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      username: user.username,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/user/decks', requireAuth, async (req, res) => {
  const { name, mascotCard, secondaryMascotCard, description, decklist } = req.body;
  try {
    const user = await User.findById(req.userId);
    user.decks.push({ name, mascotCard, secondaryMascotCard, description, decklist });
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save deck' });
  }
});
app.get('/api/user/decks', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('decks');
    res.json(user.decks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load decks' });
  }
});
app.patch('/api/user/decks/:deckId/favorite', requireAuth, async (req, res) => {
  const { deckId } = req.params;
  const { favorite } = req.body;
  try {
    await User.updateOne(
      { _id: req.userId, 'decks._id': deckId },
      { $set: { 'decks.$.favorite': favorite } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update favorite' });
  }
});
app.patch('/api/user/decks/:deckId/rename', requireAuth, async (req, res) => {
  const { deckId } = req.params;
  const { name } = req.body;
  try {
    await User.updateOne(
      { _id: req.userId, 'decks._id': deckId },
      { $set: { 'decks.$.name': name } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not rename deck' });
  }
});
app.patch('/api/user/decks/:deckId/description', requireAuth, async (req, res) => {
  const { deckId } = req.params;
  const { description } = req.body;
  try {
    await User.updateOne(
      { _id: req.userId, 'decks._id': deckId },
      { $set: { 'decks.$.description': description } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update description' });
  }
});
app.patch(
  '/api/user/decks/:deckId/mascots',
  requireAuth,
  async (req, res) => {
    const { mascotCard, secondaryMascotCard } = req.body;
    try {
      await User.updateOne(
        { _id: req.userId, 'decks._id': req.params.deckId },
        {
          $set: {
            'decks.$.mascotCard': mascotCard,
            'decks.$.secondaryMascotCard': secondaryMascotCard
          }
        }
      );
      const user = await User.findById(req.userId).select('decks');
      const deck = user.decks.id(req.params.deckId);
      res.json({ success: true, deck });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Could not update mascots' });
    }
  }
);
app.post('/api/user/decks/:deckId/duplicate', requireAuth, async (req, res) => {
  const { deckId } = req.params;
  try {
    const user = await User.findById(req.userId);
    const original = user.decks.id(deckId);
    if (!original) return res.status(404).json({ error: 'Deck not found' });
    const base = original.name.replace(/\s\(\d+\)$/, '');
    const siblings = user.decks.filter(d => d.name.startsWith(base));
    const copyCount = siblings.length;
    const newName = `${base} (${copyCount})`;
    user.decks.push({
      name: newName,
      mascotCard: original.mascotCard,
      secondaryMascotCard: original.secondaryMascotCard,
      description: original.description,
      decklist: original.decklist
    });
    await user.save();
    res.json({ success: true, deck: user.decks[user.decks.length - 1] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not duplicate deck' });
  }
});
app.delete('/api/user/decks/:deckId', requireAuth, async (req, res) => {
  const { deckId } = req.params;
  try {
    await User.updateOne(
      { _id: req.userId },
      { $pull: { decks: { _id: deckId } } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete deck' });
  }
});
app.put('/api/user/decks/:deckId', requireAuth, async (req, res) => {
  const { name, mascotCard, secondaryMascotCard, description, decklist } = req.body;
  try {
    const user = await User.findById(req.userId);
    const deck = user.decks.id(req.params.deckId);
    if (!deck) return res.status(404).json({ error: 'Deck not found' });
    deck.name = name;
    deck.mascotCard = mascotCard;
    deck.secondaryMascotCard = secondaryMascotCard;
    deck.description = description;
    deck.decklist = decklist;
    deck.createdAt = Date.now();
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update deck' });
  }
});
userDeckSchema.add({
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null }
});
app.get('/api/user/folders', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('folders');
    res.json(user.folders.sort((a, b) => a.order - b.order));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load folders' });
  }
});
app.post('/api/user/folders', requireAuth, async (req, res) => {
  const { name, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const user = await User.findById(req.userId);
    const nextOrder = user.folders.length;
    user.folders.push({
      name,
      order: nextOrder,
      color: color || undefined
    });
    await user.save();
    res.json(user.folders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create folder' });
  }
});
app.patch('/api/user/folders/sort', requireAuth, async (req, res) => {
  // pull both order *and* locked from the client
  const { order = [], locked = [] } = req.body;

  try {
    const user = await User.findById(req.userId);
    // build a quick lookup by folder ID
    const byId = user.folders.reduce((map, f) => {
      map[f._id] = f;
      return map;
    }, {});

    // update each folder’s order AND locked flag
    order.forEach((fid, idx) => {
      const f = byId[fid];
      if (f) {
        f.order = idx;
        f.locked = locked.includes(fid);
      }
    });

    // re‑sort the array in memory for the response
    user.folders.sort((a, b) => a.order - b.order);

    await user.save();
    res.json(user.folders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not reorder folders' });
  }
});
app.patch('/api/user/folders/:id', requireAuth, async (req, res) => {
  const { name, color } = req.body;
  try {
    const user = await User.findById(req.userId);
    const folder = user.folders.id(req.params.id);
    if (!folder) return res.status(404).json({ error: 'Folder not found' });
    folder.name = name;
    if (color !== undefined) {
      folder.color = color;
    }
    await user.save();
    res.json(user.folders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not rename folder' });
  }
});
app.patch('/api/user/decks/:deckId/move', requireAuth, async (req, res) => {
  const { folderId } = req.body;
  try {
    const user = await User.findById(req.userId);
    const deck = user.decks.id(req.params.deckId);
    if (!deck) return res.status(404).json({ error: 'Deck not found' });
    deck.folderId = folderId;
    await user.save();
    res.json({ deck });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not move deck' });
  }
});
// app.get('/api/user/decks/:deckId', requireAuth, async (req, res) => {
//     try {
//       const user = await User.findById(req.userId);
//       const deck = user.decks.id(req.params.deckId);
//       if (!deck) {
//         return res.status(404).json({ error: 'Deck not found' });
//       }
//       res.json(deck);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Could not load deck' });
//     }
//   }
// );
app.delete('/api/user/folders/:folderId', requireAuth, async (req, res) => {
  const { folderId } = req.params;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // remove the folder
    user.folders = user.folders.filter(f => f._id.toString() !== folderId);

    // un‐assign it from any decks
    user.decks.forEach(deck => {
      if (deck.folderId?.toString() === folderId) {
        deck.folderId = undefined;
      }
    });

    await user.save();

    // return the updated folders array
    res.json({ folders: user.folders });
  } catch (err) {
    console.error('Error deleting folder:', err);
    res.status(500).json({ error: 'Could not delete folder' });
  }
});
app.patch('/api/user/decks/:id/move', requireAuth, async (req, res) => {
  const { folderId } = req.body;
  try {
    const deck = await UserDeck.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { folderId },
      { new: true }
    );
    if (!deck) return res.status(404).json({ error: 'Deck not found' });
    res.json({ deck });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not move deck' });
  }
});
app.patch('/api/user/profile', requireAuth, async (req, res) => {
  const { username, email } = req.body;
  if (!username && !email) {
    return res.status(400).json({ error: 'Nothing to update' });
  }
  try {
    const user = await User.findById(req.userId);
    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();
    res.json({ username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update profile' });
  }
});
app.patch('/api/auth/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new passwords required' });
  }
  try {
    const user = await User.findById(req.userId);
    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Current password incorrect' });
    }
    user.passwordHash = await bcrypt.hash(newPassword, Number(SALT_ROUNDS));
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not change password' });
  }
});
app.post('/api/auth/forgot-password', async (req, res) => {
  const { identifier } = req.body; // can be email or username
  if (!identifier) {
    return res.status(400).json({ error: 'Please provide your email or username.' });
  }

  try {
    // find by email OR username
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier }
      ]
    });
    if (!user) {
      // don’t leak which one exists
      return res.status(200).json({ message: 'If that account exists, you’ll get an email shortly.' });
    }

    // generate a random temporary password
    const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 chars
    const hash = await bcrypt.hash(tempPassword, Number(SALT_ROUNDS));
    user.passwordHash = hash;
    await user.save();

    // send the email
    await transporter.sendMail({
      from: '"PTCGLegends Support" <ptcglegends@gmail.com>',
      to: user.email,
      subject: 'Your PTCGLegends Temporary Password',
      text: `Hi ${user.username},\n\n` +
        `We’ve reset your password as requested. Your temporary password is:\n\n` +
        `    ${tempPassword}\n\n` +
        `Please log in using this password. Then in your profile, choose “Change Password” to set a new one of your own.\n\n` +
        `Keep this email until you've succesfully changed your password.\n\n` +
        `~ PTCGLegends`
    });

    res.json({ message: 'If that account exists, you’ll get an email shortly.' });
  } catch (err) {
    console.error('Forgot-password error:', err);
    res.status(500).json({ error: 'Could not process that request' });
  }
});
app.patch('/api/user/folders/:id/public', requireAuth, async (req, res) => {
  const { isPublic } = req.body;
  try {
    const user = await User.findById(req.userId);
    const folder = user.folders.id(req.params.id);
    if (!folder) return res.status(404).json({ error: 'Folder not found' });
    folder.isPublic = Boolean(isPublic);
    await user.save();
    res.json({ folders: user.folders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update folder visibility' });
  }
});
app.get('/api/public/:username/deck-collection', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('decks folders');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // collect IDs of public folders
    const publicFolderIds = user.folders
      .filter(f => f.isPublic)
      .map(f => f._id.toString());

    // filter decks in those folders
    const publicDecks = user.decks
      .filter(d => d.folderId && publicFolderIds.includes(d.folderId.toString()));

    res.json({
      folders: user.folders.filter(f => f.isPublic),
      decks: publicDecks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load public collection' });
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

// let standingsCache = null;
// let cacheTimestamp = null;
// const cacheDuration = 5 * 60 * 1000; // 5 minutes

// const fetchStandings = () => {
//   const eventUrl = 'https://pokedata.ovh/standings/0000128/masters/0000128_Masters.json';
//   console.log('Fetching live standings from:', eventUrl);

//   https.get(eventUrl, (response) => {
//     let data = '';

//     response.on('data', (chunk) => {
//       data += chunk;
//     });

//     response.on('end', () => {
//       try {
//         const parsedData = JSON.parse(data);
//         standingsCache = parsedData;
//         cacheTimestamp = Date.now();
//         console.log('Successfully fetched and cached standings data.');
//       } catch (error) {
//         console.error('Error parsing JSON:', error.message);
//       }
//     });

//   }).on('error', (error) => {
//     console.error('Error fetching live standings:', error.message);
//   });
// };

// // Initial fetch to populate cache
// fetchStandings();

// // Regular interval fetch to refresh cache
// setInterval(fetchStandings, cacheDuration);

// app.get('/api/live-standings', (req, res) => {
//   const { eventId, isEventCompleted, finalDataUrl } = req.query;

//   let urlToFetch;
//   if (isEventCompleted === 'true' && finalDataUrl) {
//     urlToFetch = finalDataUrl;  // Use the final data URL if the event is completed
//   } else if (isEventCompleted === 'false') {
//     urlToFetch = 'https://pokedata.ovh/standings/0000129/masters/0000129_Masters.json';  // Replace with actual live URL
//   } else {
//     return res.status(400).json({ error: 'No valid URL available for fetching standings.' });
//   }

//   console.log('Fetching live standings from:', urlToFetch);

//   https.get(urlToFetch, (response) => {
//     let data = '';

//     response.on('data', (chunk) => {
//       data += chunk;
//     });

//     response.on('end', () => {
//       try {
//         const parsedData = JSON.parse(data);
//         res.json(parsedData);
//       } catch (error) {
//         console.error('Error parsing JSON:', error.message);
//         res.status(500).json({ error: 'Error parsing JSON or no data received' });
//       }
//     });

//   }).on('error', (error) => {
//     console.error('Error fetching live standings:', error.message);
//     res.status(500).json({ error: 'Error fetching live standings: ' + error.message });
//   });
// });

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
  const rawQ = (req.params.name || '').trim();
  const q = rawQ
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();

  try {
    const collection = cardConnection.collection('card-database');
    if (!cachedCards) {
      const cards = await collection.find().toArray();
      cachedCards = cards;
      cachedNormalizedNames = cards.map(c => ({
        raw: c,
        norm: c.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '')
          .toLowerCase()
      }));
    }

    const matches = cachedNormalizedNames
      .filter(({ norm }) => norm.includes(q))
      .map(({ raw }) => raw);
    return res.json(matches);
  } catch (err) {
    console.error('Error searching cards:', err);
    return res.status(500).json({ error: 'Server error occurred' });
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

app.get('/api/cards/searchbytext/partial/:q', async (req, res) => {
  try {
    const qRaw = (req.params.q || '').trim();
    if (!qRaw) return res.json([]);

    const norm = qRaw
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    const tokens = norm.match(/[a-z0-9]+/g) || [];

    if (tokens.length === 0) return res.json([]);

    const DIA = {
      a: '[aàáâãäåāăą]',
      c: '[cçćč]',
      e: '[eèéêëēĕėęě]',
      i: '[iìíîïĩīĭįı]',
      n: '[nñńň]',
      o: '[oòóôõöōŏőøơ]',
      u: '[uùúûüũūŭůűųư]',
      y: '[yýÿŷ]',
      s: '[sśš]',
      z: '[zżźž]',
      l: '[lł]',
      d: '[dď]',
      r: '[rř]',
      t: '[tť]',
    };

    const charClass = (ch) => {
      const base = ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      return DIA[base] || escapeRegex(ch.toLowerCase());
    };

    const toPattern = (q) => {
      const tokens = (q || '')
        .toLowerCase()
        .match(/[a-z0-9]+/g) || [];
      if (tokens.length === 0) return null;

      const tokenPatterns = tokens.map(tok =>
        tok.split('').map(charClass).join('')
      );
      return new RegExp(tokenPatterns.join('[\\s\\S]*?'), 'i');
    };

    const rx = toPattern(qRaw);
    if (!rx) return res.json([]);

    const cards = cardConnection.collection('card-database');

    const cursor = cards.find(
      {
        $or: [
          { name: rx },
          { text: rx },
          { rules: rx },
          { flavorText: rx },
          { 'attacks.name': rx },
          { 'attacks.text': rx },
          { 'abilities.name': rx },
          { 'abilities.text': rx },
          { 'ability.name': rx },
          { 'ability.text': rx }
        ]
      },
      {
        projection: {
          _id: 0,
          id: 1, name: 1, supertype: 1, subtypes: 1, setAbbrev: 1, number: 1, images: 1,
          attacks: 1, abilities: 1, ability: 1, text: 1, rules: 1, flavorText: 1,
          types: 1,
          hp: 1,
          weaknesses: 1,
          resistances: 1,
          retreatCost: 1,
          convertedRetreatCost: 1,
          set: 1,
          rarity: 1,
          tcgplayer: 1
        }
      }
    )
      .limit(200);

    const results = await cursor.toArray();
    res.json(results);
  } catch (e) {
    console.error('searchbytext/partial error:', e);
    res.status(500).json({ error: 'text search failed' });
  }
});

app.post('/api/cards/filter-search', async (req, res) => {
  try {
    const { filters = {} } = req.body || {};
    const {
      supertypes = {},  // e.g., { 'Pokémon': true, Trainer: false, Energy: false }
      sets = {},        // e.g., { SV4: true, SV1: true }
      eras = {},        // e.g., { SV1: true, SSH1: false, ... }
      mechanics = {},   // e.g., { ex: true, v: true, 'ace spec': false, ... }
      pokeTypes = {},   // e.g., { grass: true, fire: true, ... }
    } = filters;

    const cards = cardConnection.collection('card-database');

    const and = [];

    const setAllowList = [];
    const setsChecked = Object.values(sets || {}).some(Boolean);

    if (setsChecked) {
      for (const [code, on] of Object.entries(sets || {})) {
        if (on) setAllowList.push(code);
      }
    } else {
      const ERA_TO_SET_CODES = {
        SV1: [
          "BLK",
          "WHT",
          "DRI",
          "JTG",
          "PRE",
          "SSP",
          "SCR",
          "SFA",
          "TWM",
          "TEF",
          "PAF",
          "PAR",
          "MEW",
          "OBF",
          "PAL",
          "SVE",
          "SVI",
          "PR-SV"
        ],
        SSH1: [
          "CRZ",
          "SIT",
          "LOR",
          "PGO",
          "ASR",
          "BRS",
          "FST",
          "CEL",
          "EVS",
          "CRE",
          "BST",
          "SHF",
          "VIV",
          "CPA",
          "DAA",
          "RCL",
          "SSH",
          "PR-SW"
        ],
        SM1: [
          "CEC",
          "HIF",
          "UNM",
          "UNB",
          "DPI",
          "TEU",
          "LOT",
          "DRM",
          "CES",
          "FLI",
          "UPR",
          "CIN",
          "SLG",
          "BUS",
          "GRI",
          "SUM",
          "PR-SM"
        ],
        XY1: [
          "EVO",
          "STS",
          "FCO",
          "GEN",
          "BKP",
          "BKT",
          "AOR",
          "ROS",
          "DCE",
          "PRC",
          "PHF",
          "FFI",
          "FLF",
          "XY",
          "KSS",
          "PR-XY"
        ],
        BW1: [
          "LTR",
          "PLB",
          "PLF",
          "PLS",
          "BCR",
          "DRX",
          "DEX",
          "NXD",
          "NVI",
          "EPO",
          "BLW",
          "DRV",
          "PR-BLW"
        ],
        HGSS1: [
          "CL",
          "TM",
          "UD",
          "UL",
          "HS",
          "RM",
          "PR-HS"
        ],
        DP1: [
          "AR",
          "SV",
          "RR",
          "P9",
          "PL",
          "SF",
          "P8",
          "LA",
          "MD",
          "P7",
          "GE",
          "SW",
          "P6",
          "MT",
          "DP",
          "P5",
          "PR-DP"
        ],
        RS1: [
          "PK",
          "DF",
          "CG",
          "P4",
          "HP",
          "P3",
          "TK2",
          "LM",
          "DS",
          "P2",
          "UF",
          "EM",
          "DX",
          "TRR",
          "P1",
          "FL",
          "HL",
          "TK1",
          "MA",
          "DR",
          "SS",
          "RS",
          "PR-EX"
        ],
        WOTC: [
          "SK",
          "AQ",
          "EX",
          "N4",
          "N3",
          "SI",
          "N2",
          "N1",
          "G2",
          "G1",
          "LC",
          "TR",
          "B2",
          "FO",
          "JU",
          "BS",
          "PR-BS"
        ]
      };

      const selectedEras = Object.entries(eras || {})
        .filter(([, on]) => !!on)
        .map(([k]) => k);

      if (selectedEras.length) {
        for (const eraKey of selectedEras) {
          const codes = ERA_TO_SET_CODES[eraKey];
          if (Array.isArray(codes)) setAllowList.push(...codes);
        }
      }
    }

    if (setAllowList.length) {
      and.push({ setAbbrev: { $in: setAllowList } });
    }

    const superOnAll = Object.entries(supertypes || {})
      .filter(([, on]) => !!on)
      .map(([k]) => k);

    const TRUE_SUPERTYPES = new Set(['Pokémon', 'Trainer', 'Energy', 'Pokemon']);
    const validSuper = superOnAll
      .map(s => (String(s).toLowerCase().startsWith('pok') ? 'Pokémon' : s))
      .filter(s => TRUE_SUPERTYPES.has(s));

    if (validSuper.length) {
      and.push({ supertype: { $in: validSuper } });
    }

    const detailKeys = new Set(
      Object.entries(supertypes || {})
        .filter(([, on]) => !!on)
        .map(([k]) => String(k))
    );

    const trainerSubtypeOr = [];
    if (detailKeys.has('Item')) {
      trainerSubtypeOr.push({ subtypes: { $elemMatch: { $regex: /^item$/i } } });
    }
    if (detailKeys.has('Supporter')) {
      trainerSubtypeOr.push({ subtypes: { $elemMatch: { $regex: /^supporter$/i } } });
    }
    if (detailKeys.has('Stadium')) {
      trainerSubtypeOr.push({ subtypes: { $elemMatch: { $regex: /^stadium$/i } } });
    }
    if (detailKeys.has('Tool')) {
      trainerSubtypeOr.push({ subtypes: { $elemMatch: { $regex: /^pokémon tool$/i } } });
    }
    if (trainerSubtypeOr.length) {
      and.push({ supertype: 'Trainer' });
      and.push({ $or: trainerSubtypeOr });
    }

    const energySubtypeOr = [];
    if (detailKeys.has('Basic')) {
      energySubtypeOr.push({ subtypes: { $elemMatch: { $regex: /^basic$/i } } });
    }
    if (detailKeys.has('Special')) {
      energySubtypeOr.push({ subtypes: { $elemMatch: { $regex: /^special$/i } } });
    }
    if (energySubtypeOr.length) {
      and.push({ supertype: 'Energy' });
      and.push({ $or: energySubtypeOr });
    }
    const hp = (filters.hp || {});
    if (hp && typeof hp === 'object') {
      const op = String(hp.op || 'eq').toLowerCase();
      const val = Number(hp.value);
      if (Number.isFinite(val)) {
        if (op === 'eq') {
          and.push({ hp: String(val) });
        } else {
          const map = { gt: '$gt', lt: '$lt', ge: '$gte', le: '$lte' };
          const mongoOp = map[op];
          if (mongoOp) {
            and.push({ $expr: { [mongoOp]: [{ $toInt: '$hp' }, val] } });
          }
        }
      }
    }
    const hpVal = Number(hp.value);
    if (Number.isFinite(hpVal)) {
      and.push({ supertype: { $regex: /^(Pokémon|Pokemon)$/i } });

      const hpExpr = { $toInt: { $ifNull: ['$hp', '0'] } };
      switch ((hp.op || 'eq')) {
        case 'gt': and.push({ $expr: { $gt: [hpExpr, hpVal] } }); break;
        case 'lt': and.push({ $expr: { $lt: [hpExpr, hpVal] } }); break;
        case 'ge': and.push({ $expr: { $gte: [hpExpr, hpVal] } }); break;
        case 'le': and.push({ $expr: { $lte: [hpExpr, hpVal] } }); break;
        case 'eq':
        default: and.push({ $expr: { $eq: [hpExpr, hpVal] } }); break;
      }
    }

    const mechOn = Object.entries(mechanics || {}).filter(([, on]) => !!on).map(([k]) => k);
    if (mechOn.length) {
      const mechOr = [];
      for (const m of mechOn) {
        switch (m) {
          case 'ex':
            mechOr.push({ subtypes: /ex/i });
            break;
          case 'v':
            mechOr.push({ subtypes: /v($|[^a-z])/i });
            mechOr.push({ subtypes: /vmax/i });
            mechOr.push({ subtypes: /vstar/i });
            mechOr.push({ subtypes: /v[-\s]?union/i });
            break;
          case 'gx':
            mechOr.push({ subtypes: /gx/i });
            break;
          case 'ace spec':
            mechOr.push({ subtypes: /ace spec/i }, { rules: /ace spec/i });
            break;
          case 'prism':
            mechOr.push({ subtypes: /prism star/i }, { name: /[♢◆]/ }, { rules: /prism star/i });
            break;
          case 'star':
            mechOr.push({ subtypes: /star/i }, { name: /★/ }, { rules: /gold star/i });
            break;

          // --- “Show more” mechanics:
          case 'fusion strike':
            mechOr.push({ subtypes: /fusion strike/i }, { rules: /fusion strike/i });
            break;
          case 'rapid strike':
            mechOr.push({ subtypes: /rapid strike/i }, { rules: /rapid strike/i });
            break;
          case 'single strike':
            mechOr.push({ subtypes: /single strike/i }, { rules: /single strike/i });
            break;
          case 'mega':
            mechOr.push({ subtypes: /mega/i }, { name: /^m\s/i });
            break;
          case 'ancient trait':
            mechOr.push(
              { ancientTrait: { $exists: true } },
              { ancienttrait: { $exists: true } }
            );
            break;
          case 'legend':
            mechOr.push({ subtypes: /legend/i }, { name: /\blegend\b/i });
            break;
          case 'delta species':
            mechOr.push({ subtypes: /delta species/i }, { name: /δ/ }, { rules: /delta species/i });
            break;
          default:
            break;
        }
      }
      if (mechOr.length) and.push({ $or: mechOr });
    }

    const pokeOn = Object.entries(pokeTypes).filter(([, on]) => !!on).map(([k]) => k);
    if (pokeOn.length) {
      and.push({ types: { $elemMatch: { $in: pokeOn.map(s => new RegExp(`^${s}$`, 'i')) } } });
      and.push({ supertype: 'Pokémon' });
    }

    const mongoQuery = and.length ? { $and: and } : {};

    const projection = {
      _id: 0,
      id: 1, name: 1, supertype: 1, subtypes: 1, setAbbrev: 1, number: 1, images: 1,
      attacks: 1, abilities: 1, ability: 1, text: 1, rules: 1, flavorText: 1,
      types: 1, hp: 1, weaknesses: 1, resistances: 1, retreatCost: 1, convertedRetreatCost: 1,
      set: 1, rarity: 1, tcgplayer: 1, ancientTrait: 1, ancienttrait: 1
    };

    const found = await cards.find(mongoQuery, { projection }).toArray();
    found.sort((a, b) => (parseInt(a.number, 10) || 0) - (parseInt(b.number, 10) || 0));

    res.json(found);
  } catch (err) {
    console.error('filter-search error:', err);
    res.status(500).json({ error: 'filter search failed' });
  }
});

app.get('/api/sets/logos', async (req, res) => {
  try {
    const cards = cardConnection.collection('card-database');
    const cursor = cards.aggregate([
      { $match: { 'set.images.logo': { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$setAbbrev',
          logo: { $first: '$set.images.logo' },
          name: { $first: '$set.name' },
          series: { $first: '$set.series' },
        }
      },
      {
        $project: {
          _id: 0,
          abbrev: '$_id',
          name: 1,
          series: 1,
          logo: 1
        }
      }
    ], { allowDiskUse: true });

    const list = await cursor.toArray();
    res.json(list);
  } catch (e) {
    console.error('Error /api/sets/logos:', e);
    res.status(500).json([]);
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

    set = set.toUpperCase();
    number = String(number);

    const collection = decklistsDb.collection('cardDecklists');
    const idKey = `${set}-${number}`;
    console.log(`[cardDecklists] lookup by _id: ${idKey}`);

    let doc = await collection.findOne({ _id: idKey });

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
