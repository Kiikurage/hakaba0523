var request = require('request');
var express = require('express');
var router = express.Router();
var User = require('../model/user.js');
var Video = require('../model/video.js');
var Session = require('../model/session.js');
var ObjectId = require('mongoose').Types.ObjectId;
var crypto = require("crypto");
var FB_ENDPOINT = 'https://graph.facebook.com/v2.3'
var videoAPIRouter = require('./api_video.js');

function sendErr(err, res, code) {
	console.err(err);
	res.send(code || 503);
}

router.get(['/', '/index.html'], function(req, res, next) {
	var n = req.query.page || 1,
		MAX_IN_A_PAGE = 50;

	Video.find({})
		.skip((n - 1) * MAX_IN_A_PAGE)
		.limit(MAX_IN_A_PAGE)
		.exec(function(err, videos) {
			if (err) return sendErr(res);

			Promise.all(videos.map(function(video) {
					return new Promise(function(resolve, reject) {
						User.findById(new ObjectId(video.userId), function(err, user) {
							if (err) {
								return reject(err)
							}

							return resolve(user);
						});
					});
				}))
				.then(function(users) {
					return new Promise(function(resolve, reject) {
						var videoObjects = videos.map(function(video, i) {
							return {
								title: 'タイトルはまだ未定',
								videoId: video._id.toString(),
								thumbnail: 'サムネなんてなかった！！！！',
								user: {
									userId: users[i]._id.toString(),
									name: users[i].name
								}
							}
						});

						Video.count({}, function(err, count) {
							if (err) reject(err);
							if (Math.ceil(count / MAX_IN_A_PAGE) < n) reject(err);

							resolve({
								current: n,
								max: Math.ceil(count / MAX_IN_A_PAGE),
								videos: videoObjects
							});
						});
					});
				})
				.then(function(videoData) {
					res.render('index', {
						title: 'Express',
						current: videoData.current,
						max: videoData.max,
						videos: videoData.videos,
						user: req.session.user
					});
				})
				.catch(function(err) {
					sendErr(res, err);
				});
		});
});

router.get('/video/:videoId', function(req, res, next) {
	Video.findById(new Object(req.params.videoId), function(err, video){
		if (err) return sendErr(res, err);

		if (!video) {
			return res.render('video_not_found', {
				title: 'Express',
				videoId: req.params.videoId,
				user: req.session.user
			});
		} else {
			User.findById(new ObjectId(video.userId), function(err, user) {
				if (err) return sendErr(res, err);

				return res.render('video', {
					title: 'Express',
					video: {
						videoId: video._id.toString(),
						title: video.title || '(タイトル無し)',
						user: {
							name: user.name,
							id: user._id.toString()
						}
					},
					user: req.session.user
				});
			});
		}
	})

});

module.exports = router;
