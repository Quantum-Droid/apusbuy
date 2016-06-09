var dbUrl    = 'mongodb://localhost/apusbuy';
var should   = require('chai').should();
var mongoose = require('mongoose');
var Admin  = require('../../models/admin');

var id;
var admin;

describe("Admin Test", function() {
  before((done) =>{
    admin = new Admin();
    admin.name = "Test Name";
    admin.lastName = "Test Last Name"
    admin.email = "test@test.com"
    admin.role = "Ventas"    
    done();
  })

  after((done)=>{
    Admin.remove({_id: id}, (err) =>{
      if(err) return done(err);
      done();
    })
  })

  beforeEach(function(done) {
    if (mongoose.connection.db) return done();

    mongoose.connect(dbUrl, done);
  });

  it("Admins can be saved", function(done) {    

    admin.save((err,model) =>{
      id = model._id;
      done();
    });
  });

  it("Admins can be listed", function(done) {  
    Admin.find({}, function(err, docs){
      if (err) return done(err);
      // console.log(docs);          
      
      docs.length.should.equal(4);
      done();        
    });
  });

  it("Admin has right properties", (done) =>{
    admin.should.be.instanceof(Admin);
    admin.should.have.property('name').and.be.String;
    admin.should.have.property('lastName').and.be.String;
    admin.should.have.property('email').and.be.String
    admin.should.have.property('password').and.be.String
    admin.should.have.property('role').and.be.String    
    done();
  })

  it("Can fetch admins from DB", (done) =>{
    Admin.findOne({name: "Carlos"},(err,document) =>{
      if(err) return done(err);
      document.should.be.an.instanceof(Admin);
      document.name.should.equal("Carlos");
      document.lastName.should.equal("Reyna");
      done();
    })    
  })
  
});