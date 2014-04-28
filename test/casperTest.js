casper.test.begin('Test if can load home', 1, function(test) {
    casper.start('http://mixit-craftsmanship.azurewebsites.net', function() {
        this.waitForSelector('.row button.btn-primary', function() {
            test.assertSelectorHasText('button.btn-primary', 'Crafting Workshop');
        });
    }).run(function() {
        test.done();
    });
});