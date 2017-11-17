module.exports = function(grunt) {
    'use strict';
    var js = grunt.file.readJSON('grunt-file-dashboard.json').js;
    var css = grunt.file.readJSON('grunt-file-dashboard.json').css;

    grunt.initConfig({
        concat: {
            css: {
                src: css,
                dest: 'public/build/css/styles.css'
            },
            js: {
                src: js,
                dest: 'public/build/js/scripts.js'
            }
        },
        uglify: {
            options: {
                stripBanners: true
            },
            build: {
                src: [
                    'public/build/js/scripts.js'
                ],
                dest: 'public/build/js/scripts.min.js'
            }
        },
        injector: {
            options: {
            },
            'resources/views/welcome.blade.php': {
                files: js.concat(css)
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path
                    {expand: true, flatten: true, src: ['public/fonts/*'], dest: 'public/build/fonts', filter: 'isFile'},

                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-injector');
    grunt.registerTask('default', 'concat');
    grunt.registerTask('fonts', 'copy');

};