(function () {
    'use strict';

    angular
        .module('services', [])

        .factory('postInterceptor', postInterceptor)
        .factory('authInterceptor', authInterceptor)
        .service('HttpService', HttpService)
        .service('SeoService', SeoService)
    ;

    postInterceptor.$inject = ['$q'];

    function postInterceptor($q) {
        return {
            request: function (config) {
                if (config.method === 'POST') {
                    //					Loader.start();
                }

                return config;
            },
            response: function (response) {
                if (response.config.method == 'POST') {
                    //					Loader.stop();
                }

                return response;
            },
            responseError: function (response) {
                //				Loader.stop();

                return $q.reject(response);
            }
        };
    }

    authInterceptor.$inject = ['$q'];

    function authInterceptor($q) {
        return {
            response: function (response) {
                return response;
            },
            responseError: function (response) {
                return $q.reject(response);
            }
        };
    }

    HttpService.$inject = ['$http', '$rootScope'];

    function HttpService($http, $rootScope) {
        return {
            get: getFn,
            getWParams: getFnWParams,
            post: postFn,
            put: putFn,
            delete: deleteFn
        };

        function successCallback(resp, callback) {
            if (callback) {
                return callback(resp);
            } else {
                return resp;
            }
        }

        function errorCallback(resp, callback) {
            if (callback) {
                return callback(resp);
            } else {
                return resp;
            }
        }

        function getFn(url, callback, errorCb) {
            return $http.get(url)
                .success(function (resp) {
                    if (callback) {
                        callback(resp);
                    }
                })
                .error(function (resp) {
                    if (errorCb) {
                        errorCallback(resp, errorCb);
                    }
                });
        }

        function getFnWParams(url, params, callback, errorCb) {
            params = params || {};

            return $http.get(url, params)
                .success(function (resp) {
                    successCallback(resp, callback);
                })
                .error(function (resp) {
                    errorCallback(resp, errorCb);
                });
        }

        function postFn(url, data, callback, errorCb) {
            $rootScope.$emit('form:submitted');

            return $http.post(url, data)
                .success(function (resp) {
                    $rootScope.$emit('form:success');

                    if (callback) {
                        successCallback(resp, callback);
                    }
                })
                .error(function (resp) {
                    $rootScope.$emit('form:error', resp);

                    if (errorCb) {
                        errorCallback(resp, errorCb);
                    }
                });
        }

        function putFn(url, data, callback, errorCb) {
            $rootScope.$emit('form:submitted');

            return $http.put(url, data)
                .success(function (resp) {
                    $rootScope.$emit('form:success');
                    successCallback(resp, callback);
                })
                .error(function (resp) {
                    $rootScope.$emit('form:error', resp);

                    if (errorCb) {
                        errorCallback(resp, errorCb);
                    }
                });
        }

        function deleteFn(url, callback, errorCb) {
            $rootScope.$emit('form:submitted');

            return $http.delete(url)
                .success(function (resp) {
                    $rootScope.$emit('form:success');
                    successCallback(resp, callback);
                })
                .error(function (resp) {
                    $rootScope.$emit('form:error', resp);

                    if (errorCb) {
                        errorCallback(resp, errorCb);
                    }
                });
        }
    }

    /**
     * Service for meta title and meta description etc.
     * @type {string[]}
     */

    function SeoService() {
        var title = 'App',
            description = 'App';

        return {
            getTitle: getTitleFn,
            setTitle: setTitleFn,
            setTitleFromState: setTitleFromStateFn,
            getDescription: getDescriptionFn,
            setDescription: setDescriptionFn,
            setDescriptionFromState: setDescriptionFromStateFn
        };

        /**
         * Set meta <title>
         * @param newTitle
         */
        function setTitleFn(newTitle) {
            title = newTitle ? newTitle + getTitleSeparator() : newTitle;
        }

        /**
         * set title from ui state
         * @param state
         */
        function setTitleFromStateFn(state) {
            setTitleFn(state.seo ? state.seo.title : title);
        }

        /**
         * set <meta name="description">
         * @param descr
         */
        function setDescriptionFn(descr) {
            description = descr;
        }

        /**
         * set meta description from state
         * @param state
         */
        function setDescriptionFromStateFn(state) {
            setDescriptionFn(state.seo ? state.seo.description : null);
        }

        /**
         * Get title for html
         * @returns {string}
         */
        function getTitleFn() {
            return title;
        }

        /**
         * Get description for html
         * @returns {string}
         */
        function getDescriptionFn() {
            return description;
        }

        function getTitleSeparator() {
            return ' - App';
        }
    }

})();
