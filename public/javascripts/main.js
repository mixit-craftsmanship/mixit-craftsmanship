define(['viewModels/home', 'knockout', 'libs/socketIO'], function (vm, ko) {
    return function(){
        ko.applyBindings(vm.create());
    };
});