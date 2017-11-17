(function () {
    'use strict';

    angular.module('filters', [])

        .filter('dateToISO', dateToISO)
        .filter('cut', cut)
        .filter('unsafe', unsafe)
        .filter('toBoolean', toBoolean)
    ;

    //{{some_text | cut:true:100:' ...'}}
    function cut() {
        return function (value, wordwise, max, tail) {
            if (!value) {
                return '';
            }

            max = parseInt(max, 10);
            if (!max) {
                return value;
            }
            if (value.length <= max) {
                return value;
            }

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    }

    //todo comment
    function dateToISO() {
        return function (input) {
            if (input && input !== '0000-00-00 00:00:00') {
                input = input.toString().split('-').join('/');
                return new Date(input).toISOString();
            } else {
                return null;
            }
        };
    }

    //todo comment
    unsafe.$inject = ['$sce'];

    function unsafe($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    }

    /**
     * Simplify boolean
     * @returns {Function}
     */
    function toBoolean() {
        return function (val) {
            if (val === 'false' || val === '0' || val === 0 || val === false) {
                return false;
            } else {
                return true;
            }
        };
    }
})();
