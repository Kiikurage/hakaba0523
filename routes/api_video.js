var express = require('express');
var multer = require('multer');
var router = express.Router();
var fs = require('exfs');
var Video = require('../model/video.js');
var User = require('../model/user.js');
var ObjectId = require('mongoose').Types.ObjectId;

var ROOT = __dirname + '/../uploads/';

function sendJSONErr(res, data, code) {
	data = data || 'internal server error.';

	res.set('Conten-Type', 'application/json');
	res.send(code || 503, JSON.stringify({
		status: 'error',
		result: data
	}));
}

function sendJSON(res, data) {
	res.set('Conten-Type', 'application/json');
	res.send(200, JSON.stringify({
		status: 'success',
		result: data || {}
	}));
}

router.get('/list', function(req, res, next) {
	var n = req.params.page,
		MAX_IN_A_PAGE = 50;

	Video.find({})
		.skip((n - 1) * MAX_IN_A_PAGE)
		.limit(MAX_IN_A_PAGE)
		.exec(function(err, videos) {
			if (err) return sendJSONErr(res);

			Promise.all(videos.map(function(video) {
					return new Promise(function(resolve, reject) {
						User.findById(new ObjectId(video.userId), function(err, user) {
							if (err) {
								return reject(err)
							} else {
								return resolve(user);
							}
						});
					});
				}))
				.then(function(users) {
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
						if (err) return sendJSONErr(res);

						return sendJSON(res, {
							max: Math.ceil(count / MAX_IN_A_PAGE),
							current: n,
							list: videoObjects
						});
					});
				})
		});
});

router.get('/:videoId', function(req, res, next) {
	Video.findById(new ObjectId(req.params.videoId), function(err, video) {
		if (err) {
			console.error(err);
			return res.sendStatus(503);
		}

		if (!video) {
			return res.sendStatus(404);
		}

		res.sendFile(video.path, {
			root: '/',
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		}, function(err) {
			if (err) {
				console.log(err);
				res.status(err.status).end();
			}
		});
	});
});

router.post('/', function(req, res, next) {
	if (!req.session.user) return sendJSONErr(res, 'permission denied', 403);

	multer({
		dest: ROOT,
		rename: function(fieldname, filename) {
			return filename + '-' + (Date.now());
		}
	})(req, res, function() {
		var video = new Video({
			path: req.files.video.path,
			userId: req.session.user._id.toString()
		});

		video.save(function(err) {
			if (err) return sendJSONErr(res);

			return sendJSON(res, {
				videoId: video._id.toString()
			});
		});
	});
});

router.delete('/:videoId', function(req, res, next) {
	if (!req.session.user) return sendJSONErr(res, 'permission denied', 403);

	Video.findById(new ObjectId(req.params.videoId), function(err, video) {
		if (err) return sendJSONErr(res);

		if (!video) return sendJSONErr(res, 'not found', 404);
		if (video.userId !== req.session.user._id.toString()) return sendJSONErr(res, 'permission denied', 403);

		Video.findByIdAndRemove(video._id, function(err) {
			if (err) return sendJSONErr(res);

			fs.unlink(video.path, function(err) {
				if (err) return sendJSONErr(res);

				return sendJSON();
			});
		});
	});
});

module.exports = router;
