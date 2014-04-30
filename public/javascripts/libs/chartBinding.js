define(['knockout', 'jquery', 'chart'], function (ko) {
    ko.bindingHandlers.chartMixIt = {
        init: function(element, valueAccessor) {
            var value = valueAccessor();

            var valueUnwrapped = ko.unwrap(value);

            $(element).dxChart(valueUnwrapped);
        }
    };
});