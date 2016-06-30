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
var Sale = require('../models/sale');

const CLIENT_NOT_FOUND_ERROR = "Could not find client in the DB.";
const PRODUCT_NOT_FOUND_ERROR = "Could not find product in the DB."
const INVENTORY_NOT_FOUND_ERROR = "Could not fund inventory in the DB."
const ADMIN_NOT_FOUND_ERROR = "Could not find admin in the DB."
const INVALID_PARAMS_ERROR = "Invalid parameters."
const SESSION_NOT_FOUND_ERROR = "No session found"
const UNSUPPORTED_ACTION_ERROR = "Unsupported action."
const ELEMENT_NOT_SAVED_ERROR = "Element could not be saved in the DB."
const FIRST_DISCOUNT = 10; //10% discount
const FIRST_DISCOUNT_REQUIREMENT = 5; //5 bought items needed for first discount
const SECOND_DISCOUNT = 20;//20% discount
const SECOND_DISCOUNT_REQUIREMENT = 10;//10 bought items needed for first discount
const THIRD_DISCOUNT = 30; //30% discount
var THIRD_DISCOUNT_REQUIREMENT = 20; //20 bought items needed for first discount

const SU_ROLE = "Super User";
const VENTAS_ROLE = "Ventas";
const RH_ROLE = "Recursos Humanos"

const MAX_BEST_SELLERS = 10;

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
		html: '<a href=http://localhost:3000/api/verify?code='+id+'>Click to verify your account.</a>'

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

/*
* Returns the value associated with each role
* SU = 2
* RH = 1
* Ventas = 0
*/
function getRolePriority (role) {
	 switch (role) {
	 	case SU_ROLE:
	 		return 2;	
 		case RH_ROLE:
 			return 1;
 		case VENTAS_ROLE:
 			return 0 		
	 	default:
	 		return -1;	 		
	 }
}

/*
* Return if an admin modification is posible
*/
function canModify(modifier, modified) {
		if(modifier && modified){
			modifier = getRolePriority(modifier);
			modified = getRolePriority(modified);
			return modifier > modified;
		}
		return false;
}

/*************** LOGIN / REGISTER SECTION **************/
//send id written by the user in the body
router.get('/verify',(req, res) => {
	Client.findOne({_id: new ObjectId(req.query.code)},
	(err, client) => {
		if(!err && client){
			client.name = client.name;
			client.lastName = client.lastName;
			client.birthdate = client.birthdate;
			client.email = client.email;
			client.verified = true;
			client.password = client.password;
			client.address = client.address;
			client.cards = client.cards;
			client.cart = client.cart;
			client.boughtItems = client.bought
			client.save((err, obj) => {
				if (!err) {
					console.log(obj.name + ' saved.');
					res.redirect('/')
					//return res.json(obj);
				}  	
  		});
		}else return res.json(responseError(CLIENT_NOT_FOUND_ERROR));
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
	client.birthdate = req.body.birthdate;
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
  	if (!err && obj) {
  		console.log(obj.name + ' saved.');
  		sendVerification(obj._id, obj.email);
  		res.redirect('/api/clientLogin?_id='+obj._id);
  	}else return res.json(responseError(ELEMENT_NOT_SAVED_ERROR))
  }); 
});

//client login send emal and password in the body
router.get('/clientLogin', (req, res) => {
	var id = new ObjectId(req.query._id);
	Client.findOne({_id: id}, (err, client) => {
		if(!err && client){
			console.log('found.');
			req.session.id = client._id;
			console.log(req.session.id);
			return res.json(client);
		}else return res.json(responseError(CLIENT_NOT_FOUND_ERROR))
	});
});

router.post('/clientLogin', (req, res) => {
	Client.findOne(
		{email: req.param('email'), 
		password: req.body.password}, 
	(err, client) => {
		if(!err && client){
			console.log('found.');
			req.session.id = client._id;
			return res.json(client);
		}else return res.json(responseError(CLIENT_NOT_FOUND_ERROR))
	});	
});

/*
* Logs the user out by destroying the cookie
*/
router.get('/logout', (req,res) =>{
	req.session = null;
	return res.json(true)
})

