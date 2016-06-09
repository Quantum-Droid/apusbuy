#!/usr/bin/env node

var Inventory = require('../models/inventory');
var Product = require('../models/product');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var async = require('async');

function processRow(row,cb){
	console.log(row);
}

function done(){
	console.log("done");
	process.exit();
}

mongoose.connect('mongodb://localhost/apusbuy')
var db = mongoose.connection;
db.once('open', () =>{
	//Clearing DB
	Inventory.remove({},()=>{
		Product.find().exec((err,products) =>{
			if(!err && products.length){
				//Create an inventory for each
				var inventory = new Inventory();
				async.eachSeries(products, function (product, callback){					
					inventory.items.push({
						product: product,
						ammount: Math.floor((Math.random() * 300) + 1)
					})					
					inventory.save((err,p) =>{
						callback();				
					});
				}, function(err){
					console.log('Inventory seeded');
					process.exit();
				});
			}
		});
	})
});