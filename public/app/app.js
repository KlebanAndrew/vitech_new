(function () {
    'use strict';

    angular.module('app', [
        'ui.router',//router
        'ngSanitize',
        'ngDialog',//popups
        'summernote', // Editor
        'notification',//notification
        'angularFileUpload',//upload files
        'angular-loading-bar',//loading bar
        'isteven-multi-select',//multiselect
        'app.components.pagination',//pagination
        'services',//services
        'directives',//directives
        'directives.main',//template parts
        'filters',//filters
        'shared.notify',//service for notification

        'app.components.general',//general components

        //modules
        'app.messages'//home page
    ])
        .run(runBlock)
        .config(configure);

    configure.$inject = ['$httpProvider', '$locationProvider', '$urlRouterProvider'];

    function configure($httpProvider, $locationProvider, $urlRouterProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.defaults.useXDomain = true;

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $urlRouterProvider.otherwise('/');
    }

    runBlock.$inject = ['$rootScope', 'SeoService'];

    function runBlock($rootScope, SeoService) {
        $rootScope.$on('$stateChangeStart', function (event, toState) {
            $rootScope.stateData = toState.data;
            SeoService.setTitleFromState(toState);
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            console.log('Resolve Error: ', error);
        });

        $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {

        });

        //Functions for SEO
        $rootScope.getSeoTitle = SeoService.getTitle;

        $rootScope._ = _;

        // Check if not mobile client
        var isMobile = false;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Opera Mobile|Kindle|Windows Phone|PSP|AvantGo|Atomic Web Browser|Blazer|Chrome Mobile|Dolphin|Dolfin|Doris|GO Browser|Jasmine|MicroB|Mobile Firefox|Mobile Safari|Mobile Silk|Motorola Internet Browser|NetFront|NineSky|Nokia Web Browser|Obigo|Openwave Mobile Browser|Palm Pre web browser|Polaris|PS Vita browser|Puffin|QQbrowser|SEMC Browser|Skyfire|Tear|TeaShark|UC Browser|uZard Web|wOSBrowser|Yandex.Browser mobile/i.test(navigator.userAgent)) {
            isMobile = true;
        } //&& confirm('Are you on a mobile device?')

        $rootScope.isDesktop = !isMobile;
    }
})();
