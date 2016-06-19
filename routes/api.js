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
const ADMIN_NOT_FOUND_ERROR = "Could not fund admin in the DB."
const INVALID_PARAMS_ERROR = "Invalid parameters."
const FIRST_DISCOUNT = 10; //10% discount
const FIRST_DISCOUNT_REQUIREMENT = 5; //5 bought items needed for first discount
const SECOND_DISCOUNT = 20;//20% discount
const SECOND_DISCOUNT_REQUIREMENT = 10;//10 bought items needed for first discount
const THIRD_DISCOUNT = 30; //30% discount
var THIRD_DISCOUNT_REQUIREMENT = 20; //20 bought items needed for first discount


module.exports = router;

/*************** HELPERS SECTION ***********************/
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

/*************** LOGIN / REGISTER SECTION **************/
//send id written by the user in the body
router.put('/verify',(req, res) => {
	Client.findOne({_id: new ObjectId(req.query._id)},
	(err, client) => {
		if(!err && client){			
			client.verified = true;		
			client.save((err, obj) => {
				if (!err) {
					console.log(obj.name + ' saved.');  		
					res.json(obj);
				}  	
  		});
		}else res.json(responseError(req.query._id));
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

//client login send emal and password in the body
router.post('/clientLogin', (req, res) => {
	Client.findOne(
		{email: req.body.email, 
		password: req.body.password}, 
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
/*************** ADMIN SECTION ***********************/

//get admin information based on the specified parameter
router.get('/admin', (req, res) => {
	var fields = Object.keys(req.query);
	if(validParams(req.query) && fields.length){
				var searchBy = fields[0];
				var field = req.query[fields];
				var search = {};
				search[searchBy] = new RegExp('^' + field + '$', "i");
				Admin.findOne(search, (err, admin) =>{
					if(!err && admin){
						res.json(admin)
					}else res.json(responseError(ADMIN_NOT_FOUND_ERROR))
				})
	}else res.json(responseError(INVALID_PARAMS_ERROR));
});

//create accounts for the different managment roles
//send name, lastname, email password and role in hte body
router.post('/admin', (req, res) => {
	
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

/*
* Get all admins by search field
* If no field is specified, all admins are retrived
*/
router.get('/admins', (req, res) => {
	var fields = Object.keys(req.query);
	if(validParams(req.query) && fields.length){
		var searchBy = fields[0];
		var field = req.query[fields];
		var search = {};
		search[searchBy] = new RegExp('^' + field + '$', "i");
		Admin.find(search, (err, admin) =>{
			if(!err && admin){
				res.json(admin)
			}else res.json(responseError(ADMIN_NOT_FOUND_ERROR))
		})
	}else{
		//Return all admins in DB
		Admin.find({}, (err, admins) => {
			if(!err) console.log(admins + ' found.');
			res.json(admins);
		});
	}
});

//modifiy admin information send admin updated information in the body
router.put('/admin', (req, res) => {	
	Admin.findOne({_id: new ObjectId(req.query._id)},
	(err, admin) => {
		if(!err && admin){
			console.log(admin + ' found.');
			admin.name = req.body.name ? req.body.name : admin.name;
			admin.lastName = req.body.lastName ? req.body.lastName : admin.lastName;
			admin.email = req.body.email ? req.body.email : admin.email;
			admin.password = req.body.password ? req.body.password : admin.password;
			admin.role = req.body.role ? req.body.role : admin.role;

			admin.save((err, obj) => {
				if (!err) {
					console.log(obj.name + ' saved.');
					res.json(obj);
				}  	
			});
		}else res.json(responseError(ADMIN_NOT_FOUND_ERROR));
	});
});

//delete admin by id in body
router.delete('/admin', (req, res) => {
	Admin.remove({_id: new ObjectId(req.query._id)},
	(err, obj) => {
		if(!err){			
			res.json(obj);
		}
	});
});

/*************** PRODUCT SECTION ***********************/

//create products send name, description, price, image, categories in the body
router.post('/product', (req, res) => {

	var product = new Product();
  product.name = req.body.name;
  product.description = req.body.description;
  product.price = req.body.price;
  product.image = req.body.iamge;
  product.categories = req.body.categories;  
  var ammount = req.body.ammount;

  product.save((err, p) => {
  	if (!err) {  		
  		Inventory.findOne((err, inventory) =>{
  			if(!err && inventory){
  				inventory.items.push({product: p, ammount: ammount})
  				inventory.save((err,savedInventory) =>{
  					if(!err)
  						res.json(p);
  					else res.json(responseError(err))
  				})
  			}else res.json(responseError(INVENTORY_NOT_FOUND_ERROR));
  		})
  	}else res.json(responseError(err));
  }); 
});

/*
* Get product specific information
*/
router.get('/product', (req, res) => {
	Product.findOne({_id: new ObjectId(req.query._id)},
	(err, product) => {
		if(!err) console.log(product + ' found.');
		res.json(product);
	});
});

/*
* Get all products by category.
* if no category is specified, returns all products in DB
*/
router.get('/products', (req, res) => {	
	if(validParams(req.query)){
		var category = req.query.category;
		if(category){
			Product.find({categories: category}, (err, products) =>{
				if(!err)
					res.json(products)
				else res.json(err);
			})
		}else{
			Product.find({}, (err, products) => {
			if(!err){
				res.json(products);
			}else res.json(responseError(err));
		});
		}		
	}else res.json(responseError(INVALID_PARAMS_ERROR));
});

//modifiy product information send id name description price image categories[]
router.put('/product', (req, res) => {
	Product.findOne({_id: new ObjectId(req.query._id)},
	(err, product) => {
		if(!err && product){
			console.log(product + ' found.');
			product.name = req.body.name ? req.body.name : product.name;
			product.description = req.body.description ? req.body.description : product.description;
			product.price = req.body.price ? req.body.price : product.price;
			product.image = req.body.image ? req.body.image : product.image;
			product.categories = req.body.categories ? req.body.categories : product.categories;

			product.save((err, obj) => {
				if (!err) {
					console.log(obj.name + ' saved.');
					res.json(obj);
				}  	
			});
		}else res.json(responseError(CLIENT_NOT_FOUND_ERROR))
	});
});

//delete product by id in body
router.delete('/product', (req, res) => {
	var id = new ObjectId(req.query._id);
	Inventory.findOne((err,inventory) =>{
		if(!err && inventory){
			var index = -1;
			inventory.items.forEach((item, i) =>{
				if(item.product == id.toString()){
					index = i;
				}
			});
			if(index > -1){
				inventory.items.splice(index,1);
				inventory.save((err,savedInventory) =>{
					if(!err){
						Product.remove({_id: id}, (err, status) =>{
							if(!err)
								res.json(status);
							else res.json(responseError(err));
						})
					}else res.json(responseError(err));
				})
			}else res.json(responseError(PRODUCT_NOT_FOUND_ERROR))
		}else res.json(responseError(err));
	})	
});

/*************** CLIENT SECTION ***********************/

//get client information send client _id as a parameter
router.get('/client', (req, res) => {
	Client.findOne({_id: new ObjectId(req.query._id)},
	(err, client) => {
		if(!err) console.log(client + ' found.');
		res.json(client);
	});
});

//get all clients
router.get('/clients', (req, res) => {
	Client.find({}, (err, clients) => {
		if(!err) console.log(clients + ' found.');
		res.json(clients);
	});
});

//modifiy client information send client updated information in the body
router.put('/client', (req, res) => {
	Client.findOne({_id: new ObjectId(req.query._id)},
	(err, client) => {
		if(!err && client){			
			client.name = req.body.name ? req.body.name : client.name;
			client.lastName = req.body.lastName ? req.body.lastName : client.lastName;
			client.password = req.body.password ? req.body.password : client.password;
			client.address.street = req.body.street ? req.body.street : client.address.street;
			client.address.postalCode = req.body.postalCode ? req.body.postalCode : client.address.postalCode;
			client.address.number = req.body.number ? req.body.number : client.address.number;
			client.address.state = req.body.state ? req.body.state : client.address.state;
			client.address.city = req.body.city ? req.body.city : client.address.city;
			client.cards = req.body.cards ?req.body.cards : client.cards;
		
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
		}else res.json(responseError(CLIENT_NOT_FOUND_ERROR))
	});
});

//delete client by id in body
router.delete('/client', (req, res) => {
	Client.remove({_id: new ObjectId(req.query._id)},
	(err, obj) => {
		if(!err){			
			res.json(obj);
		}
	});
});


/*************** CART SECTION ***********************/

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

//Clears a client's cart
router.delete('/cart', (req,res) =>{
	var id = req.query._id;
	Client.findOne({_id: id}, (err, client) =>{
		if(!err){
			if(client){
				client.cart = {					
						orders: []						
				};
				client.save((err, savedClient) =>{
					if(!err && savedClient) res.json(savedClient);
					else res.json(responseError("Could not delete client's cart"))
				})
			}else res.json(responseError('Could not found client.'));
		}else res.json(responseError(err));
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
				if(action === "add"){ //add product to client's cart
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
				}
				if(action === "remove"){
					client.cart.orders.forEach((order, index) =>{
						if(order.product == productId.toString()){
							client.cart.orders.splice(index, 1);							
						}						
					})
					client.save((err, savedClient) =>{
							if(!err) res.json(savedClient);
							else res.json(responseError(err));
						})
				}
			}else res.json(responseError(CLIENT_NOT_FOUND_ERROR));			
		})
	}else res.json(responseError(INVALID_PARAMS_ERROR))	
});

/*Represents a sale. Clears client's cart and
updates bought items from Inventory*/
router.post('/checkout', (req,res) =>{
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
							//save inventory TO db
							inventory.save((err, savedInventory) =>{
								//set disccount if needed
								switch (client.boughtItems) {
									case FIRST_DISCOUNT_REQUIREMENT:
										client.cart.discount = FIRST_DISCOUNT;
										break;
									case SECOND_DISCOUNT_REQUIREMENT:
										client.cart.discount = SECOND_DISCOUNT;
										break;
									case THIRD_DISCOUNT_REQUIREMENT:
										client.cart.discount = THIRD_DISCOUNT;
										THIRD_DISCOUNT_REQUIREMENT += THIRD_DISCOUNT_REQUIREMENT;
										break;
									default:																				
										client.cart.discount = 0;
										break;				
								}
								//increase client's bought items field
								client.boughtItems += client.cart.orders.length
								//clear client's cart
								client.cart.orders = [];								
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
