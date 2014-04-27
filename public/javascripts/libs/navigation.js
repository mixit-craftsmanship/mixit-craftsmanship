define(['sammy', 'viewModels/home', 'viewModels/about'], function (sammy, homeViewModel, aboutViewModel) {
    var homeUrl = '#/';
    var aboutUrl = '#/about';

    var setCurrentPage = function(){};
    var navigation;

    var navigationFactory = function(){
        return sammy(function() {
            this.get(homeUrl, function() {
                setCurrentPage(homeViewModel.create());
            });

            this.get(aboutUrl, function() {
                setCurrentPage(aboutViewModel.create());
            });
        });
    };

    var changeCurrentUrl = function(url){
        window.location.hash = url;
    };

    return {
        initialize: function(setCurrentPageFunction) {
            setCurrentPage = setCurrentPageFunction;

            if(navigation !== undefined){
                navigation.unload();
            }

            navigation = navigationFactory();
            navigation.run(homeUrl);
        },
        displayHomePage: function(){
            changeCurrentUrl(homeUrl);
        },
        displayAboutPage: function(){
            changeCurrentUrl(aboutUrl);
        }
    };
});
