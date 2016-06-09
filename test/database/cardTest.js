var dbUrl    = 'mongodb://localhost/apusbuy';
var should   = require('chai').should();
var mongoose = require('mongoose');
var Card  = require('../../models/card');
var clearDB  = require('mocha-mongoose')(dbUrl);


describe("Card Test", function() {
  beforeEach(function(done) {
    if (mongoose.connection.db) return done();

    mongoose.connect(dbUrl, done);
  });

  it("Cards can be saved", function(done) {
    var card = new Card();
    card.number = 5555555555554444
    card.code = 123
    card.expirationDate = "09/18"    

    card.save(done);
  });

  it("Cards have right properties", function(done){
    var card = new Card();
    card.number = 5555555555554444
    card.code = 123
    card.expirationDate = "09/18"
    card.save(function(err, model){
        if(err) return done(err);
        
        //verify
        model.should.be.an.instanceof(Card);
        model.should.have.property('number');
        model.should.have.property('code');
        model.should.have.property('expirationDate');                
        done();

      });
  });

  it("Cards can be listed", function(done) {
    var card_1 = new Card();
    card_1.number = 5555555555554444
    card_1.code = 123
    card_1.expirationDate = "09/18"
    card_1.save(function(err, model){
      if (err) return done(err);
      //second card
      var card_2 = new Card();
      card_2.number = 5105105105105100
      card_2.code = 456
      card_2.expirationDate = "12/20"
      card_2.save(function(err, model){
        if (err) return done(err);

        Card.find({}, function(err, docs){
          if (err) return done(err);

          // without clearing the DB between specs, this would be 3
          docs.length.should.equal(2);
          done();
        });
      });
    });
  });

  // it("Can change cards attributes", function(done){
  //     var card = new Card();
  //     card.number = 5555555555554444
  //     card.code = 123
  //     card.expirationDate: "09/18"
  //     card.save(function(err, model){
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