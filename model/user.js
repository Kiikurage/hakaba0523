var mongoose = require('./mongoose.js');

var User = mongoose.model('User', {
	fbToken: String,
	fbUserId: String,
	name: String
});

module.exports = User;
