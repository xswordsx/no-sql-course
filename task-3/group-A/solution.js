var mongoose = require('mongoose');

var User = mongoose.model('User', new mongoose.Schema({
	name: { type: String, unique: true },
	email: { type: String, unique: true },
	likes: [String]
}));

var Joke = mongoose.model('Joke', new mongoose.Schema({
	text: String,
	author: String,
	rating: { type: Number, min: 1, max: 10 },
	characters: [String],
	black_humor: { type: Boolean, required: false }
}));

mongoose.connect('mongodb://localhost:27017/jokes', function(err, ok) {

  if(err) {
    console.error(err);
    done(-1);
  } else {
    console.log('connected to db');
    aggregate();
  }

});

function aggregate() {

  var callback = function(err, result) {
    if(err) {
      console.error(err);
      done(-3);
    } else {
      console.log('Character info saved to `top_3_jokes`');
			done(0);
    }};

  Joke.aggregate([
    { $unwind: "$characters" },
    { $group: {
      _id: "$characters",
			text: { $addToSet: "$text" },
			author: { $addToSet: "$author" },
			jokes_count: { $sum: 1 },
      avg_rating: { $avg: "$rating" }
  	}},
		{ $sort: { jokes_count: -1 } },
		{ $limit: 3 },
		{ $out: 'top_3_jokes' }
  ], callback);

}

function mapReduceMails() {
  var o = {};
  o.map = function() {
    emit(this.email.split('@').pop(), this.likes.length);
  };

  o.reduce = function(key, values) {
    return Array.avg(values);
  }

  User.mapReduce(o, function(err, results) {
    if(err) {
      console.error(err);
      done(-2);
    } else {
      console.log('Map-reduce domain likes:', results);
      done(0);
    }
  });

}

function done(x) {
  mongoose.disconnect(process.exit.bind(process, x));
}
