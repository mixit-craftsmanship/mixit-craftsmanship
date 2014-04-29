require.config({
    baseUrl: 'javascripts',
    shim: {
        sammy: {
            deps: ['jquery']
        },
        bootstrap: {
            deps: ['jquery']
        }
    }
});

require(["main"], function(main) {
    main();
});
