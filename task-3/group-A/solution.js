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
    mapReduceMails();
  }

});

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
