'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var clientSchema = mongoose.Schema({
	name: String,
	lastName: String,
	email: String,
	verified: Boolean,
	password: String,
	address: {
		street: String,
		postalCode: String,
		number: Number,
		state: String,
		city: String,
	},
	cards: [{type: ObjectId, ref: 'Card'}],
	cart: {
		orders: [{product: {type: ObjectId, ref: 'Product'}, ammount: Number}],
		discount: {type: Number, default: 0},		
	}
	
}, {timestamps: true});

module.exports = mongoose.model('Client', clientSchema);	         