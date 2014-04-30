require.config({
    baseUrl: '',
    paths: {
        knockout: '//cdnjs.cloudflare.com/ajax/libs/knockout/3.1.0/knockout-min',
        jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min',
        socketIO: '//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min',
        sammy: '//cdnjs.cloudflare.com/ajax/libs/sammy.js/0.7.4/sammy.min',
        bootstrap: 'http://ajax.aspnetcdn.com/ajax/bootstrap/3.1.1/bootstrap.min',
        chart: 'http://cdn3.devexpress.com/jslib/13.2.9/js/dx.chartjs',
        globalize: 'http://ajax.aspnetcdn.com/ajax/globalize/0.1.1/globalize.min',
        twitter: '//platform.twitter.com/widgets'
    },
    shim: {
        sammy: {
            deps: ['jquery']
        },
        bootstrap: {
            deps: ['jquery']
        },
        chart: {
            deps: ['jquery', 'globalize']
        },
        globalize: {
            deps: ['jquery']
        }
    }
});

require(["main"], function(main) {
    main();
});
