#!/usr/bin/env node
var Client = require('../models/client');
var Product = require('../models/product');
var Card = require('../models/card');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var async = require('async');

 var address = {
  street: "5th avenue",
  "postalCode": "05061",
  "number": 24,
  "state": "Atizapan",
  "city": "Mexico"
};

mongoose.connect('mongodb://localhost/apusbuy')
var db = mongoose.connection;
db.once('open', () =>{
	//Clearing DB
	Client.remove({}, () =>{		
		var client = new Client();
		client.name = "Steve";
    client.lastName = "Mc Stevens";
    client.email = "steve.stevenson@itesm.mx";
    client.password = "topKek";
    client.verified = true;
    client.address = address;    
    client.cart.discount = 0;

    //assign saved cards to client
    Card.find().exec((err, cards) =>{
    	if(!err && cards.length){
    		client.cards = cards;
    		//asign one existing product to client cart
    		Product.findOne().exec((err, product) =>{
    			client.cart.orders.push({product: product, ammount: 5});
    			client.save((err,c) =>{
    				console.log('Client seed finished');
    				process.exit();
    			})
    		})
    	}
    })
	});
});