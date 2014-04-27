define(['viewModels/about'], function(aboutViewModel) {
    describe('About ViewModel', function () {
        it('when create Then TemplateName should be aboutTemplate', function () {
            var vm = aboutViewModel.create();

            vm.templateName.should.equal('aboutTemplate');
        });
    });
});