/*
* Returns the current logged in user (client/admin)
*/
router.get('/current', (req,res) =>{
	var id = req.session.id;
	var role = req.session.role;
	if(id){
		id = new ObjectId(id);
		if(role){ //admin
			Admin.findOne({_id: id}, (err, admin) =>{
				if(!err && admin)
					return res.json({user: admin, admin: true});
				else return res.json({user: false});
			})
		}else{//client
			Client.findOne({_id: id}, (err, client) =>{
				if(!err && client)
					return res.json({user: client, admin: false})
				else return res.json({user: false});
			})
		}
	}else return res.json({user: false});
})

//admin login send email and password in the body
router.post('/adminLogin', (req, res) => {
	Admin.findOne(
		{email: req.body.email, 
		password: req.body.password}, 
	(err, admin) => {
		if(!err && admin){
			console.log('Admin found');
			req.session.id = admin._id;
			req.session.role = admin.role
			return res.json(admin);
		}else return res.json(responseError(ADMIN_NOT_FOUND_ERROR))				
	});	
});

/*************** CLIENT SECTION ***********************/

//get client information send client _id as a parameter
router.get('/client', (req, res) => {
	var id = req.session.id;
	if(id){
		id = new ObjectId(id);
		Client.findOne({_id: id},	(err, client) => {
			if(!err)
				return res.json(client);
			else
				return res.json(responseError(CLIENT_NOT_FOUND_ERROR));
		});
	}else return res.json(responseError(SESSION_NOT_FOUND_ERROR));	
});

//get all clients
router.get('/clients', (req, res) => {
	var fields = Object.keys(req.query);
	if(validParams(req.query) && fields.length){
		var searchBy = fields[0];
		var field = req.query[fields];
		var search = {};				
		search[searchBy] = searchBy === "_id" ? field : new RegExp('^' + field + '$', "i");
		Client.find(search,(err,clients) =>{
			return res.json(clients ? clients.length : 0);
		})
	}else{
		Client.find({}, (err, clients) => {
			return res.json(clients ? clients.length : 0);
		});
	}	
});

//modifiy client information send client updated information in the body
router.put('/client', (req, res) => {
	var id = req.session.id;
	if(id){
		id = new ObjectId(id);
		Client.findOne({_id: id},(err, client) => {
		if(!err && client){		
			client.name = req.body.name ? req.body.name : client.name;
			client.lastName = req.body.lastName ? req.body.lastName : client.lastName;
			client.birthdate = req.body.birthdate ? req.body.birthdate : client.birthdate;
			client.password = req.body.password ? req.body.password : client.password;
			client.address.street = req.body.street ? req.body.street : client.address.street;
			client.address.postalCode = req.body.postalCode ? req.body.postalCode : client.address.postalCode;
			client.address.number = req.body.number ? req.body.number : client.address.number;
			client.address.state = req.body.state ? req.body.state : client.address.state;
			client.address.city = req.body.city ? req.body.city : client.address.city;
			client.cards = req.body.cards ?req.body.cards : client.cards;
			client.cart = client.cart;
			client.boughtItems = client.boughtItems;

			if(client.email !== req.body.email){
				client.verified = false;
				client.email = req.body.email;
				console.log(client.name + " needs to verify at " + client.email);
				sendVerification(client._id, client.email);
			}

			client.save((err, obj) => {
				if (!err && obj) {
					console.log(obj.name + ' saved.');  		
					sendVerification();
					return res.json(obj);
				}else return res.json(responseError(ELEMENT_NOT_SAVED_ERROR));
			});
		}else return res.json(responseError(CLIENT_NOT_FOUND_ERROR))
	});
	}else return res.json(responseError(SESSION_NOT_FOUND_ERROR));	
});

/*
* Delete client by id
* ADMIN SESSION WITH SUPER_USER ROLE CAN DELETE ANYONE
*/
router.delete('/client', (req, res) => {
	var id = req.query._id;
	var role = req.session.role;	
	//admin trying to delete user
	if(role === SU_ROLE){
		id = new ObjectId(id);
		Client.remove({_id: id},(err, obj) => {			
				return res.json(obj);			
		});	
	}else return res.json(responseError(UNSUPPORTED_ACTION_ERROR));

	//Client trying to delete client
	if(req.session.id && !role){
		console.log("no role")
		id = new ObjectId(req.session.id);		
		Client.remove({_id: id},(err, obj) => {	
				req.session = null;
				return res.json(obj);			
		});	

	}else return res.json(responseError(SESSION_NOT_FOUND_ERROR));
});


