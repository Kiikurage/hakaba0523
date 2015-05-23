var mongoose = require('./mongoose.js');

var Video = mongoose.model('Video', {
	path: String,
	thumbnailPath: String,
	userId: String,
	title: String
});

module.exports = Video;
