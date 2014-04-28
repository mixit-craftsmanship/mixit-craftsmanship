var votesRepository = require('../libs/votesRepository');

var pushVote = function(talkId, votesNb){
    if(talkId == undefined || votesNb == undefined){
        throw "Invalid talk";
    }

    return votesRepository.pushVotes(talkId, votesNb);
};

exports.register = function(socket){
    socket.on('connection', function (socket) {
        socket.on('vote', function (data) {
            pushVote(+data.talkId, +data.votesNb).catch(function(error){
                console.log(error);
                socket.emit('InvalidTalk');
            });
        });
    });
};
