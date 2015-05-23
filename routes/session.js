var express = require('express');
var router = express.Router();
var User = require('../model/user.js');
var Session = require('../model/session.js');
var ObjectId = require('mongoose').Types.ObjectId;

function sendErr(res, err, code) {
	console.err(err);
	res.send(code || 503);
}

router.use(function(req, res, next) {
	req.session = {
		user: null
	};

	var token = req.cookies.token || req.get('X-Token');
	if (!token) return next();

	Session.findOne({
		token: token
	}, function(err, session){
		if (err) return sendErr(res, err);
		if (!session) return next();

		User.findById(new ObjectId(session.userId), function(err, user){
			if (err) return sendErr(res, err);
			if (!user) return next();

			req.session.session = session;
			req.session.user = user;
			return next();
		});
	});
});

module.exports = router;
