define(['knockout', 'libs/api', 'libs/chartBinding'], function (ko, api) {
    var viewmodel = function(){
        var self = this;

        self.templateName = "statistiqueTemplate";

        var defaultConfig = {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Votes'
            },
            xAxis: {
                tickInterval: 6,
                categories: [],
                labels: {
                    formatter: function() {
                        return 'Le ' + this.value.getDate() + ' à ' + this.value.getHours() + 'h';
                    }
                }
            },
            yAxis: {
                max: 300,
                title: 'Nb. votes'
            },
            tooltip: {
                formatter: function() {
                    var date = this.x;
                    var content = '<span style="font-size: 10px">Le ' + date.getDate() + ' à ' + date.getHours()+'H' + date.getMinutes() + '</span><br/>';

                    this.points.forEach(function(point) {
                        var votesNb = point.y;
                        if(votesNb > 0) {
                            var series = point.series;
                            content += '<span style="color:' + series.color + '">\u25CF</span> ' + series.name + ': <b>' + votesNb + '</b><br/>';
                        }
                    });

                    return content;
                },
                shared: true
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    marker: {
                        enabled: false
                    }
                }
            },
            series: []
        };

        self.chartOptions = ko.observable();

        api.getStatistiques().done(function(result){
            result.series.forEach(function(item){
                defaultConfig.series.push({ id: item.id, name: item.name, data: [] });
            });

            result.dataSource.forEach(function(item){
                var date = new Date(item.date);
                defaultConfig.xAxis.categories.push(date);
                defaultConfig.series.forEach(function(serie){
                    serie.data.push(item[serie.id]);
                });
            });

            defaultConfig.series = defaultConfig.series.filter(function(serie){
                return serie.data.some(function(item){
                    return item > 0;
                });
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