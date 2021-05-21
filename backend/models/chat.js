const mongoose = require('mongoose');

const chatSchema= mongoose.Schema({
  message: {type: String, required: true},
  username: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  date: {type: String, required: true},
  event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true}
});


module.exports = mongoose.model('Chat', chatSchema);


