require.config({
    baseUrl: '',
    paths: {
        knockout: '//cdnjs.cloudflare.com/ajax/libs/knockout/3.1.0/knockout-min',
        jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min',
        socketIO: '//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min'
    }
});

require(["main"], function(main) {
    main();
});
