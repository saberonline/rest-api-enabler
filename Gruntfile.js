/*jslint node: true */
"use strict";

module.exports = function( grunt ) {

	// Grab package as variable for later use/
	var pkg = grunt.file.readJSON( 'package.json' );

	// Load all tasks.
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

	// Project configuration
	grunt.initConfig( {
		pkg: pkg,
		devUpdate: {
	        main: {
	            options: {
	                updateType: 'prompt',
	                packages: {
	                    devDependencies: true
	                },
	            }
	        }
	    },
	    prompt: {
			version: {
				options: {
					questions: [
						{
							config:  'newVersion',
							type:    'input',
							message: 'What specific version would you like',
							default: '<%= pkg.version %>' 
						}
					]
				}
			}
		},
		replace: {
			package: {
				src: ['package.json'],
   				overwrite: true,
    			replacements: [
	    			{
	    				  "version": "1.0.0",
	    				from: /("version":\s*).*,\n/g,
	    				to: '$1"<%= newVersion %>",\n'
	    			}
    			]
			},
			readme: {
				src: ['readme.txt'],
   				overwrite: true,
    			replacements: [
	    			{
	    				from: /(Stable tag:\s*).*\n/g,
	    				to: '$1<%= newVersion %>\n'
	    			}
    			]
			},
			pluginHeader: {
				src: ['rest-api-enabler.php'],
   				overwrite: true,
    			replacements: [
	    			{
	    				from: /(\*\s*Version:\s*).*\n/g,
	    				to: '$1<%= newVersion %>\n'
	    			}
    			]
			},
			pluginPHP: {
				src: ['includes/class-rest-api-enabler.php'],
   				overwrite: true,
    			replacements: [
	    			{
	    				from: /(\$this\-\>version\s=\s').*(';)\n/g,
	    				to: '$1<%= newVersion %>$2\n'
	    			}
    			]
			}
		},
		wp_readme_to_markdown: {
			your_target: {
	      		files: {
	      			'readme.md': 'readme.txt'
	      		},
	      		options:{
   					screenshot_url: '',
				},
 		 	},
		},
	    makepot: {
	        target: {
	            options: {
	                domainPath: '/languages/',    // Where to save the POT file.
	                potFilename: 'rest-api-enabler.pot',   // Name of the POT file.
	                type: 'wp-plugin'  // Type of project (wp-plugin or wp-theme).
	            }
	        }
	    },
		copy: {
			svnAssets: {
				cwd: 'assets/',
				src: ['**'],
				dest: 'svn/assets/',
				expand: true,
			},
			svnTrunk: {
				src:  [
					'**',
					'!node_modules/**',
					'!svn/**',
					'!.git/**',
					'!.sass-cache/**',
					'!css/src/**',
					'!js/src/**',
					'!img/src/**',
					'!assets/**',
					'!design/**',
					'!Gruntfile.js',
					'!package.json',
					'!.gitignore',
					'!.gitmodules',
					'!composer*',
					'!vendor/autoload.php',
					'!vendor/composer/**',
					'!readme.md'
				],
				dest: 'svn/trunk/',
			},
			svnTags: {
				cwd:  'svn/trunk/',
				src: ['**'],
				dest: 'svn/tags/<%= newVersion %>/',
				expand: true,
			}
		}
	} );

	grunt.registerTask( 'build', [
		'prompt',
		'replace',
		'wp_readme_to_markdown',
		'makepot',
		'copy'
	] );

	grunt.util.linefeed = '\n';
};