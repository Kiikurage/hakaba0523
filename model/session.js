var mongoose = require('./mongoose.js');

var Session = mongoose.model('Session', {
	userId: String,
	token: String
});

module.exports = Session;
