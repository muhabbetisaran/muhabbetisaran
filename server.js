const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define a schema and model for Memories and Movies
const memorySchema = new mongoose.Schema({
    image: String,
    text: String
});

const Memory = mongoose.model('Memory', memorySchema);

const movieSchema = new mongoose.Schema({
    title: String,
    quote: String
});

const Movie = mongoose.model('Movie', movieSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to save memories
app.post('/api/save-memories', async (req, res) => {
    const { memories } = req.body;
    try {
        await Memory.deleteMany({});
        await Memory.insertMany(memories);
        res.status(200).send('Memories saved');
    } catch (err) {
        res.status(500).send('Error saving memories');
    }
});

// API endpoint to save movies
app.post('/api/save-movies', async (req, res) => {
    const { movies } = req.body;
    try {
        await Movie.deleteMany({});
        await Movie.insertMany(movies);
        res.status(200).send('Movies saved');
    } catch (err) {
        res.status(500).send('Error saving movies');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