/*************** ADMIN SECTION ***********************/

/*
* Get admin information based on the specified parameter
*/
router.get('/admin', (req, res) => {
	if(req.session.id && getRolePriority(req.session.role) > 0){
		var fields = Object.keys(req.query);		
		if(validParams(req.query) && fields.length){
					var searchBy = fields[0];
					var field = req.query[fields];
					var search = {};
					search[searchBy] = searchBy === "_id" ? field : new RegExp('^' + field + '$', "i");
					console.log(search);
					Admin.findOne(search, (err, admin) =>{
						if(!err)
							return res.json(admin)
						else return res.json(responseError(ADMIN_NOT_FOUND_ERROR))
					})
		}else return res.json(responseError(INVALID_PARAMS_ERROR));
	}else res.json(responseError(UNSUPPORTED_ACTION_ERROR))	;
});

/*
* Create account for the different managment roles
* send name, lastname, email password and role in hte body
*/
router.post('/admin', (req, res) => {	
	var admin = new Admin();
  admin.name = req.body.name;
  admin.lastName = req.body.lastName;
  admin.email = req.body.email;
  admin.password = req.body.password;
  admin.role = req.body.role
  if(req.session.id && req.session.role === SU_ROLE){
  	admin.save((err, obj) => {
  	if (!err && obj) {
  		console.log(obj.name + ' saved as admin.');  		
  		return res.json(obj);
  	}else return res.json(responseError(ELEMENT_NOT_SAVED_ERROR))
  }); 
  } else return res.json(responseError(UNSUPPORTED_ACTION_ERROR)) ;
});

/*
* Get all admins by search field
* If no field is specified, all admins are retrived
*/
router.get('/admins', (req, res) => {
	if(req.session.id && getRolePriority(req.session.role) > 0){
		var fields = Object.keys(req.query);
		if(validParams(req.query) && fields.length){
			var searchBy = fields[0];
			var field = req.query[fields];
			var search = {};
			search[searchBy] = new RegExp('^' + field + '$', "i");
			Admin.find(search, (err, admins) =>{
				if(!err)
					return res.json(admins)
				else return res.json(responseError(ADMIN_NOT_FOUND_ERROR))
			})
		}else{
			//Return all admins in DB
			Admin.find({}, (err, admins) => {
				if(!err)
					return res.json(admins);
				else
					return res.json(responseError(ADMIN_NOT_FOUND_ERROR))
			});
		}
	}else return res.json(responseError(UNSUPPORTED_ACTION_ERROR));
});

/*
* Modifiy admin information send admin updated information in the body
*/
router.put('/admin', (req, res) => {	
	if(req.session.id && getRolePriority(req.session.role) > 0){
		if(validParams(req.query)){
			Admin.findOne({_id: new ObjectId(req.query._id)},
			(err, admin) => {
				if(!err && admin){				
					admin.name = req.body.name ? req.body.name : admin.name;
					admin.lastName = req.body.lastName ? req.body.lastName : admin.lastName;
					admin.email = req.body.email ? req.body.email : admin.email;
					admin.password = req.body.password ? req.body.password : admin.password;
					admin.role = req.body.role ? req.body.role : admin.role;
					admin.save((err, obj) => {
						if (!err && obj) {						
							return res.json(obj);
						}else return res.json(responseError(ELEMENT_NOT_SAVED_ERROR));
					});
				}else return res.json(responseError(ADMIN_NOT_FOUND_ERROR));
			});
		}else return res.json(responseError(INVALID_PARAMS_ERROR));
	}else return res.json(responseError(UNSUPPORTED_ACTION_ERROR))
});

