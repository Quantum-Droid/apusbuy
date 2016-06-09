var dbUrl    = 'mongodb://localhost/apusbuy';
var should   = require('chai').should();
var mongoose = require('mongoose');
var Card  = require('../../models/card');

var id;
var card;

describe("Card Test", function() {
  before((done) =>{
    card = new Card();
    card.number = 4012888888881881;
    card.code = 789;
    card.expirationDate = "05/21"
    done();
  })

  after((done)=>{
    Card.remove({_id: id}, (err) =>{
      if(err) return done(err);
      done();
    })
  })

  beforeEach(function(done) {
    if (mongoose.connection.db) return done();

    mongoose.connect(dbUrl, done);
  });

  it("Cards can be saved", function(done) {    

    card.save((err,model) =>{
      id = model._id;
      done();
    });
  });

  it("Cards can be listed", function(done) {  
    Card.find({}, function(err, docs){
      if (err) return done(err);
      // console.log(docs);          
      
      docs.length.should.equal(3);
      done();        
    });
  });

  it("Card has right properties", (done) =>{
    card.should.be.instanceof(Card);
    card.should.have.property('number').and.be.Number        
    card.should.have.property('code').and.be.Number
    card.should.have.property('expirationDate').and.be.String    
    done();
  })

  it("Can fetch cards from DB", (done) =>{
    Card.findOne({code: 123},(err,document) =>{
      if(err) return done(err);
      document.should.be.an.instanceof(Card);
      document.number.should.equal(5555555555554444);
      document.expirationDate.should.equal("11/17");
      done();
    })    
  })
  
});