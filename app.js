var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var talks = require('./routes/talks');
var http = require('http');
var path = require('path');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var staticFavicon = require('static-favicon');
var errorhandler = require('errorhandler');
var morgan = require('morgan');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(staticFavicon());
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use("/javascripts", express.static(path.join(__dirname, 'bower_components')));
app.use("/javascripts", express.static(path.join(__dirname, 'node_modules/knockout/build/output')));

// development only
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  app.use(errorhandler());
}

app.get('/users', user.list);
app.get('/api/talks/current', talks.list);

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
