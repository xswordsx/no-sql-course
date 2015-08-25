// текст на вица, автор (име на
// потребител от колекцията за потребители), рейтинг (число от 1 до 10), както и списък с
// героите от вица. Документите от колекцията за потребители трябва да имат поне поле за
// име, имейл адрес и списък от герои от вицове, които харесват.

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jokeSchema = new Schema({
	text: String,
	author: String,
	rating: { type: Number, min: 1, max: 10 },
	characters: [String],
	black_humor: { type: Boolean, required: false }
});

var userSchema = new Schema({
	name: { type: String, unique: true },
	email: { type: String, unique: true },
	likes: [String]
});

var User = mongoose.model('User', userSchema);
var Joke = mongoose.model('Joke', jokeSchema);


mongoose.connect('mongodb://localhost:27017/jokes', function (err) {
		if(err) {
			console.error(err);
			process.exit(-1);
		} else {
			if(process.argv[2] === '-d') {
				lazyDrop();
			} else {
				/* Pick one */
				// blackHumor();
				// chuck_and_ivan();
				// removeLessThanThree();
				// createdByCount();
			}
		}
	});
function blackHumor() {
	User.findOne({}, function(err, user) {
		if (err) {
			console.error(err);
			process.exit(-2);
		} else {
			console.log('Updating jokes for', user.name);
			Joke.update({author: user.name}, {$set: {black_humor: true}}, {multi: true}, function(err, n) {
				if (err) {
					console.error(err);
					process.exit(-3);
				} else {
					console.log('Successfully labeled', n , 'jokes `black_humor`');
					done();
				}
			});
		}
	});
}

function chuck_and_ivan() {
	Joke.find({characters: {$in: ["Чък Норис", "Иванчо"]}},	undefined, {sort: {rating: 1}}, function(err, data) {
		if (err) {
			console.error(err);
			done();
		} else {
			console.log('Chuck & Ivan:');
			console.log(JSON.stringify(data, null, 2));
			done();
		}
	});
}

function removeLessThanThree() {
	Joke.remove({rating: {$lte: 3}}, function(err, stats) {
		if (err) {
			console.error(err);
		} else {
			console.log('Removed', stats.result.n, 'documents');
		}
		done();
	})
}

function createdByCount() {
	User.findOne({}, function(err, doc) {
		if (err) {
			console.error(err);
			done();
		} else {
			console.log('Checking jokes made by', doc.name);
			Joke.count({author: doc.name}, function(err, count) {
				if (err) {
					console.error(err);
				} else {
					console.log('Found', count, 'documents');
				}
				done();
			});
		}
	});
}

// Helper functions
function lazyDrop() {
		User.remove({}, function(err, n) {
			if(err) {
				console.error('could not remove all users', err);
			} else {
				console.log('USERS', n.result);
			}
		});

		Joke.remove({}, function(err, n) {
			if(err) {
				console.error('could not remove all jokes', err);
			} else {
				console.log('JOKES', n.result);
			}
			done();
		});
}

function done() {
	mongoose.disconnect();
}