//delete admin by id in body
router.delete('/admin', (req, res) => {
	var role = req.session.role;
	var id = req.session.id;
	var toRemove = req.query._id;
	if(id && getRolePriority(role) > 0){
		if(toRemove){
			toRemove = new ObjectId(toRemove);
			Admin.findOne({_id: toRemove}, (err, admin) =>{
				if(!err && admin){
					var removedRole = admin.role;
					if(canModify(role,removedRole)){
						Admin.remove({_id: toRemove}, (err, status) =>{
							if(status)
								return res.json(status)
							else return res.json(ELEMENT_NOT_SAVED_ERROR)
						})
					}else return res.json(responseError(UNSUPPORTED_ACTION_ERROR))
				}else return res.json(responseError(ADMIN_NOT_FOUND_ERROR));
			})
		}else return res.json(responseError(INVALID_PARAMS_ERROR));
	}else return res.json(responseError(UNSUPPORTED_ACTION_ERROR));
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
  var amount = req.body.amount;

  product.save((err, p) => {
  	if (!err) {  		
  		Inventory.findOne((err, inventory) =>{
  			if(!err && inventory){
  				inventory.items.push({product: p, amount: amount})
  				inventory.save((err,savedInventory) =>{
  					if(!err)
  						return res.json(p);
  					else return res.json(responseError(ELEMENT_NOT_SAVED_ERROR))
  				})
  			}else return res.json(responseError(INVENTORY_NOT_FOUND_ERROR));
  		})
  	}else return res.json(responseError(ELEMENT_NOT_SAVED_ERROR));
  }); 
});

/*
* Get product specific information
*/
router.get('/product', (req, res) => {
	Product.findOne({_id: new ObjectId(req.query._id)},
	(err, product) => {
		if(!err)
			return res.json(product);
		else return res.json(responseError(PRODUCT_NOT_FOUND_ERROR));
	});
});

/*
* Get all products by category.
* if no category is specified, returns all products in DB
*/
router.get('/products', (req, res) => {	
	var fields = Object.keys(req.query);
	if(validParams(req.query) && fields.length){
		var searchBy = fields[0];
		var field = req.query[fields];
		var search = {};				
		search[searchBy] = searchBy === "price" ? field|0 : new RegExp('^' + field + '$', "i");
		Product.find(search, (err,products) =>{
			if(!err)
				return res.json(products);
			else return res.json(responseError(PRODUCT_NOT_FOUND_ERROR));
		})
	}else{
		//Return all products in DB
		Product.find({}, (err, prods) =>{
			if(!err)
				return res.json(prods);
			else return res.json(responseError(PRODUCT_NOT_FOUND_ERROR))
		})
	}
});

//modifiy product information send id name description price image categories[]
router.put('/product', (req, res) => {
	var id = req.query._id;
	if(id && validParams(req.body)){
		id = new ObjectId(id);
		Product.findOne({_id: id},(err, product) => {
			if(!err && product){
				console.log(product + ' found.');
				product.name = req.body.name ? req.body.name : product.name;
				product.description = req.body.description ? req.body.description : product.description;
				product.price = req.body.price ? req.body.price : product.price;
				product.image = req.body.image ? req.body.image : product.image;
				product.categories = req.body.categories ? req.body.categories : product.categories;

				product.save((err, obj) => {
					if (!err) {						
						return res.json(obj);
					}else return res.json(ELEMENT_NOT_SAVED_ERROR);
				});
			}else return res.json(responseError(PRODUCT_NOT_FOUND_ERROR))
		});
	}else return res.json(responseError(INVALID_PARAMS_ERROR));	
});

//delete product by id in body
router.delete('/product', (req, res) => {
	var id = req.query._id;
	if(id){
		id = new ObjectId(id);
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
									return res.json(status);
								else return res.json(responseError(ELEMENT_NOT_SAVED_ERROR));
							})
						}else return res.json(responseError(ELEMENT_NOT_SAVED_ERROR));
					})
				}else return res.json(responseError(PRODUCT_NOT_FOUND_ERROR))
			}else return res.json(responseError(INVENTORY_NOT_FOUND_ERROR));
		})
	}else return res.json(responseError(INVALID_PARAMS_ERROR));		
});

