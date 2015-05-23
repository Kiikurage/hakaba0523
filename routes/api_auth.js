var request = require('request');
var express = require('express');
var router = express.Router();
var User = require('../model/user.js');
var Session = require('../model/session.js');
var crypto = require("crypto");
var FB_ENDPOINT = 'https://graph.facebook.com/v2.3'

function sendJSONErr(res, data, code) {
	data = data || 'internal server error.';

	res.set('Conten-Type', 'application/json')
	res.send(code || 503);
	res.send(JSON.stringify({
		status: 'error',
		result: data
	}));
}

function sendJSON(res, data) {
	res.set('Conten-Type', 'application/json')
	res.send(200);
	res.send(JSON.stringify({
		status: 'success',
		result: data
	}));
}

router.post('/login', function(req, res, next) {
	var token = req.body.accessToken,
		userId = req.body.userId;

	request(FB_ENDPOINT + '/me?access_token=' + token, function(err, fbRes) {
		var data = JSON.parse(fbRes.body),
			fbResUserId = data.id;

		if (!fbResUserId || fbResUserId !== userId) {
			return sendError(res, 'invalid access token');
		}

		User.findOne({
			fbUserId: userId
		}, function(err, user) {
			if (err) return sendJSONErr(res);

			if (user) {
				Session.findOne({
					userId: user._id
				}, function(err, session) {
					if (err) return sendJSONErr(res);

					if (sesison) {
						res.cookie('st', token);
						return sendJSON(res, {
							token: token
						});

					} else {
						var token = crypto.createHash("md5").update(userId + 'chikuwa BIG myouzin').digest("hex"),
							session = new Session({
								userId: user._id.toString(),
								token: token
							});

						session.save(function(err) {
							if (err) return sendJSONErr(res);

							return sendJSON(res, {
								token: token
							});
						});
					}
				});

			} else {
				user = new User({
					fbUserId: userId,
					fbToken: token
				});

				user.save(function(err) {
					if (err) return sendJSONErr(res);

					var token = crypto.createHash("md5").update(userId + 'chikuwa BIG myouzin').digest("hex"),
						session = new Session({
							userId: user._id.toString(),
							token: token
						});

					session.save(function(err) {
						if (err) return sendJSONErr(res);

						res.cookie('st', token);
						return sendJSON(res, {
							token: token
						});
					});
				});
			}

		});
	});
});

router.get('/logout', function(req, res, next) {
	if (!req.session.session) return res.redirect('/');

	Session.findByIdAndRemove(req.session.session, function(err){
		if (err) return sendJSONErr(res, err);

		return res.redirect('/');
	});
});

module.exports = router;
