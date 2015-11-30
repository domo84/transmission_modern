module.exports = (grunt) ->
	grunt.initConfig
		pkg: grunt.file.readJSON("package.json")
		dependencies: Object.keys(grunt.file.readJSON("package.json").dependencies)

		concurrent:
			server:
				tasks: ["connect", "watch"]
				options:
					logConcurrentOutput: true

		browserify:
			libs:
				files:
					"gen/libs.js": []
				options:
					debug: false,
					require: "<%= dependencies %>"
			app:
				files:
					"gen/app.js": ["scripts/index.js"]
				options:
					debug: true,
					browserifyOptions:
						debug: true
					transform: ["node-underscorify"],
					external: "<%= dependencies %>"

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
				tasks: ["browserify:app"]
				options:
					livereload: true

	grunt.loadNpmTasks "grunt-browserify"
	grunt.loadNpmTasks "grunt-concurrent"
	grunt.loadNpmTasks "grunt-contrib-connect"
	grunt.loadNpmTasks "grunt-contrib-watch"

	grunt.loadNpmTasks "grunt-contrib-sass"
