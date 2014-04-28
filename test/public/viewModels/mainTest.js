define(['viewModels/main'], function(main) {
    describe('Main ViewModels', function () {
        it('when starting Then CurrentPage should be empty', function () {
            var vm = main.create();

            (vm.currentPage() == undefined).should.be.true;
        });
    });
});