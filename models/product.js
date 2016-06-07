'use strict';

/*
 * For Image handling, visit
 * https://medium.com/@alvenw/how-to-store-images-to-mongodb-with-node-js-fb3905c37e6d#.p2lb5cxt3
 */

var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
	name: String,
	description: String,
	price: Number,
	image: {data: Buffer, contentType: String},
	categories: [String]
})

module.exports = mongoose.model('Product', productSchema);	