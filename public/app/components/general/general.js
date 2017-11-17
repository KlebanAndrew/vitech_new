(function () {
    'use strict';

    /**
     * Logout component
     *
     * @type {{bindings: {}, templateUrl: string, controller: controller}}
     */
    var authLogoutButton = {
        bindings: {

        },
        templateUrl: 'app/components/general/logout_button.html',

        controller: function (HttpService) {
            var vm = this;

            vm.logOut = logOut;

            //Log out
            function logOut() {
                HttpService.post('/logout', {}, function (resp) {
                    localStorage.clear();
                    window.location.href = '/login';
                }, function (errors) {
                    localStorage.clear();
                });
            }
        }
    };

    /**
     * Content header
     *
     * @type {{bindings: {}, templateUrl: string, controller: controller}}
     */
    var contentHeader = {
        bindings: {

        },
        templateUrl: 'app/components/general/content_header.html',

        controller: function () {
            var vm = this;

        }
    };

    angular
        .module('app.components.general', [])
        .component('authLogoutButton', authLogoutButton)
        .component('contentHeader', contentHeader)
    ;

})();