(function () {
    'use strict';

    angular
        .module('app.messages')

        .service('MessagesService', MessagesService);

    MessagesService.$inject = ['$http', 'HttpService'];

    function MessagesService($http) {

        var service = {
            contactsList: contactsListFn,
            getSendMessagesList: getSendMessagesListFn,
            getInboxMessagesList: getInboxMessagesListFn,
            getDraftMessagesList: getDraftMessagesListFn,
            getMessagesListByType: getMessagesListByTypeFn,
            getDraft: getDraftFn,
            saveDraft: saveDraftFn,
            formatDate: formatDateFn
        };

        return service;

        /**
         * Get contacts list
         *
         * @returns {*}
         */
        function contactsListFn() {
            return $http.get('/api/contacts');
        }

        /**
         * Get send messages list
         *
         * @param page
         */
        function getSendMessagesListFn(page) {
            page = page || 1;

            return $http.get('/api/messages/send', {page: page});
        }

        /**
         * Get inbox messages list
         *
         * @param page
         */
        function getInboxMessagesListFn(page) {
            page = page || 1;

            return $http.get('/api/messages/inbox', {page: page});
        }

        /**
         * Get draft messages list
         *
         * @param page
         */
        function getDraftMessagesListFn(page) {
            page = page || 1;

            return $http.get('/api/messages/draft', {page: page});
        }

        /**
         * Return paginate list of messages
         *
         * @param type
         * @param page
         */
        function getMessagesListByTypeFn(type, page) {
            type = type || 'inbox';

            switch(type) {
                case 'inbox':
                     return getInboxMessagesListFn(page);
                    break;

                case 'send':
                    return getSendMessagesListFn(page);
                    break;

                case 'draft':
                    return getDraftMessagesListFn(page);
                    break;

                default:
                    return getInboxMessagesListFn(page);
                    break;
            }
        }

        /**
         * Get draft by id
         *
         * @param id
         * @returns {boolean}
         */
        function getDraftFn(id) {
            if(!id){
                return false;
            }

            return $http.get('/api/messages/' + id + '/edit');
        }

        /**
         * Save message as draft
         *
         * @param draft
         * @returns {boolean}
         */
        function saveDraftFn(draft) {
            if(!draft){
                return false;
            }

            if(!draft.text && !draft.subject) {
                return false;
            }

            return $http.post('/api/messages/draft', draft);
        }

        /**
         * Transform date to USA format
         *
         * @param date
         * @returns {*}
         */
        function formatDateFn(date) {
            return moment(date.substring(0, 10)).format('MM-DD-YYYY');
        }
    }

})();