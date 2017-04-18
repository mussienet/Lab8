var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var locationSchema = new Schema({
  name: String,
  category: String,
  address: {
    latitude: Number,
    longitude: Number
  }
});

var Location = mongoose.model('Location', locationSchema);

module.exports = Location;