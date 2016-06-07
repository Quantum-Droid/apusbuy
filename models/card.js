'use strict';

var mongoose = require('mongoose');

var cardSchema = mongoose.Schema({
	number: Number,
	code: Number,
	expirationDate: String
})

module.exports = mongoose.model('Product', cardSchema);	