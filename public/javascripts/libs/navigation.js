define(['sammy', 'viewModels/home', 'viewModels/about', 'viewModels/talkVote'], function (sammy, homeViewModel, aboutViewModel, talkVoteViewModel) {
    var homeUrl = '#/';
    var aboutUrl = '#/about';
    var talkVoteUrl = '#/talkVote/';

    var routerFactory = function(setCurrentPage, navigation){
        return sammy(function() {
            this.get(homeUrl, function() {
                setCurrentPage(homeViewModel.create(navigation));
            });

            this.get(aboutUrl, function() {
                setCurrentPage(aboutViewModel.create());
            });

            this.get(talkVoteUrl + ":talkId/:talkTitle", function() {
                var params = this.params;
                setCurrentPage(talkVoteViewModel.create(params.talkId, params.talkTitle));
            });
        });
    };

    var changeCurrentUrl = function(url){
        window.location.hash = url;
    };

    var navigation = function(){
        var self = this;

        var router;

        self.initialize = function(setCurrentPage) {
            if(router !== undefined){
                router.unload();
            }

            router = routerFactory(setCurrentPage, self);
            router.run(homeUrl);
        };

        self.displayHomePage = function(){
            changeCurrentUrl(homeUrl);
        };

        self.displayAboutPage = function(){
            changeCurrentUrl(aboutUrl);
        };

        self.displayTalkVotePage = function(talkId, talkTitle){
            var titleEncoded = encodeURIComponent(talkTitle);
            changeCurrentUrl(talkVoteUrl + talkId + "/" + titleEncoded);
        };
    };

    return new navigation();
});
