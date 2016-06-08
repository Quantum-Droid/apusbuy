var dbUrl    = 'mongodb://localhost/apusbuy';
var should   = require('chai').should();
var mongoose = require('mongoose');
var Admin  = require('../../models/admin');
var clearDB  = require('mocha-mongoose')(dbUrl);


describe("Admin Test", function() {
  beforeEach(function(done) {
    if (mongoose.connection.db) return done();

    mongoose.connect(dbUrl, done);
  });

  it("Admins can be saved", function(done) {
    var admin = new Admin();
    admin.name = "Carlos";
    admin.lastName = "Reyna";
    admin.email = "carlos.reyna@itesm.mx";
    admin.password = "password";
    admin.role = "Super User"

    admin.save(done);
  });

  it("Admins have right properties", function(done){
    var admin = new Admin({
      name: "Alex",
      lastName: "Rojas",
      email: "alex.npc@itesm.mx",
      password: "password",
      role: "Recursos Humanos"
      }).save(function(err, model){
        if(err) return done(err);
        
        model.should.be.an.instanceof(Admin);
        model.should.have.property('name');
        model.should.have.property('password');
        model.should.have.property('email');
        model.should.have.property('lastName');
        model.should.have.property('role');
        
        done();

      });
  });

  it("Admins can be listed", function(done) {
    new Admin({
      name: "Alex",
      lastName: "Rojas",
      email: "alex.npc@itesm.mx",
      password: "password",
      role: "Recursos Humanos"
      }).save(function(err, model){
      if (err) return done(err);

      new Admin({
        name: "Diego",
        lastName: "Monroy",
        email: "diego.monroy@itesm.mx",
        password: "password",
        role: "Ventas"
        }).save(function(err, model){
        if (err) return done(err);

        Admin.find({}, function(err, docs){
          if (err) return done(err);

          // without clearing the DB between specs, this would be 3
          docs.length.should.equal(2);
          done();
        });
      });
    });
  });

  it("Can change admins attributes", function(done){
    var admin = new Admin({
      name: "Alex",
      lastName: "Rojas",
      email: "alex.npc@itesm.mx",
      password: "password",
      role: "Recursos Humanos"
      }).save(function(err, model){
        if(err) return done(err);

        //Changing attributes and saving to DB
        model.name = "Carlos";
        model.lastName = "Reyna";
        model. email = "other@email.com";
        model.password = "newPassword";

        model.save((err, savedModel) => {
          //Verify changes in DB
          savedModel.name.should.equal("Carlos");
          savedModel.lastName.should.equal("Reyna");
          savedModel.email.should.equal("other@email.com");
          savedModel.password.should.equal("newPassword");
          done();
        })

        

      })
  });

    

});