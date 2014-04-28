define(['viewModels/main'], function(main) {
    describe('Main ViewModels', function () {
        it('When starting Then CurrentPage should be empty', function () {
            var vm = main.create();

            (vm.currentPage() == undefined).should.be.true;
        });

        it('When change page Then update CurrentPage', function () {
            var vm = main.create();

            vm.changePage({ page:'hello' });

            vm.currentPage().should.eql({ page:'hello' });
        });

        it('Given old page with dispose method When change page Then call dispose method', function () {
            var vm = main.create();
            var disposeCalled = false;
            vm.changePage({
                page:'hello',
                dispose: function(){
                    disposeCalled = true;
                }
            });

            vm.changePage({ page:'hello2' });

            vm.currentPage().should.eql({ page:'hello2' });
            disposeCalled.should.be.true;
        });

        it('Given old page without dispose method When change page Then update current page without error', function () {
            var vm = main.create();
            vm.changePage({ page:'hello' });

            vm.changePage({ page:'hello2' });

            vm.currentPage().should.eql({ page:'hello2' });
        });
    });
});