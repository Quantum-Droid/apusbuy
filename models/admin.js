'use strict';

var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
	name: String,
	lastName: String,
	email: String,
	password: String,
	role: String
})

module.exports = mongoose.model('Admin', adminSchema);	