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

module.exports = mongoose.model('User', userSchema);
