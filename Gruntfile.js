var serveStatic = require('serve-static');

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        src: 'src',
        dist: 'dist',
        tmp: 'tmp',

        browserify: {
            dev: {
                options: {
                    transform: ['stringify'],
                    watch: true,
                    browserifyOptions: {
                        debug: true
                    }
                },
                files: {
                    '<%= dist %>/<%= pkg.name %>.js': ['<%= src %>/js/index.js'],
                }
            }
        },

        sass: {
            app: {
                files: {
                    './tmp/css/style-unprefixed.css': ['<%= src %>/scss/index.scss'],
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 9']
            },
            app: {
                files: {
                    '<%= dist %>/<%= pkg.name %>.css': './tmp/css/style-unprefixed.css',
                }
            },
        },

        clean: {
            app: {
                src: ['./tmp']
            },
        },

        connect: {
            options: {
                port: 9001,
                livereload: 35729
            },
            server: {
                options: {
                    base: 'demo',
                    open: true,
                    middleware: function connectMiddleware(connect, options,
                        middlewares) {
                        middlewares.push(connect().use('/dist', serveStatic(
                            './dist')));
                        middlewares.push(connect().use('/bower_components',
                            serveStatic('./bower_components')));
                        return middlewares;
                    }
                }
            }
        },

        watch: {
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            js: {
                files: ['<%= src %>/**/*.js'],
                tasks: ['browserify']
            },
            html: {
                files: ['<%= src %>/**/*.html'],
                tasks: ['browserify']
            },
            sass: {
                files: ['<%= src %>/**/*.scss'],
                tasks: ['compile-sass']
            }
        },

        exorcise: {
            options: {
                base: '.'
            },
            dist: {
                files: {
                    '<%= dist %>/<%= pkg.name %>.map': ['<%= dist %>/<%= pkg.name %>.js'],
                }
            }
        },

        uglify: {
            dist: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true,
                    sourceMapIn: '<%= dist %>/<%= pkg.name %>.map',
                    sourceMapName: '<%= dist %>/<%= pkg.name %>.map'
                },
                files: {
                    '<%= dist %>/<%= pkg.name %>.min.js': ['<%= dist %>/<%= pkg.name %>.js'],
                },
            },
        },

    });

    grunt.registerTask('dev', 'Start server and autocompile on source change', ['build', 'connect', 'watch']);
    grunt.registerTask('compile-sass', 'Compile SASS', ['sass', 'autoprefixer', 'clean']);
    grunt.registerTask('build', 'Create package', ['browserify', 'exorcise', 'compile-sass']);
    grunt.registerTask('dist', 'Create distributable package', ['browserify', 'exorcise', 'uglify', 'compile-sass', 'clean']);

};
