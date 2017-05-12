module.exports = grunt => {
// load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns 
require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    babel: {
      options: {
        presets: ['es2015-without-strict']
      },
      build: {
        files: [{
          expand: true,
          cwd: 'src/js/',
          src: ['*.js'],
          dest: 'build/js/'
        }]
      }
    },
    webpack: {
      js: {
        entry: {app:'./build/js/app.js'},
        output: {path:'./dist/js/', filename:'[name].js'}
      }
    },
    jshint: {
      options : {
        esversion: 6
      },
      files: {
        src: ['Gruntfile.js',  'test/*.js']
      },
      beforeconcat: 'src/js/*.js',
      afterconcat: 'dist/js/app.js'
    },
    uglify: {
      my_target: {
        files: {
          'dist/js/app.min.js' : 'dist/js/app.js'
        }
      }
    },
    sass: {
      dist: {
        files: {
          'dist/css/style.css': 'src/sass/style.scss'
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          'dist/css/style.min.css': 'dist/css/style.css'
        }
      }
    },
    watch: {
      src: {
        files: ['src/sass/*.scss','src/js/*.js'],
        tasks: ['default']
      },
    }
  });

  grunt.registerTask('default', [
    'babel',
    'webpack',
    'jshint',
    'uglify',
    'sass',
    'cssmin'
  ]);
};