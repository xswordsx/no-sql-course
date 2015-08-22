var mongoose = require('mongoose');
var Schema = mognoose.Schema;

function shortMessage  (x) { return x.length <= 140 }
function shortLocation (x) { return x.length <= 30 }

var messageSchema = new Schema({
	author: { type: Schema.Types.ObjectId, index: true, ref: 'User' },
	content: { type: String, validate: [shortMessage, 'Message too long' ] },
	location: { type: String, validate: [shortLocation, 'Location too long' ] },
	published: { type: Date, default: Date.now },
	tags: { type: [String], index: true }
});

module.exports = new mongoose.Model('Message', messageSchema);
