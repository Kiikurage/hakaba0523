var mongoose = require('./mongoose.js');

var Video = mongoose.model('Video', {
	path: String,
	userId: String
});

module.exports = Video;
