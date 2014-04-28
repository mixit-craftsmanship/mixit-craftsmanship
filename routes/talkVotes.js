var votesRepository = require('../libs/votesRepository');

var pushVote = function(talkId, votesNb){
    if(!talkId || !votesNb){
        return {
            catch: function(callback){
                callback('Invalid talk');
            }
        };
    }

    return votesRepository.pushVotes(talkId, votesNb);
};

exports.register = function(socket){
    socket.on('connection', function (socket) {
        socket.on('vote', function (data) {
            pushVote(+data.talkId, +data.votesNb).catch(function(error){
                socket.emit('InvalidTalk');
            });
        });
    });
};
