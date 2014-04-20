require.config({
    baseUrl: 'javascripts',
    paths: {
        knockout: '/javascripts/knockout.debug',
        jquery: '/javascripts/jquery'
    }
});

require(["main"], function(main) {
    main();
});
