var express = require('express');
var Message = require('../models/message');
var User = require('../models/user');

var router = express.Router();
/* GET Login page */

router.get('/list', function (req, res) {
	User.findOne({_id: req.user._id}, function (err, doc) {
		if(err) {
			res.status(500).end(err);
		} else {
			Message.find({author: {$in: doc.following}})
				.sort({published: -1})
				.limit(50)
				.populate('author', 'username')
				.exec(function (err, messages) {
					if(err) {
						res.status(500).end();
					} else {
						res.render('timeline_list', {user: doc, messages: messages});
					}
				});
		}
	});
});

router.get('/', function(req, res) {
	res.render('timeline', {title: req.user.username + "'s timeline", user: req.user});
});

module.exports = router;
