const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auhtorSchema = new Schema({
	name: [{
		type: String,
		unique: False,
		required: False
	}],
	age: [{
		type: String,
		unique: False,
		required: False
	}]
});

module.exports = mongoose.model("Auhtor", auhtorSchema);