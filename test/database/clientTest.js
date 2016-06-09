var dbUrl    = 'mongodb://localhost/apusbuy';
var should   = require('chai').should();
var mongoose = require('mongoose');
// var clearDB  = require('mocha-mongoose')(dbUrl);
var ObjectId = mongoose.Schema.Types.ObjectId;
var helper = require('../../helpers/objectGetter');
//models
var Client  = require('../../models/client');
var Card = require(('../../models/card'))
var Product = require('../../models/product');


var address = {
  street: '5th avenue',
  postalCode: 05854,
  number: 21,
  state: 'Atizapan',
  city: 'Mexico'
}
var card_1;
var card_2;
var product_1;
var product_2;
var product_3;


describe("Client Test", function() {

  //Called at the begining of this test suit
  before((done) =>{
    //set cards
    card_1 = new Card();
    card_1.number = 5555555555554444;
    card_1.code = 123;
    card_1.expirationDate = "09/18";

    card_2= new Card();
    card_2.number = 5105105105105100
    card_2.code = 456
    card_2.expirationDate = "12/20"
    
    // set products
    product_1 = new Product();
    product_1.name = "Overwatch";
    product_1.description = "El mejor juego ever :D";
    product_1.price = 699.99;
    product_1.categories = ["Video Juegos", "PC", "Electrónicos"];

    product_2 = new Product({
      name: "Audifonos Bose",
      description: "Excelentes audífonos para uso personal",
      price: 450,
      categories: ["Auidifonos", "Audio"]
      });

    product_3 = new Product({
      name: "Mouse Logitech Inalámbrico",
      description: "Excelente mouse para uso personal",
      price: 200,
      categories: ["Mouse", "Electrónicos", "Computación"]
      });

    done();

  });

  after((done) =>{
    // clearDB(done);
    done();
  })

  

  beforeEach(function(done) { //executed before each test
    // clearDB();
    if (mongoose.connection.db) return done();

    mongoose.connect(dbUrl);  
    //store card 1
    card_1.save((err, model) => {
      if(err) return done(err);
      //store card 2
      card_2.save((err,model) => {
        // store product 1
        product_1.save((err,model) =>{
          if(err) return done(err);
          // store product 2
          product_2.save((err,model) => {
            if(err) return done(err);
            // store product 3
            product_3.save(done);
          })
        })
      });  
    });  
    
  });

  it("Clients can be saved", function(done) {
    var client = new Client();
    client.name = "Carlos";
    client.lastName = "Reyna";
    client.email = "carlos.reyna@itesm.mx";
    client.password = "password";
    client.verified = true;
    client.address = address;
    
    //retriving cards from DB and use them to create a client
    Card.find((err, cards) => {
      if(err) return done(err);
      client.cards = cards
      client.cart.orders.push({product: product_1, ammount: 5});
      client.cart.orders.push({product: product_2, ammount: 1});
      client.cart.orders.push({product: product_3, ammount: 9});
      client.cart.discount = 20;  
      // client.save(done);
      
    })
    done();   
  });

  it("Client have right properties", function(done){
    var client = new Client();
    client.name = "Carlos";
    client.lastName = "Reyna";
    client.email = "carlos.reyna@itesm.mx";
    client.password = "password";
    client.verified = true;
    client.address = address;
    
    //retriving cards from DB and use them to create a client
    Card.find((err, cards) => {
      if(err) return done(err);
      client.cards = cards
      client.cart.orders.push({product: product_1, ammount: 5});
      client.cart.orders.push({product: product_2, ammount: 1});
      client.cart.orders.push({product: product_3, ammount: 9});
      client.cart.discount = 20;  
      client.save((err,model) => {
        if(err) return done(err);
        //Verify properties
        model.should.be.an.instanceof(Client);
        model.should.have.property('name');
        model.should.have.property('password');
        model.should.have.property('email');
        model.should.have.property('lastName');
        model.should.have.property('verified');
        model.should.have.property('address');
        model.should.have.property('cart');        
        model.cart.should.have.property('orders').and.be.an.instanceof(Array);
        model.cart.should.have.property('discount');
        model.cart.orders[0].should.have.property('product');
        model.cart.orders[0].should.have.property('ammount');
        
        done();


      });
      
    })
  });

  it("Can get client's product details", (done) =>{
    var client = new Client();
    client.name = "Carlos";
    client.lastName = "Reyna";
    client.email = "carlos.reyna@itesm.mx";
    client.password = "password";
    client.verified = true;
    client.address = address;
    
    //retriving cards from DB and use them to create a client
    Card.find((err, cards) => {
      if(err) return done(err);
      client.cards = cards
      client.cart.orders.push({product: product_1, ammount: 666});
      client.cart.orders.push({product: product_2, ammount: 1});
      client.cart.orders.push({product: product_3, ammount: 9});
      client.cart.discount = 20;  
      client.save();
      
      console.log(helper.getClientCard(client,null));

      done();
    })
  })



  // it("Clients can be listed", function(done) {
  //   new Client({
  //     name: "Alex",
  //     lastName: "Rojas",
  //     email: "alex.npc@itesm.mx",
  //     password: "password",
  //     role: "Recursos Humanos"
  //     }).save(function(err, model){
  //     if (err) return done(err);

  //     new Client({
  //       name: "Diego",
  //       lastName: "Monroy",
  //       email: "diego.monroy@itesm.mx",
  //       password: "password",
  //       role: "Ventas"
  //       }).save(function(err, model){
  //       if (err) return done(err);

  //       Client.find({}, function(err, docs){
  //         if (err) return done(err);

  //         // without clearing the DB between specs, this would be 3
  //         docs.length.should.equal(2);
  //         done();
  //       });
  //     });
  //   });
  // });

  // it("Can change clients attributes", function(done){
  //   var client = new Client({
  //     name: "Alex",
  //     lastName: "Rojas",
  //     email: "alex.npc@itesm.mx",
  //     password: "password",
  //     role: "Recursos Humanos"
  //     }).save(function(err, model){
  //       if(err) return done(err);

  //       //Changing attributes and saving to DB
  //       model.name = "Carlos";
  //       model.lastName = "Reyna";
  //       model. email = "other@email.com";
  //       model.password = "newPassword";

  //       model.save((err, savedModel) => {
  //         //Verify changes in DB
  //         savedModel.name.should.equal("Carlos");
  //         savedModel.lastName.should.equal("Reyna");
  //         savedModel.email.should.equal("other@email.com");
  //         savedModel.password.should.equal("newPassword");
  //         done();
  //       })

        

  //     })
  // });

    

});