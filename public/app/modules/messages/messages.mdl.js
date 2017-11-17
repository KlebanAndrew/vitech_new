(function () {
    'use strict';

    angular
        .module('app.messages', [
            'app.messages.components'
        ])
        .config(configure);

    configure.$inject = ['$stateProvider'];

    function configure($stateProvider) {
        $stateProvider
            .state('messages', {
                abstract: true,
                url: '/',
                views: {
                    '': {
                        templateUrl: '/app/modules/layout.html'
                    }
                }
            })
            .state('messages.list', {
                url: '?type',
                views: {
                    content: {
                        controller: 'MessagesCtrl.main as ctrl',
                        templateUrl: '/app/modules/messages/main.html'
                    }
                },
                resolve: {

                }
            })
            .state('messages.create', {
                url: 'create',
                views: {
                    content: {
                        controller: 'MessagesCtrl.create as ctrl',
                        templateUrl: '/app/modules/messages/create.html'
                    }
                },
                resolve: {
                    contactsList: [
                        'MessagesService',
                        function (MessagesService) {
                            return MessagesService.contactsList();
                        }
                    ]
                }
            })
            .state('messages.draft', {
                url: 'draft/:id',
                views: {
                    content: {
                        controller: 'MessagesCtrl.draft as ctrl',
                        templateUrl: '/app/modules/messages/draft.html'
                    }
                },
                resolve: {
                    Item: [
                        'MessagesService',
                        '$stateParams',
                        function (MessagesService, $stateParams) {
                            return MessagesService.getDraft($stateParams.id);
                        }
                    ],
                    contactsList: [
                        'MessagesService',
                        function (MessagesService) {
                            return MessagesService.contactsList();
                        }
                    ]
                }
            });
    }

})();