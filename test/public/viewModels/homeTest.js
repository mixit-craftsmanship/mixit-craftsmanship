define(['viewModels/home', 'libs/api'], function(home, api) {
    describe('Home ViewModels', function () {
        it('when starting, should be', function () {
            api.currentTasks = {
                done: function() {
                }
            }
            home.create().waiting().should.equal(true);
        });
    });
});
