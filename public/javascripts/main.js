define(['viewModels/main', 'knockout', 'libs/socketIO'], function (vm, ko) {
    return function(){
        ko.applyBindings(vm.create());
    };
});