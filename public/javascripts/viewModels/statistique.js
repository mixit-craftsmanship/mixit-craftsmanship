define(['knockout', 'libs/api', 'libs/chartBinding'], function (ko, api) {
    var viewmodel = function(){
        var self = this;

        self.templateName = "statistiqueTemplate";

        var defaultConfig = {
            commonSeriesSettings: {
                type: 'stackedArea',
                argumentField: 'date'
            },
            title: 'Votes',
            argumentAxis:{
                valueMarginsEnabled: false,
                grid:{ visible: true }
            },
            tooltip:{
                enabled: true
            },
            legend: {
                visible : false
            }
        };

        self.chartOptions = ko.observable();

        api.getStatistiques().done(function(result){
            defaultConfig.dataSource = result.dataSource.map(function(item){
                item.date = new Date(item.date);
                return item;
            });

            defaultConfig.series = result.series.map(function(item){
                return { valueField: item.id, name: item.name};
            });

            self.chartOptions(defaultConfig);
        });
    };

    return {
        create: function(){
            return new viewmodel();
        }
    };
});