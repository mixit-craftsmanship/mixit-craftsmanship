define(['libs/navigation', 'viewModels/home', 'viewModels/about'], function(navigation, homeViewModel, aboutViewModel) {
    describe('Navigation', function () {
        var oldHomeViewModelCreate = homeViewModel.create;
        var oldAboutViewModelCreate = aboutViewModel.create;
        after(function () {
            homeViewModel.create = oldHomeViewModelCreate;
            aboutViewModel.create = oldAboutViewModelCreate;
        });

        before(function(){
            homeViewModel.create = function(){
                return "home";
            };
            aboutViewModel.create = function(){
                return "about";
            };
        });

        var currentPage;
        var setCurrentPage = function(vm){
            currentPage = vm;
        };

        it('when initialize with setCurrentPage Then start Sammy', function () {
            navigation.initialize(setCurrentPage);

            currentPage.should.be.ok;
        });

        it('when initialize and user is on / url Then current page is homeViewModel', function () {
            navigation.initialize(setCurrentPage);

            currentPage.should.be.ok;
            currentPage.should.equal("home");
        });

        it('when initialize and user is on / url Then current url is #/', function () {
            navigation.initialize(setCurrentPage);

            window.location.hash.should.equal("#/");
        });

        it('when initialize and user is on #/ url Then current page is homeViewModel', function () {
            window.location.hash = "#/";

            navigation.initialize(setCurrentPage);

            currentPage.should.be.ok;
            currentPage.should.equal("home");
        });

        it('when initialize and user is on #/about url Then current page is aboutViewModel', function () {
            window.location.hash = "#/about";

            navigation.initialize(setCurrentPage);

            currentPage.should.be.ok;
            currentPage.should.equal("about");
        });

        describe('Given navigation initialized', function () {
            before(function(){
                navigation.initialize(setCurrentPage);
            });

            it('when display home page Then current page is homeViewModel and url is #/', function () {
                window.location.hash = "#/about";

                navigation.displayHomePage();

                currentPage.should.be.ok;
                currentPage.should.equal("home");
                window.location.hash.should.equal("#/");
            });

            it('when display about page Then current page is aboutViewModel and url is #/about', function () {
                window.location.hash = "#/";

                navigation.displayAboutPage();

                currentPage.should.be.ok;
                currentPage.should.equal("about");
                window.location.hash.should.equal("#/about");
            });
        });
    });
});