define(['viewModels/main', 'knockout', 'libs/navigation', 'libs/userVoice', 'libs/googleAnalytics', 'bootstrap', 'twitter'], function (vm, ko, navigation) {
    return function(){
        var mainViewModel = vm.create();
        navigation.initialize(function(viewModel) {
            mainViewModel.changePage(viewModel);
        });
        ko.applyBindings(mainViewModel);
    };
});