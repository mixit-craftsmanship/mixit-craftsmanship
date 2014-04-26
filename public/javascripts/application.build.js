require.config({
    baseUrl: '',
    paths: {
        knockout: 'empty:',
        jquery: 'empty:',
        socketIO: 'empty:'
    }
});

require(["main"], function(main) {
    main();
});
