define(['viewModels/talkVote'], function(talkVote) {
    describe('TalkVote ViewModels', function () {
        it('When create Then template name should be talkVoteTemplate', function () {
            var vm = talkVote.create();

            vm.templateName.should.equal('talkVoteTemplate');
        });

        it('When create Then talkId and talkTitle are populate', function () {
            var vm = talkVote.create(5, 'hello');

            vm.talkId.should.equal(5);
            vm.talkTitle.should.equal('hello');
        });
    });
});