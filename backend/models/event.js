const mongoose = require('mongoose');

const eventSchema= mongoose.Schema({
  title: {type: String, required: true},
  game: {type: String, required: true},
  genre: {type: String, required: true},
  platform: {type: String, required: true},
  description: {type: String },
  connectionData: {type: String},
  numberPlayersMax: {type: Number, required: true},
  date: {type: String, required: true},
  image: {type: String},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  players: {type: [mongoose.Schema.Types.ObjectId], ref: 'User', required: true},
  popular: {type: Boolean}
});

module.exports = mongoose.model('Event', eventSchema);
