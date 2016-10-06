// Load Plugins

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync'),
    fontello = require('gulp-fontello'),
    del = require('del');

// Define file paths    
var jsSources = ['src/scripts/**/*.js'],
	sassSources = ['src/css/**/*.scss'],
	imgSources = ['src/imgs/**/*'],
	htmlSources = ['*.html'],
	outputDir = 'dist/assets';
	
// Scripts
gulp.task('scripts', function() {
  return gulp.src(jsSources, { base: 'src' })
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    //.pipe(concat('main.js'))
    .pipe(gulp.dest(outputDir))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(outputDir))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Styles
gulp.task('styles', function() {
  return sass(sassSources, { style: 'expanded', base: 'src' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest(outputDir))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano()) // minify
    .pipe(gulp.dest(outputDir))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src(imgSources, { base: 'src' })
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(outputDir))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('glyph', function() {
  return gulp.src('config.json')
    .pipe(fontello({
	    	host: 'http://fontello.com',
				font: 'font',
				css: 'css',
				assetsOnly: true  	
    }))
    .pipe(gulp.dest(outputDir))
    .pipe(notify({ message: 'Glyph task complete' }));
});

// Clean
gulp.task('clean', function() {
    return del(['dist/assets/css', 'dist/assets/scripts', 'dist/assets/imgs']);
});

// Watch
gulp.task('watch', function() {

	// Initialize Browser Sync
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});

  // Watch .scss files
  gulp.watch(sassSources, ['styles']);

  // Watch .js files
  gulp.watch(jsSources, ['scripts']);

  // Watch image files
  gulp.watch(imgSources, ['images']);	

  // Watch any files in dist/ and any root html files, reload on change
  gulp.watch(['dist/**', htmlSources], function(){
	  console.log('Made it here');
  }).on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images', 'watch');
});