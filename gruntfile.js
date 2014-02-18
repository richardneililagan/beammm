module.exports = (function (tasks) {

	return function (grunt) {

		grunt.initConfig({
			pkg : grunt.file.readJSON('package.json'),

			// @module watch
			watch : {
				server : {
					files : [
						'app/**/*.js',
						'app/**/*.json',
						'config.json',
						'index.js'
					],
					tasks : ['jshint', 'mochaTest'],
					options : {
						interrupt : true,
						spawn : false,
						livereload : true
					}
				}
			},

			// @module jshint
			jshint : {
				options : {
					'-W030' : true
				},
				all : ['app/**/*.js']
			},

			// @module mocha grunt tasks
			mochaTest : {
				tests : {
					src : ['tests/**/*.spec.js']
				}
			}

		});

		tasks.forEach(grunt.loadNpmTasks);
	};

})([
	// task modules
	'grunt-contrib-watch',
	'grunt-contrib-jshint',
	'grunt-mocha-test'
])