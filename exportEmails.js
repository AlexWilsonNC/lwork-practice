const mongoose = require('mongoose');
require('dotenv').config();

const emailsUri = process.env.EMAILS_MONGODB_URI;

// Connect to the MongoDB database for emails
mongoose.connect(emailsUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define the email schema and model
const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  dateSubscribed: { type: Date, default: Date.now }
});

const EmailSubscription = mongoose.model('EmailSubscription', emailSchema, 'emails');

// Function to export emails
async function exportEmails() {
  try {
    const emails = await EmailSubscription.find({}, 'email').exec(); // Get only the email field
    const emailList = emails.map(e => e.email).join(', ');
    
    console.log(`Exported ${emails.length} emails:`);
    console.log(emailList);

    // Write to a file
    const fs = require('fs');
    fs.writeFileSync('emails.txt', emailList, 'utf8');
    console.log('Emails saved to emails.txt');
    
    process.exit();
  } catch (error) {
    console.error('Error exporting emails:', error);
    process.exit(1);
  }
}

exportEmails();
