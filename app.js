
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),  
  morgan = require('morgan'),
  routes = require('./routes/index'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('node_modules'));

app.use('/', routes);

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production only
if (env === 'production') {
  // TODO
}


// /**
//  * Routes
//  */

// // serve index and view partials
// app.get('/', routes.index);
// app.get('/partials/:name', routes.partials);

// // JSON API
// app.get('/api/name', api.name);

// // redirect all others to the index (HTML5 history)
// app.get('*', routes.index);





/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
