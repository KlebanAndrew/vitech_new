(function () {
    'use strict';

    /**
     * View message component
     *
     * @type {{bindings: {message: string}, templateUrl: string, controller: controller}}
     */
    var viewMessage = {
        bindings: {
            message: '<'//message object
        },
        templateUrl: '/app/modules/messages/components/view_message.html',

        controller: function (HttpService, Notify) {
            var vm = this;

            vm.reply = {};

            vm.sendReply = sendReply;

            /**
             * Send reply for message
             */
            function sendReply() {
                if (_.isUndefined(vm.reply.text) || vm.reply.text == '') {
                    Notify.warning('Write something');

                    return;
                }

                var message = {
                    text: vm.reply.text,
                    subject: 'Subject',
                    receiver: vm.message.sender,
                    files: vm.reply.files
                };

                HttpService.post('/api/messages/reply', message, function (resp) {
                    Notify.success('Reply send');
                    vm.reply = {};
                }, function (errors) {
                    vm.errors = errors;
                    Notify.warning('Something went wrong');
                });
            }
        }
    };

    /**
     * Create message component
     *
     * @type {{bindings: {contacts: string, message: string}, templateUrl: string, controller: controller}}
     */
    var createMessage = {
        bindings: {
            contacts: '<',//list of user contacts
            message: '<',//message object for drafts
            draft: '<'
        },
        templateUrl: '/app/modules/messages/components/create_message.html',

        controller: function ($state, HttpService, MessagesService) {
            var vm = this;

            vm.created = false;

            vm.$onInit = function () {
                //save as draft on reload
                window.onunload = function () {
                    if (!vm.created && !vm.message.is_draft) {
                        MessagesService.saveDraft(vm.message);
                    }
                };

                if(vm.message){
                    angular.forEach(vm.contacts, function (value, key) {
                        value.selected = false;

                        angular.forEach(vm.message.receivers, function (catval, catkey) {
                            if (value.id == catval.id) {
                                value.selected = true;
                            }
                        });
                    });
                }
            };

            //init function
            vm.$onDestroy = function () {
                //save as draft on state change
                if (!vm.created && !vm.message.is_draft) {
                    MessagesService.saveDraft(vm.message);
                }
            };

            vm.sendMessage = vm.draft ? sendDraft : sendMessage;

            /**
             * Store message
             */
            function sendMessage() {
                HttpService.post('/api/messages', vm.message, function (resp) {
                    vm.created = true;

                    $state.go('messages.list');
                }, function (errors) {
                    vm.errors = errors.errors;
                });
            }

            function sendDraft() {
                HttpService.put('/api/messages/' + vm.message.id, vm.message, function (resp) {
                    vm.created = true;

                    $state.go('messages.list');
                }, function (errors) {
                    vm.errors = errors.errors;
                });
            }
        }
    };

    /**
     * Show messages list by type
     *
     * @type {{bindings: {type: string, selectedMessage: string}, templateUrl: string, controller: controller}}
     */
    var messagesList = {
        bindings: {
            type: '<',//message type
            selectedMessage: '='//here put message selected by user
        },
        templateUrl: '/app/modules/messages/components/messages_list.html',

        controller: function ($timeout, $state, MessagesService) {
            var vm = this;

            vm.page = 1;

            //init function
            vm.$onInit = function () {
                if (_.isUndefined(vm.type)) {
                    vm.type = 'inbox';
                }

                //get messages list by type
                getMessages();
            };

            //on type change get new data
            vm.$onChanges = function (changesObj) {
                if (changesObj.type && !changesObj.type.isFirstChange()) {
                    getMessages();
                }
            };

            vm.selectMessage = selectMessage;

            /**
             * Get selected message
             *
             * @param item
             * @returns {promise|void}
             */
            function selectMessage(item) {
                if (vm.type == 'draft') {
                    return $state.go('messages.draft', {id:item.id});
                }

                item.type = vm.type;

                vm.selectedMessage = item;
            }

            /**
             * Get messages list
             */
            function getMessages() {
                MessagesService.getMessagesListByType(vm.type, vm.page).success(function (resp) {
                    vm.items = resp;
                    console.log(resp);

                    if(vm.items.length){
                        vm.selectedMessage = _.first(vm.items, 1)[0];
                        vm.selectedMessage.type = vm.type;
                    } else {
                        vm.selectedMessage = {};
                    }
                });
            }
        }
    };

    /**
     * Upload file component
     *
     * @type {{bindings: {files: string}, templateUrl: string, controller: controller}}
     */
    var uploadFile = {
        bindings: {
            files: '='//file info
        },
        templateUrl: '/app/modules/messages/components/upload_file.html',

        controller: function (HttpService, Notify, FileUploader) {
            var vm = this;

            if (!angular.isDefined(vm.files)) {
                vm.files = [];
            }

            /**
             * File uploader
             */
            vm.uploader = new FileUploader({
                url: '/api/file/upload',
                //headers: { "Authorization": 'Bearer ' + BACKEND_CFG.jwt},
                autoUpload: true,
                removeAfterUpload: true,
                queueLimit: 1,
                filters: [
                    {
                        name: 'limit',
                        fn: function () {
                            //Check for limit files if defined
                            if (vm.files.length < 2) {
                                return true;
                            } else {
                                Notify.alert('Max file number');
                            }
                        }
                    }
                ],
                onBeforeUploadItem: function () {
                },
                onProgressAll: function (progress) {
                    vm.progress = progress;
                },
                onCompleteItem: function (item, response, status, headers) {
                    //for fake file upload (for Js server)
                    var fakeItem = {
                        id:response.id,
                        name: item.file.name,
                        token: response.id
                    };
                    vm.files.push(fakeItem);

                    //uncomment while do backend
                    // vm.files.push(response);
                },
                onErrorItem: function (item, response) {
                    Notify.alert(response.message ? response.message : 'Something went wrong. Please refresh page and try again.');
                },
                onCompleteAll: function () {
                    vm.progress = 0;
                }
            });

            // Cancel upload
            vm.cancelFile = function (file) {
                vm.files.splice(_.indexOf(vm.files, file), 1);
            };

            // Remove file
            vm.removeFile = function (index) {
                Notify.confirm(function () {
                    // Fore delete of file
                    HttpService.delete('/api/file/delete/' + vm.files[index].token).success(function (resp) {
                        vm.files.splice(index, 1);
                    }).error(function (error) {
                        vm.profileLoad = false;
                    });

                }, 'Confirm?');
            };
        }

    };
    angular
        .module('app.messages.components', [])
        .component('viewMessage', viewMessage)
        .component('createMessage', createMessage)
        .component('messagesList', messagesList)
        .component('uploadFile', uploadFile)
    ;

})();