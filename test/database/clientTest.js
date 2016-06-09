var dbUrl    = 'mongodb://localhost/apusbuy';
var should   = require('chai').should();
var mongoose = require('mongoose');
var Client  = require('../../models/client');
var Card = require('../../models/card');
var Product = require('../../models/product');
var ObjectId = mongoose.Schema.Types.ObjectId;
// var clearDB  = require('mocha-mongoose')(dbUrl);

var id;
var card_id;
var client;
var address;

describe("Client Test", function() {
  before((done) =>{
    var address = {
      street: "5th avenue",
      "postalCode": "05061",
      "number": 24,
      "state": "Atizapan",
      "city": "Mexico"
    };
    var card = new Card({
      "number": 5555555555554444,
      "code": 123,
      "expirationDate": "11/17"});

    card.save((err,saved) =>{
      card_id = saved._id;
    });

    var cards = [card];

    client = new Client();
    client.name = "Carlos";
    client.lastName = "Reyna";
    client.email = "carlos.reyna@itesm.mx";
    client.password = "password";
    client.verified = true;
    client.address = address;
    client.cards = cards
    client.cart.discount = 20; 
    done();
  })

  after((done)=>{
    Card.remove({_id: card_id}, (err) =>{
      if(err) return done(err);
      Client.remove({_id: id}, (err) =>{
        if(err) return done(err);
        done();
      })
    })    
  })

  beforeEach(function(done) {
    if (mongoose.connection.db) return done();

    mongoose.connect(dbUrl, done);
  });

  it("Clients can be saved", function(done) {    

    client.save((err,model) =>{
      if(err) return done(err);
      id = model._id;
      done();
    });
  });

  it("Clients can be modified", function(done) {    
    Client.findOne({name: "Carlos"}, (err, storedClient) =>{
      if(err) return done(err);
      //got stored client -> get stored products
      Product.find({}, (err, storedProducts) =>{
        if(err) return done(err);
        //got stored products -> assign them to storedClient's cart orders
        storedProducts.forEach( function(product, i) {
          storedClient.cart.orders.push({product: product, ammount: i+1})
        });
        //update storedClient
        storedClient.save(done);
      })

    })    
  });

  // it("Clients can be listed", function(done) {  
  //   Client.find({}, function(err, docs){
  //     if (err) return done(err);
  //     // console.log(docs);          
      
  //     docs.length.should.equal(1);
  //     done();        
  //   });
  // });

  it("Can fetch clients from DB", (done) =>{
    Client.findOne({name: "Carlos"},(err,document) =>{
      if(err) return done(err);
      document.should.be.an.instanceof(Client);
      done();
    })    
  });

  it("Client has right properties", (done) =>{    
    Client.findOne({name: "Carlos"}, (err,storedClient) =>{
      if(err) return done(err);
      storedClient.should.be.instanceof(Client);
      storedClient.should.have.property('name').and.be.String;
      storedClient.should.have.property('lastName').and.be.String;
      storedClient.should.have.property('email').and.be.String;
      storedClient.should.have.property('verified').and.be.Boolean;
      storedClient.should.have.property('password').and.be.String;
      storedClient.address.should.have.property('street').and.be.String;
      storedClient.address.should.have.property('postalCode').and.be.String;
      storedClient.address.should.have.property('number').and.be.Number;
      storedClient.address.should.have.property('state').and.be.String;
      storedClient.address.should.have.property('city').and.be.String;
      storedClient.should.have.property('cards').and.be.an.instanceof(Array);
      storedClient.should.have.property('cart');
      //Retrive from DB card id to get properties      
      Card.findOne({_id: storedClient.cards[0]}, (err, clientCard)=>{
        if(err) return done(err);        
        clientCard.should.be.instanceof(Card);
        clientCard.should.have.property('expirationDate').and.be.String;        
        done();
      })
            
    })
  });

  
  
});