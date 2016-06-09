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
	cards: [{type: ObjectId, ref: 'Card'}],
	cart: {
		orders: [{product: {type: ObjectId, ref: 'Product'}, ammount: Number}],
		discount: Number,		
	}
	
}, {timestamps: true});

module.exports = mongoose.model('Client', clientSchema);	