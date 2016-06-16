/*
 * Serve JSON to our AngularJS client
 */

'use strict';

const express = require('express');
const router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var nodemailer = require('nodemailer');
/** Models ***/
var Client  = require('../models/client');
var Admin = require('../models/admin');
var Product = require('../models/product');
var Inventory = require('../models/inventory');

const CLIENT_NOT_FOUND_ERROR = "Could not find client in the DB.";
const PRODUCT_NOT_FOUND_ERROR = "Could not find product in the DB."
const INVENTORY_NOT_FOUND_ERROR = "Could not fund inventory in the DB."
const INVALID_PARAMS_ERROR = "Invalid parameters."

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

//check if query params are valid (not null|undefined)
function validParams (params) {	
	for(var param in params){
		if(!params[param])
			return false;
	}
	return true;
}

//Creates an error JSON object with msg description
function responseError(msg) {
	return {'error': msg};
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

//get client cart
router.get('/cart', (req,res) =>{
	var id = req.query
	Client.findOne({_id: id}, (err,client) =>{
		if(!err){
			if(client)
				res.json(client.cart)
			else
				res.json({error: 'Client not found'})			
		}else{
			res.json({error: err})
		}
	})
});

//add or remove products to/from client's cart
router.put('/cart', (req,res) =>{
	if(validParams(req.body) && validParams(req.query)){
		var id = ObjectId(req.query._id);
		var productId = ObjectId(req.body.product);
		var ammount = req.body.ammount;
		var action = req.body.action;	
		Client.findOne(id,(err, client) =>{ //get client from DB			
			if(!err && client){ //client found
				Product.findOne(productId, (err, product) =>{ //get product from DB
					if(!err && product){ //product found
						client.cart.orders.push({"product": product, "ammount": ammount});
						client.save((err, savedClient) =>{ //update client in DB.
							if(!err){
								res.json(savedClient);
							}else res.json(err);
						})
					}else res.json(responseError(PRODUCT_NOT_FOUND_ERROR));
				})
			}else res.json(responseError(CLIENT_NOT_FOUND_ERROR));			
		})
	}else res.json(responseError(INVALID_PARAMS_ERROR))
	
});

//Clears a client's cart
router.delete('/cart', (req,res) =>{
	var id = req.query._id;
	Client.findOne({_id: id}, (err, client) =>{
		if(!err){
			if(client){
				client.cart = {					
						orders: [],
						discount: 0					
				};
				client.save((err, savedClient) =>{
					if(!err && savedClient) res.json(savedClient);
					else res.json(responseError("Could not delete client's cart"))
				})
			}else res.json(responseError('Could not found client.'));
		}else res.json(responseError(err));
	})
});

/*Represents a sale. Clears client's cart and
updates bought items from Inventory*/
router.put('/checkout', (req,res) =>{
	if (validParams(req.query)){
		var id = ObjectId(req.query._id);
		Client.findOne({_id: id}, (err, client) =>{
			if(!err){ //no error
				if(client){	//client found										
					Inventory.findOne((err,inventory) =>{ //get inventory
						if(!err && inventory){
							//Search products in inventory
							for (var i = inventory.items.length - 1; i >= 0; i--) {
								for (var j = client.cart.orders.length - 1; j >= 0; j--) {									
									if(inventory.items[i].product.toString() === 
										client.cart.orders[j].product.toString()){
										//found product in inventory -> update ammounts available
										inventory.items[i].ammount -= client.cart.orders[j].ammount;										
									}
								}	
							}
							inventory.save((err, savedInventory) =>{ //save inventory
								//clear client's cart
								client.cart.orders = [];
								client.cart.discount = 0;
								client.save((err,savedClient) =>{
									if(!err) res.json(savedClient);
								})
							})
						}else res.json(responseError(INVENTORY_NOT_FOUND_ERROR))
					})								
				}else res.json(responseError(CLIENT_NOT_FOUND_ERROR));
			}else res.json(responseError(err));
		});
	}else res.json(responseError('Invalid params'));
});



//Test
router.get('/test', (req, res) => {	
  var n = req.params('name');
  res.json({
    name: n
  });
});
