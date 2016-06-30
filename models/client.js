'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var clientSchema = mongoose.Schema({
	name: String,
	lastName: String,
	birthdate: String,
	email: String,
	verified: Boolean,
	password: String,
	avatar: {type: String, default: "https://1.bp.blogspot.com/-XaPPe3eCMwE/VZSjxETf2OI/AAAAAAAANzE/3uOIgVpxds0/s1600/avatar.png"},
	address: {
		street: String,
		postalCode: String,
		number: Number,
		state: String,
		city: String,
	},
	cards: [{
		number: String,
		code: String,
		expirationDate: String
	}],
	cart: {
		orders: [{product: {type: ObjectId, ref: 'Product'}, amount: Number}],
		discount: {type: Number, default: 0},		
	},
	boughtItems: {type: Number, default: 0}		
	
}, {timestamps: true});

module.exports = mongoose.model('Client', clientSchema);	         
