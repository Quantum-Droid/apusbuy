var dbUrl    = 'mongodb://localhost/apusbuy';
var should   = require('chai').should();
var mongoose = require('mongoose');
var Inventory  = require('../../models/inventory');
var Product  = require('../../models/product');

var id;
var inventory;
var newProduct;

describe("Inventory Test", function() {
  before((done) =>{
    newProduct = new Product();
    newProduct.name = "Test product";
    newProduct.description = "Test description";
    newProduct.price = 280;
    newProduct.categories = ["Test"];

    inventory = new Inventory();
    inventory.items.push({product: newProduct, ammount: 80});
    done();
  })

  after((done)=>{
    Inventory.remove({_id: id}, (err) =>{
      if(err) return done(err);
      done();
    })
  })

  beforeEach(function(done) {
    if (mongoose.connection.db) return done();

    mongoose.connect(dbUrl, done);
  });

  it("Inventorys can be saved", function(done) {    
    newProduct.save((err,model) =>{
      inventory.save((err,model) =>{
        id = model._id;      
        done();
      });
    })    
  });

  it("Inventorys can be listed", function(done) {  
    Inventory.find({}, function(err, docs){
      if (err) return done(err);
      // console.log(docs);          
      
      docs.length.should.equal(2);
      done();        
    });
  });

  it("Inventory has right properties", (done) =>{
    inventory.should.be.instanceof(Inventory);
    inventory.should.have.property('items').and.be.an.instanceof(Array)
    // inventory.items.should.not.be.empty
    inventory.items[0].should.have.property('product').and.be.Number;
    inventory.items[0].should.have.property('ammount').and.be.Number;

    done();
  })

  it("Can fetch inventorys from DB", (done) =>{    
    Inventory.findOne({_id: id},(err,document) =>{
      if(err) return done(err);
      document.should.be.an.instanceof(Inventory);      
      Product.findOne({_id: document.items[0].product}, (err, prod) =>{
        if(err) return done(err);
        prod.should.be.instanceof(Product)
        prod.name.should.equal(newProduct.name)
        prod.categories.should.be.instanceof(Array);
        done();
      });
    })    
  })
  
});