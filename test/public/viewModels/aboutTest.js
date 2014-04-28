define(['viewModels/about', 'libs/api'], function(aboutViewModel, api) {
    describe('About ViewModel', function () {
        var oldApiApplicationVersion = api.applicationVersion;
        after(function(){
            api.applicationVersion = oldApiApplicationVersion;
        });

        var applicationVersionCallBack;
        before(function(){
            api.applicationVersion = function(){
                return {
                    done: function(callBack) {
                        applicationVersionCallBack = callBack;
                    }
                };
            };
        });

        it('when create Then TemplateName should be aboutTemplate', function () {
            var vm = aboutViewModel.create();

            vm.templateName.should.equal('aboutTemplate');
        });

        it('when create Then applicationVersion is "non déterminée"', function () {
            var vm = aboutViewModel.create();

            vm.applicationVersion().should.equal('non déterminée');
        });

        it('when receive application version Then update applicationVersion', function () {
            var vm = aboutViewModel.create();

            applicationVersionCallBack.should.be.ok;
            applicationVersionCallBack({ applicationVersion: '0.0.2' });

            vm.applicationVersion().should.equal('0.0.2');
        });
    });
});
