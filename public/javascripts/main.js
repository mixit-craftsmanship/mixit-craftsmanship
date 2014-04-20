define(['viewModels/home', 'knockout'], function (vm, ko) {
    return function(){
        ko.applyBindings(vm.create());
    };
});