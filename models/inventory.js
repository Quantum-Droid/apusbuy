'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var inventorySchema = mongoose.Schema({
	product: ObjectId,
	ammount: Number
})

module.exports = mongoose.model('Inventory', inventorySchema);	