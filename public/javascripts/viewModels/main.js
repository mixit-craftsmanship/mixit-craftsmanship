define(['knockout'], function (ko) {
    var viewmodel = function(){
        var self = this;

        self.currentPage = ko.observable();
    };

    return {
        create: function(){
            return new viewmodel();
        }
    };
});
