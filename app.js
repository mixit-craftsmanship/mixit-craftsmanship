var express = require('express');
var http = require('http');
var path = require('path');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var staticFavicon = require('static-favicon');
var errorHandler = require('errorhandler');
var morgan = require('morgan');
var socketIO = require('socket.io');
var compression = require('compression');

var globalConfiguration = require('./libs/globalConfiguration');
var talksRoute = require('./routes/talks');
var talkVotesRoute = require('./routes/talkVotes');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);

app.use(compression());
app.use(staticFavicon());
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());

var staticFile = function(path){
    return function(req, res, next) {
        if ('GET' != req.method && 'HEAD' != req.method) {
            return next();
        }

        res.sendfile(path);
    };
};

talksRoute.register(app);

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    app.use(errorHandler());

    app.use(express.static(path.join(__dirname, 'public')));

    var staticItems = globalConfiguration.client.getProxyUrlsInDevelopment();
    for(var key in staticItems){
        var item = staticItems[key];
        if(item.file !== undefined){
            app.use(item.url, staticFile(item.file));
        } else {
            app.use(item.url, express.static(item.directory));
        }
    }
} else {
    app.use(express.static(path.join(__dirname, 'publicBuild')));
}


var server = http.createServer(app);
socketIO = socketIO.listen(server);
server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

talkVotesRoute.register(socketIO.sockets);