define(['knockout', 'viewModels/home'], function (ko, homeVm) {
    var viewmodel = function(){
        var self = this;

        self.currentPage = ko.observable(homeVm.create());
        self.waiting = ko.observable(true);
    };

    return {
        create: function(){
            return new viewmodel();
        }
    };
});
