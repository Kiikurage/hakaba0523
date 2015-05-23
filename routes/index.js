var request = require('request');
var express = require('express');
var router = express.Router();
var User = require('../model/user.js');
var Session = require('../model/session.js');
var crypto = require("crypto");
var FB_ENDPOINT = 'https://graph.facebook.com/v2.3'

function sendErr(err, res, code) {
	console.err(err);
	res.send(code || 503);
}

router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express',
		user: req.session.user
	});
});

router.get('/video/:videoId', function(req, res, next) {
	res.render('video', {
		title: 'Express',
		videoId: req.params.videoId,
		user: req.session.user
	});
});

module.exports = router;
