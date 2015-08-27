var express = require('express');
var Message = require('../models/message');
var User = require('../models/user');

var router = express.Router();
/* GET Login page */

router.post('/list', function (req, res) {
	User.findOne({_id: req.user._id}, function (err, doc) {
		if(err) {
			res.status(500).end(err);
		} else {

			var criteria = {
				author: { $in: doc.following }
			};

			if(req.body && req.body.tags && req.body.tags.length > 0) {
				criteria.tags = { $all: req.body.tags };
			}

			Message.find(criteria)
				.sort({published: -1})
				.limit(50)
				.populate('author', 'username')
				.exec(function (err, messages) {
					if(err) {
						res.status(500).end(JSON.stringify(err));
					} else {
						res.status(200).render('timeline_list', {user: doc, messages: messages});
					}
				});
		}
	});
});

router.get('/', function(req, res) {
	res.render('timeline', {title: req.user.username + "'s timeline", user: req.user});
});

module.exports = router;
