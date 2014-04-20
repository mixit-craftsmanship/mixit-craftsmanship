require.config({
    baseUrl: '',
    paths: {
        knockout: '//cdnjs.cloudflare.com/ajax/libs/knockout/3.1.0/knockout-min',
        jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min'
    }
});

require(["main"], function(main) {
    main();
});
