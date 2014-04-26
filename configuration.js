var configuration = {
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
    bootstrap: {
        stylesheet: {
            local: 'bower_components/bootstrap/dist/css/bootstrap.css',
            dist: 'http://ajax.aspnetcdn.com/ajax/bootstrap/3.1.1/css/bootstrap.min.css'
        },
        resources: {
            url: 'fonts',
            path: 'bower_components/bootstrap/dist/fonts'
        }
    }
};

exports.configuration = configuration;