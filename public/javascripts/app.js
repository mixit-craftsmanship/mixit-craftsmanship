require.config({
    baseUrl: 'javascripts',
    paths: {
        knockout: '/javascripts/knockout-latest.debug',
        jquery: '/javascripts/jquery/dist/jquery'
    }
});

require(["viewModels/home", "knockout"], function(vm, ko) {
    ko.applyBindings(vm.create());
});
