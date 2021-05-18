const mongoose = require('mongoose');
const uniqueValidator= require ('mongoose-unique-validator');


const userSchema= mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  avatar: {type: String},
  favouritePlatform: {type: String},
  favouritePlatformUsername: {type: String},
  favouritesGames: {type: String},
  favouritesGenres: {type: String},
  aboutMe: {type: String}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
