'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var clientSchema = mongoose.Schema({
	name: String,
	lastName: String,
	email: String,
	verified: Boolean,
	passwordDigest: String,
	address: {
		street: String,
		postalCode: Number,
		number: Number,
		state: String,
		city: String,
	},
	cards: [ObjectId],
	cart: {
		orders: {product: ObjectId, ammount: Number},
		discount: {Number},
		creationDate: Timestamp
	}
	
})

module.exports = mongoose.model('Client', clientSchema);	