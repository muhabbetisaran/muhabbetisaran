const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  memories: [{ image: String, text: String }],
  movies: [{ title: String, quotes: [String] }],
});

const User = mongoose.model('User', userSchema);

export default async (req, res) => {
  if (req.method === 'POST') {
    const { name, memories, movies } = req.body;
    try {
      let user = await User.findOne({ name });
      if (user) {
        user.memories = memories;
        user.movies = movies;
      } else {
        user = new User({ name, memories, movies });
      }
      await user.save();
      res.status(200).send('Data saved successfully');
    } catch (err) {
      res.status(500).send('Error saving data');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};
