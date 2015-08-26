var express = require('express');
var Message = require('../models/message');

var router = express.Router();
/* GET Login page */

router.post('/', function (req, res) {

	var hashtags = [];
	var hashtagChecker = /\#\w+/g;
	var result;
	result = hashtagChecker.exec(req.body.content);
	while(result) {
		hashtags.push(result);
		result = hashtagChecker.exec(req.body.content);
	}

	var tweet = {
		content: req.body.content,
		author: req.user._id.toString('utf-8'),
		location: req.body.location,
		tags: hashtags,
		created: Date.now()
	};

	Message.create(tweet, function(err, doc) {
		if (err) {
			res.status(500).end('Could not send tweet :(');
		} else {
			res.status(201).end('Tweet successfully tweeted');
		}
	});
});

module.exports = router;
