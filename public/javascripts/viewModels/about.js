define(['libs/api', 'knockout'], function (api, ko) {
    var viewmodel = function(){
        var self = this;

        self.templateName = "aboutTemplate";

        self.applicationVersion = ko.observable('non déterminée');

        api.applicationVersion().done(function(result){
            self.applicationVersion(result.applicationVersion);
        });
    };

    return {
        create: function(){
            return new viewmodel();
        }
    };
});
