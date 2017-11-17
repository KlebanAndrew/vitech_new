(function () {
    'use strict';

    var paginationDashboard = {
        bindings: {
            getPaginate: '=',
            paginateRange: '<',
            range: '<',
            paginateCurrentPage: '<',
            paginateTotalPages: '<',
            paginateNextPageUrl: '=',
            paginatePrevPageUrl: '='
        },
        templateUrl: '/app/components/pagination/pagination.html',
        controller: function () {
            var vm = this;

            if (vm.range === undefined) {
                vm.range = [];
                var i = 2;
                while (i <= vm.paginateTotalPages - 1) {
                    vm.range.push(i);
                    i++;
                }
            }
        }
    };

    angular
        .module('app.components.pagination', [])
        .component('paginationDashboard', paginationDashboard)
    ;
})();
