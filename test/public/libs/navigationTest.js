define(['libs/navigation', 'viewModels/home', 'viewModels/about', 'viewModels/talkVote'], function(navigation, homeViewModel, aboutViewModel, talkVoteViewModel) {
    describe('Navigation', function () {
        var oldHomeViewModelCreate = homeViewModel.create;
        var oldAboutViewModelCreate = aboutViewModel.create;
        var oldTalkVoteViewModelCreate = talkVoteViewModel.create;
        after(function () {
            homeViewModel.create = oldHomeViewModelCreate;
            aboutViewModel.create = oldAboutViewModelCreate;
            talkVoteViewModel.create = oldTalkVoteViewModelCreate;
        });

        before(function(){
            homeViewModel.create = function(){
                return "home";
            };
            aboutViewModel.create = function(){
                return "about";
            };
            talkVoteViewModel.create = function(){
                return "talkVote";
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

            it('when display home page Then create homeViewModel with good parameters', function () {
                window.location.hash = "#/about";
                var navigationUsed;
                homeViewModel.create = function(n){
                    navigationUsed = n;
                };

                navigation.displayHomePage();

                navigationUsed.should.equal(navigation);
            });

            it('when display about page Then current page is aboutViewModel and url is #/about', function () {
                window.location.hash = "#/";

                navigation.displayAboutPage();

                currentPage.should.be.ok;
                currentPage.should.equal("about");
                window.location.hash.should.equal("#/about");
            });

            it('when displayTalkVotePage with id 5 and title essai Then current page is talkVoteViewModel and url is #/talkVote/5/essai', function () {
                navigation.displayTalkVotePage(5, 'essai');

                currentPage.should.be.ok;
                currentPage.should.equal("talkVote");
                window.location.hash.should.equal("#/talkVote/5/essai");
            });

            it('when displayTalkVotePage with a title with special char Then escape in url', function () {
                navigation.displayTalkVotePage(5, 'essai essai % ff');

                window.location.hash.should.equal("#/talkVote/5/essai%20essai%20%25%20ff");
            });

            it('when displayTalkVotePage Then create talkVoteViewModel with good parameters', function () {
                var titleUsed;
                var idUsed;
                talkVoteViewModel.create = function(id, title){
                    titleUsed = title;
                    idUsed = id;
                };

                navigation.displayTalkVotePage(5, 'essai');

                idUsed.should.equal('5');
                titleUsed.should.equal('essai');
            });
        });
    });
});