define(['viewModels/main', 'jquery'], function(main, jquery) {
    jquery.get = function(){
        return {
            done: function(done){
                done([]);
            }
        };
    };

    describe('Main ViewModels', function () {
        it('when starting Then CurrentPage should be Home', function () {
            var vm = main.create();

            var currentPage = vm.currentPage();
            currentPage.should.be.ok;
            currentPage.templateName.should.equal("currentTalksTemplate");
        });
    });
});