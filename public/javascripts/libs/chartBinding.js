define(['knockout', 'jquery', 'highcharts'], function (ko) {
    ko.bindingHandlers.chartMixIt = {
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = valueAccessor();

            var valueUnwrapped = ko.unwrap(value);

            $(element).highcharts(valueUnwrapped);
        }
    };
});