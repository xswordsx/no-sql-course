var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: { type: String, unique: true, index: true },
	email: { type: String, unique: true },
	password: String,
	created: { type: Date, default: Date.now },
	following: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
	verified: Boolean
});

module.exports = new mongoose.Model('User', userSchema);
