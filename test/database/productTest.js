var dbUrl    = 'mongodb://localhost/apusbuy';
var should   = require('chai').should();
var mongoose = require('mongoose');
var Product  = require('../../models/product');
// var clearDB  = require('mocha-mongoose')(dbUrl);

var id;
var product;

describe("Product Test", function() {
  before((done) =>{
    product = new Product();
    product.name = "Overwatch";
    product.description = "El mejor juego ever :D";
    product.price = 699.99;
    product.categories = ["Video Juegos", "PC", "Electrónicos"];
    //Image to be tested...
    done();
  })

  after((done)=>{
    Product.remove({_id: id}, (err) =>{
      if(err) return done(err);
      done();
    })
  })

  beforeEach(function(done) {
    if (mongoose.connection.db) return done();

    mongoose.connect(dbUrl, done);
  });

  it("Products can be saved", function(done) {    

    product.save((err,model) =>{
      id = model._id;
      done();
    });
  });

  it("Products can be listed", function(done) {  
    Product.find({}, function(err, docs){
      if (err) return done(err);
      // console.log(docs);          
      
      docs.length.should.equal(4);
      done();        
    });
  });

  it("Product has right properties", (done) =>{
    product.should.be.instanceof(Product);
    product.should.have.property('name').and.be.String;
    product.should.have.property('description').and.be.String;
    product.should.have.property('price').and.be.Number;
    product.should.have.property('categories').and.be.an.instanceof(Array);
    product.categories.should.be.String;
    done();
  })

  it("Can fetch products from DB", (done) =>{
    Product.findOne({name: "Overwatch"},(err,document) =>{
      if(err) return done(err);
      document.should.be.an.instanceof(Product);
      done();
    })    
  })
  
});