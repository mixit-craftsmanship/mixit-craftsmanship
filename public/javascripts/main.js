define(['viewModels/main', 'knockout', 'libs/navigation', 'libs/userVoice'], function (vm, ko, navigation) {
    return function(){
        var mainViewModel = vm.create();
        navigation.initialize(function(viewModel) {
            mainViewModel.currentPage(viewModel);
        });
        ko.applyBindings(mainViewModel);
    };
});