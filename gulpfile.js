/*****************************************
******* Gulpfile for React, Sass *********
*****************************************/

// Declaring dependencies
var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    uglify        = require('gulp-uglify'),
    rename        = require('gulp-rename'),
    concat        = require('gulp-concat'),
    nodemon       = require('gulp-nodemon'),
    lib           = require('bower-files')(),
    sourcemaps    = require('gulp-sourcemaps'),
    buffer        = require('vinyl-buffer'),
    react         = require('gulp-react'),
    del           = require('del'),
    browserify    = require('browserify'),
    reactify      = require('reactify'),
    watchify      = require('watchify'),
    source        = require('vinyl-source-stream'),
    brload        = require('browserify-react-live'),
    lrload        = require('livereactload'),
    browserSync   = require('browser-sync').create();

// Gulp configuration
var config = {
  devBaseUrl: 'http://localhost',
  port: 9090,
  paths: {
    dest: {
      global: "./build",
      sass: "./build/css/",
      html: "./build/*.html",
      js: "./build/js/",
      mainJs: "./build/js/main.js"
    },
    src: {
      sass: "./client/app/scss/**/*.scss",
      js: "./client/app/scripts/**/*.js",
      html: "./client/*.html",
      mainJs: "./client/app/scripts/main.js"
    }
  }
}

// Task for clearing destination directory
gulp.task('clean', function(cb) {
  del([config.paths.dest.global], cb);
});


// Task for browsersync(browser reload)
gulp.task('browser-sync', ['js', 'sass', 'bower', 'html'],function() {
  browserSync.watch([config.paths.dest.sass, config.paths.dest.html], function (event, file) {
    if (event === "change") {
      browserSync.reload();
    }
  });

	browserSync.init({
    files: [config.paths.dest.sass, config.paths.dest.html],
    port: 9991,
    proxy: config.devBaseUrl + ":" + config.port
		//server: { baseDir: config.paths.dest.global }
	});
});


// Task for sass processing
gulp.task('sass', function() {
  gulp.src(config.paths.src.sass)
    .pipe(sourcemaps.init())
    .pipe(sass({
      style: 'compressed' // compact
    }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.paths.dest.sass));
});

// Task for html processing
gulp.task('html', function() {
  gulp.src(config.paths.src.html)
    .pipe(gulp.dest(config.paths.dest.global));
});

// Task for js libs
gulp.task('bower', function () {
  gulp.src(lib.ext('js').files)
    .pipe(uglify())
    .pipe(gulp.dest(config.paths.dest.js + "/lib"));
});



// Task for js/jsx processing
gulp.task('js', function() {
  lrload.monitor("./build/js/main.js", {displayNotification: true});

  var bundler = browserify({
    entries: [config.paths.src.mainJs],
    transform: [reactify, lrload],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  });

  var watcher = watchify(bundler)
    rebundle()

    return watcher
      .on('update', rebundle);

  function rebundle() {
    watcher
      .bundle()
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe(gulp.dest(config.paths.dest.js));
  }
});

// Task for watching changes sass/html/js files changes
gulp.task('watch', ['sass', 'html'], function() {
  gulp.watch(config.paths.src.sass, ['sass'])
  gulp.watch(config.paths.src.html, ['html'])
});

//Start a local development server
gulp.task('connect', function() {
  nodemon({ script: 'server.js', ext: 'js', ignore: ['gulpfile.js', 'build/js/main.js', 'node_modules/*'] })
    .on('change', [])
    .on('restart', function () {
      console.log('Server restarted')
    })
});

// Default task - $ gulp
gulp.task('default', ['connect', 'browser-sync', 'watch']);




