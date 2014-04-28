var timer = function(delay, callback){
    var self = this;

    var interval;

    self.start = function(){
        if(interval !== undefined) {
            return;
        }

        interval = setInterval(callback, delay);
    };

    self.stop = function(){
        if(interval === undefined) {
            return;
        }

        clearInterval(interval);
        interval = undefined;
    };

    self.restart = function(){
        self.stop();
        self.start();
    };
};

exports.create = function(delay, callback){
    return new timer(delay, callback);
};