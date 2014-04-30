define(['knockout', 'libs/chartBinding'], function (ko) {
    var viewmodel = function(){
        var self = this;

        self.templateName = "statistiqueTemplate";

        var dataSource = [
        ];

        var talkIds = [ 1, 2, 3, 4];

        var max = new Date();
//            max.setDate(29);
//            max.setMinutes(0);
//            max.setHours(18);
        var yesterday = new Date();
        yesterday.setDate(29);
        yesterday.setMinutes(0);
        yesterday.setHours(8);
        do{
            yesterday.setMinutes(yesterday.getMinutes() + 20);

            var column = {
                time: new Date(yesterday.getTime())
            };
            for(var key in talkIds){
                column[talkIds[key]] = Math.random() * 10 | 0;
                if(talkIds[key] == 4) column[talkIds[key]] = column[talkIds[key]] * 10;

            }
            dataSource.push(column);
        }while(yesterday<max);

        var series = [
            { valueField: "1", name: "1" },
            { valueField: "2", name: "2" },
            { valueField: "3", name: "3" },
            { valueField: "4", name: "4" }
        ];

        self.dataSource = ko.observableArray(dataSource);
        self.chartOptions = {
            dataSource: dataSource,
            commonSeriesSettings: {
                type: 'stackedArea',
                argumentField: 'time'
            },
            series: series,
            title: 'Votes',
            argumentAxis:{
                valueMarginsEnabled: false,
                grid:{ visible: true }
            },
            legend: {
                verticalAlignment: 'bottom',
                horizontalAlignment: 'center'
            },
            tooltip:{
                enabled: true
            }
        };
    };

    return {
        create: function(){
            return new viewmodel();
        }
    };
});