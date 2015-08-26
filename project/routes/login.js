var express = require('express');
var passport = require('passport');

var authMiddleware = require('./middleware/authenticate')(passport);

var router = express.Router();
/* GET Login page */

router.get('/', function (req, res) {
	res.render('login', {title: 'Hirundo - Login', message: ''});
});

router.post('/', authMiddleware('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));

module.exports = router;
