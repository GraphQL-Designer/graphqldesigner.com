const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
	title: [{
		type: String,
		unique: False,
		required: False
	}],
	genre: [{
		type: String,
		unique: False,
		required: False
	}],
	authorId: [{
		type: String,
		unique: False,
		required: False
	}]
});

module.exports = mongoose.model("Book", bookSchema);