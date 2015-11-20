module.exports = (grunt) ->
	grunt.initConfig
		browserify:
			"gen/out.js": ["app/index.js"]

		connect:
			server:
				options:
					port: 8000
					hostname: "0.0.0.0"
					keepalive: true

		watch:
			js:
				files: ["app/**/*"]
				tasks: ["browserify"]
				options:
					livereload: true

	grunt.loadNpmTasks "grunt-browserify"
	grunt.loadNpmTasks "grunt-contrib-connect"
	grunt.loadNpmTasks "grunt-contrib-watch"
