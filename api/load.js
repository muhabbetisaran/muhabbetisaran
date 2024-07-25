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
  if (req.method === 'GET') {
    try {
      const user = await User.findOne({ name: req.query.name });
      if (user) {
        res.json(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      res.status(500).send('Error loading data');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};
