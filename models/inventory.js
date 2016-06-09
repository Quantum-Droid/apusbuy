'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var inventorySchema = mongoose.Schema({
	items: [
		{
			product: {type: ObjectId, ref: 'Product'},
			ammount: Number
		}
	]	
})

module.exports = mongoose.model('Inventory', inventorySchema);	