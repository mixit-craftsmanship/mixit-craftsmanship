define(['knockout'], function (ko) {
    var viewmodel = function(){
        var self = this;

        self.currentPage = ko.observable();

        self.changePage = function(newPage){
            var oldPage = self.currentPage();
            self.currentPage(newPage);

            if(oldPage && oldPage.dispose) {
                oldPage.dispose();
            }
        };
    };

    return {
        create: function(){
            return new viewmodel();
        }
    };
});
