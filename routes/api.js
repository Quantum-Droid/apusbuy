/*
 * Serve JSON to our AngularJS client
 */

'use strict';

const express = require('express');
const router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var Client  = require('../models/client');
var Admin = require('../models/admin');
var Product = require('../models/product');
var nodemailer = require('nodemailer');

module.exports = router;

//register
function sendVerification(id, email){
	console.log("Sending verification...");
	console.log(id);
	console.log(email);
	var transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: "apusbuy@gmail.com",
			pass: "123qwe123asd"
		}
	});
	var mailOptions = {
		to: email,
		subject: 'Verify your account',
		text: 'Hello there we are glad you had joined Apusbuy. Now before you can start buying with your account just write this code:'+ id +' on your profile so we can verify this is your email.'
	};
	transporter.sendMail(mailOptions, function(err, info){
		if(!err){
			console.log('Message sent: ' + info.response);
		}else{
			console.log(err);
		}
	});
	
}

//send id writtem by the user in the body
router.put('/verify',(req, res) => {
	Client.findOne({_id: new ObjectId(req.body._id)},
	(err, client) => {
		if(!err) console.log(client + ' found.');
		client.verified = true;		
		client.save((err, obj) => {
			if (!err) {
				console.log(obj.name + ' saved.');  		
				res.json(client);
			}  	
  	});
	});
});

//send clients data in the body
router.post('/register', (req, res) => {
	var address = {
  	street: req.body.street,
  	postalCode: req.body.postalCode,
  	number: req.body.number,
  	state: req.body.state,
  	city: req.body.city
	}	
	
	var client = new Client();
  client.name = req.body.name;
  client.lastName = req.body.lastName;
  client.email = req.body.email;
  client.passwordDigest = req.body.password;
  client.verified = false;
  client.address = address;
  client.cards = [];
  client.cart = {
  	orders: [],
  	discount: 0
  }
  
  client.save((err, obj) => {
  	if (!err) {
  		console.log(obj.name + 'saved.');  		
  		sendVerification(obj._id, obj.email);
  		res.json(client);
  	}  	
  }); 
});

//client login send emal and password in the body
router.post('/clientLogin', (req, res) => {
	Client.findOne(
		{email: req.body.email, 
		passwordDigest: req.body.password}, 
	(err, client) => {
		if(!err)console.log(client + 'found.');
		res.json(client);		
	});	
});

//admin login send email and password in the body
router.post('/adminLogin', (req, res) => {
	Admin.findOne(
		{email: req.body.email, 
		password: req.body.password}, 
	(err, admin) => {
		if(!err)console.log(admin + 'found.');
		res.json(admin);		
	});	
});

//get product information send product _id as a parameter
router.get('/productInfo', (req, res) => {
	Product.findOne({_id: new ObjectId(req.param('id'))},
	(err, product) => {
		if(!err) console.log(product + ' found.');
		res.json(product);
	});
});

//get client information send client _id as a parameter
router.get('/clientInfo', (req, res) => {
	Client.findOne({_id: new ObjectId(req.param('_id'))},
	(err, client) => {
		if(!err) console.log(client + ' found.');
		res.json(client);
	});
});

//modifiy client information send client updated information in the body
//does not change email and password
router.put('/modifyClient', (req, res) => {
	Client.findOne({_id: new ObjectId(req.body._id)},
	(err, client) => {
		if(!err) console.log(client + ' found.');
		client.name = req.body.name;
		client.lastName = req.body.lastName;
		client.address.street = req.body.street,
  	client.address.postalCode = req.body.postalCode,
  	client.address.number = req.body.number,
  	client.address.state = req.body.state,
  	client.address.city = req.body.city
		client.cards = req.body.cards;
		
		client.save((err, obj) => {
			if (!err) {
				console.log(obj.name + ' saved.');  		
				sendVerification();
				res.json(client);
			}  	
  	});
	});
});

//Test
router.get('/test', (req, res) => {	
  var n = req.params('name');
  res.json({
    name: n
  });
});
