require.config({
    baseUrl: 'javascripts',
    paths: {
        knockout: '/javascripts/knockout.debug',
        jquery: '/javascripts/jquery',
        socketIO: '/javascripts/socket.io'
    }
});

require(["main"], function(main) {
    main();
});
