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

//send mail verification
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

//send id written by the user in the body
router.put('/verify',(req, res) => {
	Client.findOne({_id: new ObjectId(req.body._id)},
	(err, client) => {
		if(!err){
			console.log(client + ' found.');
			client.verified = true;		
			client.save((err, obj) => {
				if (!err) {
					console.log(obj.name + ' saved.');  		
					res.json(obj);
				}  	
  		});
		}
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
  		console.log(obj.name + ' saved.');
  		sendVerification(obj._id, obj.email);
  		res.json(obj);
  	}
  }); 
});

//create accounts for the different managment roles
//send name, lastname, email password and role in hte body
router.post('/adminCreation', (req, res) => {
	
	var admin = new Admin();
  admin.name = req.body.name;
  admin.lastName = req.body.lastName;
  admin.email = req.body.email;
  admin.password = req.body.password;
  admin.role = req.body.role
  
  admin.save((err, obj) => {
  	if (!err) {
  		console.log(obj.name + ' saved as admin.');  		
  		res.json(obj);
  	}  	
  }); 
});

//create products send name, description, price, image, categories in the body
router.post('/productCreation', (req, res) => {

	var product = new Product();
  product.name = req.body.name;
  product.description = req.body.description;
  product.price = req.body.price;
  product.image = req.body.iamge;
  product.categories = req.body.categories;
  
  product.save((err, obj) => {
  	if (!err) {
  		console.log(obj.name + ' saved new product.');
  		res.json(obj);
  	}  	
  }); 
});

//client login send emal and password in the body
router.post('/clientLogin', (req, res) => {
	Client.findOne(
		{email: req.body.email, 
		passwordDigest: req.body.password}, 
	(err, client) => {
		if(!err){
			console.log(client + ' found.');
			res.json(client);
		}
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

//get client information send client _id as a parameter
router.get('/clientInfo', (req, res) => {
	Client.findOne({_id: new ObjectId(req.param('_id'))},
	(err, client) => {
		if(!err) console.log(client + ' found.');
		res.json(client);
	});
});

//get admin information send admin _id as a parameter
router.get('/adminInfo', (req, res) => {
	Admin.findOne({_id: new ObjectId(req.param('_id'))},
	(err, admin) => {
		if(!err) console.log(admin + ' found.');
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

//get all clients
router.get('/clients', (req, res) => {
	Client.find({}, (err, clients) => {
		if(!err) console.log(clients + ' found.');
		res.json(clients);
	});
});

//get all admins
router.get('/admins', (req, res) => {
	Admin.find({}, (err, admins) => {
		if(!err) console.log(admins + ' found.');
		res.json(admins);
	});
});

//get all products
router.get('/products', (req, res) => {
	Product.find({}, (err, products) => {
		if(!err) console.log(products + ' found.');
		res.json(products);
	});
});

//modifiy client information send client updated information in the body
router.put('/modifyClient', (req, res) => {
	Client.findOne({_id: new ObjectId(req.body._id)},
	(err, client) => {
		if(!err){
			console.log(client + ' found.');
			client.name = req.body.name;
			client.lastName = req.body.lastName;
			client.password = req.body.password;
			client.address.street = req.body.street,
			client.address.postalCode = req.body.postalCode,
			client.address.number = req.body.number,
			client.address.state = req.body.state,
			client.address.city = req.body.city
			client.cards = req.body.cards;
		
			if(client.email !== req.body.email){
				client.verified = false;
				client.email = req.body.email;
				console.log(client.name + " needs to verify at " + client.email);
				sendVerification(client._id, client.email);
			}

			client.save((err, obj) => {
				if (!err) {
					console.log(obj.name + ' saved.');  		
					sendVerification();
					res.json(obj);
				}  	
			});
		}
	});
});

//modifiy admin information send admin updated information in the body
router.put('/modifyAdmin', (req, res) => {
	Admin.findOne({_id: new ObjectId(req.body._id)},
	(err, admin) => {
		if(!err){
			console.log(admin + ' found.');
			admin.name = req.body.name;
			admin.lastName = req.body.lastName;
			admin.email = req.body.email;
			admin.password = req.body.password;
			admin.role = req.body.role;

			admin.save((err, obj) => {
				if (!err) {
					console.log(obj.name + ' saved.');
					res.json(obj);
				}  	
			});
		}
	});
});

//modifiy product information send id name description price image categories[]
router.put('/modifyProduct', (req, res) => {
	Product.findOne({_id: new ObjectId(req.body._id)},
	(err, product) => {
		if(!err){
			console.log(product + ' found.');
			product.name = req.body.name;
			product.description = req.body.description;
			product.price = req.body.price;
			product.image = req.body.image;
			product.categories = req.body.categories;

			product.save((err, obj) => {
				if (!err) {
					console.log(obj.name + ' saved.');
					res.json(obj);
				}  	
			});
		}
	});
});

//delete client by id in body
router.delete('/deleteClient', (req, res) => {
	Client.remove({_id: new ObjectId(req.body._id)},
	(err, obj) => {
		if(!err){
			console.log(obj.n+' object was removed from the database.');
			res.json(obj);
		}
	});
});

//delete admin by id in body
router.delete('/deleteAdmin', (req, res) => {
	Admin.remove({_id: new ObjectId(req.body._id)},
	(err, obj) => {
		if(!err){
			console.log(obj.n + 'object was removed from the database.');
			res.json(obj);
		}
	});
});

//delete product by id in body
router.delete('/deleteProduct', (req, res) => {
	Product.remove({_id: new ObjectId(req.body._id)},
	(err, obj) => {
		if(!err){
			console.log(obj.n+'object was removed from the database.');
			res.json(obj);
		}
	});
});

//Test
router.get('/test', (req, res) => {	
  var n = req.params('name');
  res.json({
    name: n
  });
});