/*************** CART SECTION ***********************/
//get client cart
router.get('/cart', (req,res) =>{
	var id = req.session.id
	if(id){
		id = new ObjectId(id);
		Client.findOne({_id: id}).exec((err,client) =>{
			Client.populate(client,'cart.orders.product', (err,doc) =>{
				return res.json(doc.cart)
			})
		})
	}else return res.json(responseError(SESSION_NOT_FOUND_ERROR));
});

//Clears a client's cart
router.delete('/cart', (req,res) =>{
	var id = req.session.id;
	if(id){
		id = new ObjectId(id);
		Client.findOne({_id: id}, (err, client) =>{
		if(!err && client){			
			client.cart = {					
					orders: []						
			};
			client.save((err, savedClient) =>{
				if(!err && savedClient) 
					return res.json(savedClient);
				else 
					return res.json(responseError("Could not delete client's cart"))
			})		
		}else return res.json(responseError(CLIENT_NOT_FOUND_ERROR));
	})
	}else return res.json(responseError(SESSION_NOT_FOUND_ERROR));
});

//add or remove products to/from client's cart
router.put('/cart', (req,res) =>{
	var id = req.session.id;
	if(id){
		if(validParams(req.body)){
			id = ObjectId(id);
			var productId = ObjectId(req.body.product);
			var amount = req.body.amount;
			var action = req.body.action;	
			Client.findOne(id,(err, client) =>{ //get client from DB			
				if(!err && client){ //client found
					if(action === "add"){ //add product to client's cart
						Product.findOne(productId, (err, product) =>{ //get product from DB
							if(!err && product){ //product found
								client.cart.orders.push({"product": product, "amount": amount});
								client.save((err, savedClient) =>{ //update client in DB.
									if(!err){
										return res.json(savedClient);
									}else return res.json(responseError(ELEMENT_NOT_SAVED_ERROR));
								})
							}else return res.json(responseError(PRODUCT_NOT_FOUND_ERROR));
						})
					}else	if(action === "remove"){
						client.cart.orders.forEach((order, index) =>{
							if(order.product == productId.toString()){
								client.cart.orders.splice(index, 1);							
							}						
						})
						client.save((err, savedClient) =>{
								if(!err) return res.json(savedClient);
								else return res.json(responseError(err));
							})
					}else return res.json(responseError(UNSUPPORTED_ACTION_ERROR));
				}else return res.json(responseError(CLIENT_NOT_FOUND_ERROR));			
			})
		}else return res.json(responseError(INVALID_PARAMS_ERROR))	
	}else return res.json(responseError(SESSION_NOT_FOUND_ERROR));
});

/*Represents a sale. Clears client's cart and
updates bought items from Inventory*/
router.post('/checkout', (req,res) =>{
	var id = req.session.id;
	if(id){		
		id = new ObjectId(id);		
		Client.findOne({_id: id}, (err, client) =>{
			if(!err && client){ //no error
				if(client.verified){
					Inventory.findOne((err,inventory) =>{ //get inventory
						if(!err && inventory){
							//Search products in inventory
							for (var i = inventory.items.length - 1; i >= 0; i--) {
								for (var j = client.cart.orders.length - 1; j >= 0; j--) {									
									if(inventory.items[i].product.toString() === 
										client.cart.orders[j].product.toString()){
										//found product in inventory -> update amounts available										
										inventory.items[i].amount -= client.cart.orders[j].amount;																												
									}
								}	
							}
							//save inventory To db
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
									if(!err) return res.json(savedClient);
								})
							})
						}else return res.json(responseError(INVENTORY_NOT_FOUND_ERROR))
					})
				}else return res.json(responseError(UNSUPPORTED_ACTION_ERROR))	;
			}else return res.json(responseError(CLIENT_NOT_FOUND_ERROR));				
		});		
	}else return res.json(SESSION_NOT_FOUND_ERROR);
});

/*************** INVENTORY SECTION *******************/

/*
* Returns the amount of a product
* available in the inventory
*/
router.get('/inventory', (req,res) =>{
	var id = req.query._id;
	if(id){
		id = new ObjectId(id);		
		Inventory.findOne((err,inventory) =>{
			if(!err && inventory){				
				var amount = -1;
				inventory.items.forEach((item) =>{
					if(item.product.toString() === id.toString()){
						amount = item.ammount
					}
				})				
				return res.json(amount)
			}else return res.json("err");
		})
	}else return res.json("wtf");
})

