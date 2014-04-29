var express = require('express');
var http = require('http');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var staticFavicon = require('static-favicon');
var morgan = require('morgan');
var socketIO = require('socket.io');
var compression = require('compression');

var staticFilesRoute = require('./routes/staticFiles');
var talksRoute = require('./routes/talks');
var talkVotesRoute = require('./routes/talkVotes');
var applicationVersionRoute = require('./routes/applicationVersion');
var votesStore = require('./libs/votesStore');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);

app.use(compression());
app.use(staticFavicon());
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());

var env = process.env.NODE_ENV || 'development';

talksRoute.register(app);
applicationVersionRoute.register(app);
staticFilesRoute.register(app, 'development' == env);

var server = http.createServer(app);
socketIO = socketIO.listen(server);
server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

talkVotesRoute.register(socketIO.sockets);

if(process.env.MONGO_MIXIT){
    votesStore.configuration(process.env.MONGO_MIXIT);
}