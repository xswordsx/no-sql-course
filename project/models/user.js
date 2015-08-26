var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		index: true,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	following: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
	verified: Boolean
});

userSchema.static('follow', function (req_id, id, callback) {

	if(req_id.toString('utf-8') === id.toString('utf-8')) {
		return callback('You cannot follow yourself');
	}

	return this.findOneAndUpdate(
		{_id: req_id},
		{$addToSet: {following: id}},
		{new: true})
	.exec(callback);
});

userSchema.static('unfollow', function (req_id, id, callback) {

	if(req_id.toString('utf-8') === id.toString('utf-8')) {
		return callback('You cannot unfollow yourself');
	}

	return this.findOneAndUpdate(
		{_id: req_id},
		{$pull: {following: mongoose.Types.ObjectId(id)}},
		{new: true})
	.exec(callback);
});

module.exports = mongoose.model('User', userSchema);