/***************** SALES SECTION *********************/

/*
* Add a sale to the database, needs productId and amount
*/
router.post('/sale', (req,res)=>{
	var sale = new Sale();
	sale.product = req.body.product;
	sale.amount = req.body.amount;

	sale.save((err, obj) => {
  	if (!err && obj) {
  		console.log(obj.product + ' saved.');
			return res.json(obj);
  	}else return res.json(responseError(ELEMENT_NOT_SAVED_ERROR));
  });
});

/***************** CHART SECTION *********************/

function compareSales(sale1, sale2){
	if(sale1.amount < sale2.amount) return 1;
	if(sale1.amount > sale2.amount) return -1;
	return 0;
}

/*
* Return the 10 best sellers
*/
router.get('/bestSellers', (req,res)=>{
	var bestSellers = {};
	var bestSellersData = [];
	var bestSellersLabels = [];
	var bstTmp = [];
	Sale.find({}, (err, sales)=>{
		if(!err && sales){
			Sale.populate(sales,'product', (err, docs) =>{
				if(!err && docs){
					for(var i in docs){
						if(bestSellers[docs[i].product.name] !== undefined){
							bestSellers[docs[i].product.name] += docs[i].amount;
						}else{
							bestSellers[docs[i].product.name] = docs[i].amount;
						}
					}
					for(var i in bestSellers){
						bstTmp.push({name: i, amount: bestSellers[i]});
					}
					bstTmp.sort(compareSales);
					for(var i in bstTmp){
						if(i >= MAX_BEST_SELLERS){
							break;
						}
						bestSellersLabels.push(bstTmp[i].name);
						bestSellersData.push(bstTmp[i].amount);
					}
					return res.json({bestSellersData: bestSellersData, bestSellersLabels: bestSellersLabels});
				}else{
					return res.json(null);
				}
			});
		}else{
			return res.json(null);
		}
	});
});

/*
* Returns the amount of sales per hour
*/
router.get('/salesPerHour', (req, res)=>{
	var salesPerHour = [0,0,0,0,0,0,
											0,0,0,0,0,0,
											0,0,0,0,0,0,
											0,0,0,0,0,0];
	Sale.find({}, (err, sales)=>{
		if(!err && sales){
			console.log("Now "+new Date());
			for(var i in sales){
				salesPerHour[new Date(sales[i].createdAt).getHours()] += 1;
			}
			return res.json({salesPerHourData: salesPerHour});
		}else{
			return res.json(null);
		}
	});
});

/*
* Get age like "YYYY/MM/DD"
*/
function getAge(dateString) {
	var today = new Date();
	var birthDate = new Date(dateString);
	var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

/*
* Returns the amount of users in all the age age ranges 
*/
router.get('/ageRanges', (req,res)=>{
	var userInAgeRanges = {ageRangeData: [0,0,0,0,0,0,0,0,0]};
	Client.find({}, (err, clients) => {
		if(!err && clients){
			for(var i in clients){
				var age = getAge(clients[i].birthdate);
				if(0 < age && age <= 12){
					userInAgeRanges.ageRangeData[0]++;
				}else if(12 < age && age <= 17){
					userInAgeRanges.ageRangeData[1]++;
				}else if(17 < age && age <= 24){
					userInAgeRanges.ageRangeData[2]++;
				}else if(24 < age && age <= 34){
					userInAgeRanges.ageRangeData[3]++;
				}else if(34 < age && age <= 44){
					userInAgeRanges.ageRangeData[4]++;
				}else if(44 < age && age <= 54){
					userInAgeRanges.ageRangeData[5]++;
				}else if(54 < age && age <= 64){
					userInAgeRanges.ageRangeData[6]++;
				}else if(64 < age && age <= 74){
					userInAgeRanges.ageRangeData[7]++;
				}else if(74 < age){
					userInAgeRanges.ageRangeData[8]++;
				}
			}
			return res.json(userInAgeRanges);
		}else{
			return res.json(userInAgeRanges);
		}
		
	});
});







