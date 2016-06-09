#!/usr/bin/env node
var exec = require('child_process').execFile;
var fs = require('fs');
var Product = require('./models/product');
var mongoose = require('mongoose');
var db = mongoose.connection;

function seedClient () {
	exec('./seeds/clientSeed.js', (err, data) =>{
		if(err) console.log(err);				
	}); 
}

function seedInventory () {
	exec('./seeds/inventorySeed.js', (err, data) =>{
		if(err) console.log(err);
		console.log('Seeding finished!');
		process.exit()	 	
	}); 
}	

function seed (collection) {	
	var products = JSON.parse(fs.readFileSync('./seeds/' + collection + '.json', 'utf8'));
	products.forEach( function(product, index) {
		db.collection(collection).insert(product, (err, result) =>{
			if(err) console.log(err);			
		})
	});	
}

function clearDB () {
	mongoose.connection.db.dropDatabase();
}

function startSeeding() {
	mongoose.connect('mongodb://localhost/apusbuy')	
	db.once('open', () =>{
		clearDB();
		seed('products');
		seed('cards');
		seed('admins');
		seedClient();
		seedInventory();

	})
}

startSeeding();