var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MovieSchema   = new Schema({
	title: String,
	description: String,
	producer: String,
	actors: String
	
});

module.exports = mongoose.model('Movie', MovieSchema);

