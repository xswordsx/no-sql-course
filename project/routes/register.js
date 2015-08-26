var crypto = require('crypto');
var express = require('express');
var passport = require('passport');

var crypto = require('crypto');
var User = require('../models/user');

var router = express.Router();
/* GET Login page */

router.post('/', function (req, res) {

	var pass = crypto.createHash('sha256').update(req.body.password).digest('hex');
	req.body.password = pass;

	User.create(req.body, function(err, doc) {
		if (err) {
			var subtext = null;
			if(/duplicate/i.test(err.errmsg)) {
				subtext = "user already exists";
			}
			res.status(500).render('error', {
				status: 500,
				message: 'Could not create user ' + req.body.username,
				title: "Could not create user",
				subtext: subtext
			});
		} else {
			res.redirect('/login', 201);
		}
	});
});

module.exports = router;
