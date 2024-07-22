const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/memories');

const memorySchema = new mongoose.Schema({
    imgSrc: String,
    text: String
});

const movieSchema = new mongoose.Schema({
    movie: String,
    favoriteLine: String
});

const Memory = mongoose.model('Memory', memorySchema);
const Movie = mongoose.model('Movie', movieSchema);

app.post('/saveMemories', async (req, res) => {
    await Memory.deleteMany({});
    await Memory.insertMany(req.body);
    res.send({ message: 'Memories saved!' });
});

app.get('/loadMemories', async (req, res) => {
    const memories = await Memory.find();
    res.send(memories);
});

app.post('/saveMovies', async (req, res) => {
    await Movie.deleteMany({});
    await Movie.insertMany(req.body);
    res.send({ message: 'Movies saved!' });
});

app.get('/loadMovies', async (req, res) => {
    const movies = await Movie.find();
    res.send(movies);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
