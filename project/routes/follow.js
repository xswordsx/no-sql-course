var express = require('express');
var User = require('../models/user');

var router = express.Router();
/* GET Login page */

router.get('/follow/:id', function (req, res) {

	User.follow(req.user._id, req.params.id.toString('utf-8'), function(err, done) {
		if (err) {
			res.status(500).end(err);
		} else {
			res.status(200).end('Followed.');
		}
	});

});

router.get('/unfollow/:id', function(req, res) {

	User.unfollow(req.user._id, req.param.id, function(err, done) {
		if (err) {
			res.staus(500).end(err);
		} else {
			res.status(200).end('Unfollowed.');
		}
	});

});

module.exports = router;
