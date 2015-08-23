module.exports = (function(passport) {
	var crypto = require('crypto');
	var LocalStrategy = require('passport-local').Strategy;
	var User = require('../../models/user');

	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function (username, password, next) {
			return User.findOne({username: username}, function (err, user) {

					if (err) {
						return next(err);
					}
					if (!user) {
						return next({message: 'User does not exist.'}, false);
					}

					var shasum = crypto.createHash('sha256');
					shasum.update(password);
					var encryptedPassword = shasum.digest('hex');

					if (user['password'] !== encryptedPassword) {
						return next({message: 'Incorrect password.'}, false);
					}

					return next(null, user);
				});
		}));

	passport.serializeUser(function (user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, done);
	});

	return passport.authenticate.bind(passport);
});
