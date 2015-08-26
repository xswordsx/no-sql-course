var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function shortMessage  (x) { return x.length <= 140 }
function shortLocation (x) { return x.length <= 30 }

var messageSchema = new Schema({
	author: {
		type: Schema.Types.ObjectId,
		index: true,
		ref: 'User',
		required: true
	},
	content: {
		type: String,
		validate: [shortMessage, 'Message too long' ],
		required: true
	},
	location: {
		type: String,
		validate: [shortLocation, 'Location too long' ],
		default: ''
	},
	published: {
		type: Date,
		default: Date.now
	},
	tags: {
		type: [String],
		index: true
	}
});

module.exports = mongoose.model('Message', messageSchema);
