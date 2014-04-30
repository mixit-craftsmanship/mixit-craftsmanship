define(['knockout', 'jquery', 'globalize', 'chart'], function (ko) {
    ko.bindingHandlers.chartMixIt = {
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = valueAccessor();

            var valueUnwrapped = ko.unwrap(value);

            $(element).dxChart(valueUnwrapped);
        }
    };
});