const express = require('express');
const path = require("path");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "./client/dist")));

const uri = process.env.MONGODB_URI;
const cardUri = process.env.CARD_MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err));

const eventConnection = mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const cardConnection = mongoose.createConnection(cardUri, { useNewUrlParser: true, useUnifiedTopology: true });

eventConnection.on('error', console.error.bind(console, 'MongoDB connection error for eventConnection:'));
eventConnection.once('open', () => {
  console.log('Connected to eventConnection');
});

cardConnection.on('error', console.error.bind(console, 'MongoDB connection error for cardConnection:'));
cardConnection.once('open', () => {
  console.log('Connected to cardConnection');
});

const orderedSets = [
  // sv
  "TWM", "TEF", "PAF", "PAR", "MEW", "OBF", "PAL", "SVI", "SVE", "PR-SV",
  // swsh
  "CRZ", "SIT", "LOR", "PGO", "ASR", "BRS", "FST", "CEL", "EVS", "CRE", "BST",
  "SHF", "VIV", "CPA", "DAA", "RCL", "SSH", "PR-SW",
  // sm
  "CEC", "HIF", "UNM", "UNB", "DPI", "TEU", "LOT", "DRM", "CES", "FLI", "UPR",
  "CIN", "SLG", "BUS", "GRI", "SUM", "PR-SM",
  // xy
  "EVO", "STS", "FCO", "GEN", "BKT", "AOR", "ROS", "DCE", "PRC", "PHF", "FFI",
  "FLF", "XY", "KSS", "PR-XY",
  // bw
  "LTR", "PLB", "PLF", "PLS", "BCR", "DRX", "DEX", "NXD", "NVI", "EPO", "BLW",
  "DRV", "PR-BLW",
  // hgss
  "CL", "TM", "UD", "UL", "HS", "RM", "PR-HS",
  // dp
  "AR", "SV", "RR", "P9", "PL", "SF", "P8", "LA", "MD", "P7", "GE", "SW", "P6",
  "MT", "DP", "P5", "PR-DP",
  // rs
  "PK", "DF", "CG", "P4", "HP", "P3", "TK2", "LM", "DS", "P2", "UF", "EM", "DX",
  "TRR", "P1", "FL", "HL", "TK1", "MA", "DR", "SS", "RS", "PR-EX",
  // wotc
  "SK", "AQ", "EX", "N4", "N3", "SI", "N2", "N1", "G2", "G1", "LC", "TR", "B2",
  "FO", "JU", "BS", "PR-BS",
];


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

const Event = eventConnection.model('Event', eventSchema);

app.get('/events/:id', async (req, res) => {
  console.log(req.params.id)
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

app.get('/api/cards', async (req, res) => {
  const format = req.query.format;
  console.log(`Fetching cards for format: ${format}`);

  if (!format) {
    return res.status(400).json({ message: 'Format is required' });
  }

  try {
    const [startSet, endSet] = format.split('-');
    const startIndex = orderedSets.indexOf(startSet);
    const endIndex = orderedSets.indexOf(endSet);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      return res.status(400).json({ message: 'Invalid format' });
    }

    const setsToQuery = orderedSets.slice(startIndex, endIndex + 1);
    console.log('Sets to query:', setsToQuery);

    const cardPromises = setsToQuery.map(async set => {
      const cards = await cardConnection.db.collection(set).find({}).toArray();
      return cards;
    });

    const allCards = await Promise.all(cardPromises);
    const flattenedCards = allCards.flat();

    console.log('Fetched cards:', flattenedCards.length);
    res.json(flattenedCards);
  } catch (err) {
    console.error('Error fetching cards:', err);
    res.status(500).json({ message: 'Failed to fetch cards' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World! The server is running.');
});

app.get("*", function (_, res) {
    res.sendFile(
      path.join(__dirname, "./client/dist/index.html"),
      function (err) {
        res.status(500).send(err);
      }
    );
  });

app.listen(port, () => console.log(`Server running on port ${port}`));
