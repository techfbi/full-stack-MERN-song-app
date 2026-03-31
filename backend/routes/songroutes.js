import express from 'express';
import mongoose from 'mongoose';
import SongModel from '../models/songmodels.js';
import requireAuth from '../middleware/requireAuth.js';
import limiter from '../middleware/rateLimiter.js';

const router = express.Router();

//----------------------------------------------------------------------------------------
// POST sorted songs
router.post("/sort", async (req, res) => {
  let { sortBy, order } = req.body;

  // Makes sure the sortBy body sent from frontend is either "rate" or "createdAt"
  const allowedSort = ["rate", "createdAt"];
  if (!allowedSort.includes(sortBy)) {
    sortBy = "createdAt";
  }

  // Makes sure the order body sent from frontend is either "asc" or "desc"
  const allowedOrder = ["asc", "desc"];
  if (!allowedOrder.includes(order)) {
    order = "desc"; // default fallback
  }

  const sortOption = {
    [sortBy]: order === "asc" ? 1 : -1
  };
  try {
    const songs = await SongModel.find().sort(sortOption);
    res.status(200).json(songs);
  } catch (error) {
    res.status(400).json("Error fetching sorted songs");
    console.error("Error fetching sorted songs:", error);
  }

});
//----------------------------------------------------------------------------------------
//middleware

router.use(limiter); // Apply rate limiting to all routes after this line

router.use(requireAuth); //all routes after this line will require authentication

//GET all songs
router.get("/", async (req, res) =>{
  const user_id = req.user._id; // Get the authenticated user's ID from the request object
    try {
      const songs = await SongModel.find({user_id}).sort({createdAt: -1}); //its sorted in descending order (newer first)
      res.status(200).json(songs);
    } catch (error) {
      console.error("Error fetching songs for user:", user_id, error);
      res.status(400).json({error: error.message});
    }
})



// GET a single song
router.get('/:id', (req, res) => {
  res.json({mssg: 'GET a single song'})
})



// POST a song
router.post('/', async (req, res) => {
  const user_id = req.user._id; // Get the authenticated user's ID from the request object
  const {title, artist, rate} = req.body;

  try {
    const song = await SongModel.create({title, artist, rate, user_id});
    res.status(200).json(song);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
})



// DELETE a song
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such song' });
    }
    const delSong = await SongModel.findOneAndDelete({ _id: id });
    if (!delSong) {
      return res.status(404).json({ error: 'No such song' });
    }
    res.status(200).json(delSong);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// UPDATE a song
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such song" });
    }
    const updateSong = await SongModel.findOneAndUpdate({ _id: id }, {...req.body})
    if (!updateSong) {
      return res.status(404).json({ error: "No such song" });
    }
    res.status(200).json({ message: "Song updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})



export default router;