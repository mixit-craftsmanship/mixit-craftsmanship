require.config({
    baseUrl: 'javascripts',
    paths: {
        knockout: '/javascripts/knockout.debug',
        jquery: '/javascripts/jquery'
    }
});

require(["viewModels/home", "knockout"], function(vm, ko) {
    ko.applyBindings(vm.create());
});
