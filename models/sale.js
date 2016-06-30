'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var saleSchema = mongoose.Schema({
	product: {type: ObjectId, ref: 'Product'},
	amount: Number
}, {timestamps: true});

module.exports = mongoose.model('Sale', saleSchema);
