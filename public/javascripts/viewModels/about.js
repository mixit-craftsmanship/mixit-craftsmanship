define(function () {
    var viewmodel = function(){
        var self = this;

        self.templateName = "aboutTemplate";
    };

    return {
        create: function(){
            return new viewmodel();
        }
    };
});
