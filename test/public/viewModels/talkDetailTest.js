define(['viewModels/talkDetail', 'libs/api'], function(talkDetail, api) {
    describe('TalkDetail ViewModels', function () {
        var oldApiGetTalk = api.getTalk;
        after(function(){
            api.getTalk = oldApiGetTalk;
        });

        var getTalkCallBack;
        beforeEach(function() {
            api.getTalk = function () {
                return {
                    done: function (callBack) {
                        getTalkCallBack = callBack;
                    }
                };
            }
        });

        describe('When created', function(){
            var vm;
            beforeEach(function() {
                vm = talkDetail.create('1', 'Talk');
            });

            it('should be loading', function(){
                vm.should.have.property('loading');
                vm.loading().should.be.true;
            });

            it('should have template talkDetailTemplate', function(){
                vm.should.have.property('templateName');
                vm.templateName.should.equal('talkDetailTemplate');
            });
        });

        describe('When details loaded', function(){
            var vm;
            before(function(){
                vm = talkDetail.create();
                getTalkCallBack({
                    summary: "Aujourd'hui, tout le monde peut cr",
                    room: "Grand Amphi",
                    start: "2014-04-29T15:00:00.000Z", // 0 minutes important
                    end: "2014-04-29T15:35:00.000Z",
                    speakers: [
                        {
                            firstname: 'joe',
                            lastname: 'jack',
                            image: 'url'
                        }
                    ]
                });
            });

            it('should not be loading anymore', function(){
                vm.loading().should.be.false;
            });

            it('should have details', function(){
                vm.talkSummary().should.be.ok;
                vm.talkRoom().should.be.ok;
                vm.talkSpeakers().should.be.ok;
                vm.talkSpeakers().should.have.length(1);
                vm.talkSpeakers()[0].firstname.should.be.ok;
                vm.talkSpeakers()[0].lastname.should.be.ok;
                vm.talkSpeakers()[0].image.should.be.ok;
            });

            it('should have start and end dates formatted', function(){
                vm.talkHasStartAndEnd().should.be.true;
                vm.talkDay().should.equal('29/4');
                vm.talkStart().should.equal('17:00');
                vm.talkEnd().should.equal('17:35');
            });
        });

        describe('When details loaded for a session with no end, no start', function() {
            var vm;
            before(function () {
                vm = talkDetail.create();
                getTalkCallBack({
                    summary: "Aujourd'hui, tout le monde peut cr",
                    room: "Grand Amphi",
                    speakers: [
                        { }
                    ]
                });
            });

            it('should detect that it has no start, no end date', function () {
                vm.talkHasStartAndEnd().should.be.false;
            });
        });
    });
});