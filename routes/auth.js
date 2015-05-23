var request = require('request');
var express = require('express');
var router = express.Router();
var User = require('../model/user.js');
var Session = require('../model/session.js');
var crypto = require("crypto");
var FB_ENDPOINT = 'https://graph.facebook.com/v2.3'

function sendErr(res, err, code) {
	console.err(err);
	res.send(code || 503);
}

router.post('/logined', function(req, res, next) {
	var token = req.body.accessToken,
		userId = req.body.userId;

	request(FB_ENDPOINT + '/me?access_token=' + token, function(err, fbRes) {
		var data = JSON.parse(fbRes.body),
			fbResUserId = data.id;

		if (!fbResUserId || fbResUserId !== userId) {
			return res.redirect('/login/invalidToken');
		}

		User.findOne({
			fbUserId: userId
		}, function(err, user) {
			if (err) return sendErr(res, err);

			if (user) {
				Session.findOne({
					userId: user._id
				}, function(err, session) {
					if (err) return sendErr(res, err);

					if (session) {
						res.cookie('token', session.token);
						return res.redirect('/');

					} else {
						var token = crypto.createHash("md5").update(userId + 'chikuwa BIG myouzin').digest("hex"),
							session = new Session({
								userId: user._id.toString(),
								token: token
							});

						session.save(function(err) {
							if (err) return sendErr(res, err);

							res.cookie('token', token);
							return res.redirect('/');
						});
					}
				});

			} else {
				user = new User({
					fbUserId: userId,
					fbToken: token,
					name: data.name
				});

				user.save(function(err) {
					if (err) return sendErr(res, err);

					var token = crypto.createHash("md5").update(userId + 'chikuwa BIG myouzin').digest("hex"),
						session = new Session({
							userId: user._id.toString(),
							token: token
						});

					session.save(function(err) {
						if (err) return sendErr(res, err);

						res.cookie('token', token);
						return res.redirect('/');
					});
				});
			}

		});
	});
});

router.get('/invalidToken', function(req, res, next) {
	res.render('invalidToken', {
		title: 'Express'
	});
});

router.get('/logout', function(req, res, next) {
	if (!req.session.session) return res.redirect('/');

	Session.findByIdAndRemove(req.session.session, function(err){
		if (err) return sendErr(res, err);

		res.cookie('token', '');
		return res.redirect('/');
	});
});

router.get('/login', function(req, res, next) {
	res.render('login', {
		title: 'Express'
	});
});

module.exports = router;
