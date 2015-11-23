module.exports = (grunt) ->
	grunt.initConfig
		browserify:
			gen:
				files:
					"gen/out.js": ["scripts/index.js"]
				options:
					transform: ['node-underscorify'],
					debug: true,

		connect:
			server:
				options:
					port: 8000
					hostname: "0.0.0.0"
					keepalive: true

		sass:
			gen:
				options:
					loadPath: "node_modules/foundation-sites/scss"
				files:
					"gen/styles.css": "styles/index.scss"

		watch:
			scss:
				files: ["styles/**/*"]
				tasks: ["sass"]
				options:
					livereload: true
			js:
				files: ["scripts/**/*", "html/**/*"]
				tasks: ["browserify"]
				options:
					livereload: true

	grunt.loadNpmTasks "grunt-browserify"
	grunt.loadNpmTasks "grunt-contrib-connect"
	grunt.loadNpmTasks "grunt-contrib-watch"
	grunt.loadNpmTasks "grunt-contrib-sass"
