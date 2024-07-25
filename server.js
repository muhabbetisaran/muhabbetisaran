require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Replace the following with your MongoDB connection string from the environment variables
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Example schema and model
const MemorySchema = new mongoose.Schema({
  image: String,
  text: String,
});

const Memory = mongoose.model('Memory', MemorySchema);

// API route to save memory
app.post('/api/save', async (req, res) => {
  const { image, text } = req.body;
  const newMemory = new Memory({ image, text });
  await newMemory.save();
  res.send({ message: 'Memory saved successfully!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
