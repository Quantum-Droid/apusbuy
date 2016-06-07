'use strict';

var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
	name: String,
	lastName: String,
	email: String,
	passwordDigest: String,
	rol: String
})

module.exports = mongoose.model('Product', adminSchema);	