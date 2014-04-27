define(['viewModels/home', 'libs/api'], function(home, api) {
    describe('Home ViewModels', function () {
        var oldApiCurrentTalks = api.currentTalks;
        after(function(){
            api.currentTalks = oldApiCurrentTalks;
        });

        var currentTalksCallBack;
        before(function(){
            api.currentTalks = function(){
                return {
                    done: function(callBack) {
                        currentTalksCallBack = callBack;
                    }
                };
            };
        });

        it('When create Then template name should be homeTemplate', function () {
            var vm = home.create();

            vm.templateName.should.equal('homeTemplate');
        });

        it('When create Then waiting should be true', function () {
            var vm = home.create();

            vm.waiting().should.be.true;
        });

        it('When create Then get current talks of api', function () {
            var vm = home.create();

            currentTalksCallBack.should.be.ok;
        });

        it('When receive talks Then waiting should be false', function () {
            var vm = home.create();

            currentTalksCallBack();

            vm.waiting().should.be.false;
        });

        it('When receive talks Then populate talks property', function () {
            var vm = home.create();

            currentTalksCallBack([
                {id: 2, title:'Talk A', room:'Room A'},
                {id: 3, title:'Talk B', room:'Room B'}
            ]);

            vm.talks().length.should.equal(2);

            var talk = vm.talks()[0];
            talk.id.should.equal(2);
            talk.title.should.equal('Talk A');

            talk = vm.talks()[1];
            talk.id.should.equal(3);
            talk.title.should.equal('Talk B');
        });

        it('When call select on a talk Then display talkVote page', function () {
            var navigation = {
                displayTalkVotePage: function(id, title){
                    id.should.equal(3);
                    title.should.equal('Talk A');
                }
            };
            var vm = home.create(navigation);
            currentTalksCallBack([{id: 3, title:'Talk A', room:'Room A'}]);

            vm.talks().length.should.equal(1);
            var talk = vm.talks()[0];
            talk.select();
        });
    });
});
