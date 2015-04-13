var libsConfiguration = {
    knockout: {
        javascript: {
            local: 'node_modules/knockout/build/output/knockout-latest.debug.js',
            dist: 'http://cdnjs.cloudflare.com/ajax/libs/knockout/3.1.0/knockout-min.js'
        }
    },
    jquery: {
        javascript: {
            local: 'bower_components/jquery/dist/jquery.js',
            dist: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js'
        }
    },
    socketIO: {
        javascript: {
            local: 'node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js',
            dist: 'http://cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js'
        }
    },
    require: {
        javascript: {
            local: 'node_modules/requirejs/require.js',
            dist: 'http://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.11/require.min.js'
        }
    },
    sammy: {
        javascript: {
            local: 'bower_components/sammy/lib/sammy.js',
            dist: 'http://cdnjs.cloudflare.com/ajax/libs/sammy.js/0.7.4/sammy.min.js'
        }
    },
    bootstrap: {
        javascript: {
            local: 'bower_components/bootstrap/dist/js/bootstrap.js',
            dist: 'http://ajax.aspnetcdn.com/ajax/bootstrap/3.1.1/bootstrap.min.js'
        },
        stylesheet: {
            local: 'bower_components/bootstrap/dist/css/bootstrap.css',
            dist: 'http://ajax.aspnetcdn.com/ajax/bootstrap/3.1.1/css/bootstrap.min.css'
        },
        resources: {
            url: '/fonts',
            path: 'bower_components/bootstrap/dist/fonts'
        }
    },
    twitter: {
        javascript: {
            local: 'javascriptLibs/widgets.js',
            dist: 'http://platform.twitter.com/widgets.js'
        }
    },
    highcharts: {
        javascript: {
            local: 'javascriptLibs/highcharts.src.js',
            dist: 'http://cdnjs.cloudflare.com/ajax/libs/highcharts/4.0.1/highcharts.js'
        }
    }
};

var directoriesConfiguration = {
    public: {
        dev: './public/',
        dist: './publicBuild/'
    }
};

exports.libsConfiguration = libsConfiguration;
exports.directoriesConfiguration = directoriesConfiguration;
exports.version = "0.0.4";
exports.mongoConfiguration = {
    talkVotesCollectionName: 'talkVote2015'
//    uri: 'mongodb://localhost/mixit'
};

exports.statsBeginDate = new Date(2015, 4, 13, 8);
exports.statsEndDate = new Date(2015, 4, 17, 19);
exports.debugVote = false;