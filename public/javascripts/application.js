require.config({
    baseUrl: 'javascripts',
    shim: {
        sammy: {
            deps: ['jquery']
        }
    }
});

require(["main"], function(main) {
    main();
});
