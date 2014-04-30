require.config({
    baseUrl: 'javascripts',
    paths: {
        chart: 'http://cdn3.devexpress.com/jslib/13.2.9/js/dx.chartjs',
        globalize: 'http://ajax.aspnetcdn.com/ajax/globalize/0.1.1/globalize.min'
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
