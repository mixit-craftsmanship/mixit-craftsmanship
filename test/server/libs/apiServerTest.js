var apiServer = require('../../../libs/apiServer');

describe('ApiServer', function() {
    it('When disableCache Then add http headers', function () {
        var headers = [];
        var response = {
            header: function(name, value){
                headers.push({ name: name, value: value });
            }
        };

        apiServer.disableCache(response);

        headers.should.have.length(3);
        headers.should.containEql({ name: "Cache-Control", value: "no-cache, no-store, must-revalidate" });
        headers.should.containEql({ name: "Pragma", value: "no-cache" });
        headers.should.containEql({ name: "Expires", value: 0 });
    });
});