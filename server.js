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
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// const Event = mongoose.model('Event', eventSchema);

// app.get('/events/:id', async (req, res) => {
//   console.log(req.params.id)
//   try {
//     const event = await Event.findOne({ id: req.params.id });
//     if (event) {
//       res.json(event);
//     } else {
//       res.status(404).send('Event not found');
//     }
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

app.get('/events/:id', async (req, res) => {
    res.send({hi:"hello"})
})

// app.get('/event-ids', async (req, res) => {
//   try {
//     const events = await Event.find({}, 'id');
//     const eventIds = events.map(event => event.id);
//     res.json(eventIds);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch event IDs' });
//   }
// });

app.get('/', (req, res) => {
  res.send('Hello World! The server is running.'); // Basic response to indicate the server is running
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

