const mongoose = require('mongoose');

const rating_schema = new mongoose.Schema({
    username: { type: String, required: true },
    anime_id: { type: Number, required: true },
    status: { type: String, required: true },
    score: { type: Number, required: true },
    is_rewatching: { type: Number },
    num_watched_episodes: { type: Number }
}, { collection: 'ratings' });

module.exports = mongoose.model('rating', rating_schema);