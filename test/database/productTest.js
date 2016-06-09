var dbUrl    = 'mongodb://localhost/apusbuy';
var should   = require('chai').should();
var mongoose = require('mongoose');
var Product  = require('../../models/product');
var clearDB  = require('mocha-mongoose')(dbUrl);


describe("Product Test", function() {
  beforeEach(function(done) {
    if (mongoose.connection.db) return done();

    mongoose.connect(dbUrl, done);
  });

  it("Products can be saved", function(done) {
    var product = new Product();
    product.name = "Overwatch";
    product.description = "El mejor juego ever :D";
    product.price = 699.99;
    product.categories = ["Video Juegos", "PC", "Electrónicos"];
    //Image to be tested...

    product.save(done);
  });

  it("Products an be listed", function(done) {
    new Product({
      name: "Audifonos Bose",
      description: "Excelentes audífonos para uso personal",
      price: 450,
      categories: ["Auidifonos", "Audio"]
    }).save(function(err, model){
      if (err) return done(err);

      new Product({
        name: "Mouse Logitech Inalámbrico",
        description: "Excelente mouse para uso personal",
        price: 200,
        categories: ["Mouse", "Electrónicos", "Computación"]
      }).save(function(err, model){
        if (err) return done(err);

        Product.find({}, function(err, docs){
          if (err) return done(err);
          // console.log(docs);          
          
          docs.length.should.equal(2);
          done();
        });
      });
    });
  });

});