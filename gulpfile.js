var gulp = require('gulp');
var browserSync = require('browser-sync');
var log = require('fancy-log');

//var sass = require('gulp-sass');
var pug = require('gulp-pug');
var watch = require('gulp-watch')
var del = require('del')
var reload = browserSync.reload;
var stylus = require('gulp-stylus');

resources = ['app/**/*', '!app/**/*.pug', '!app/**/*.scss']

gulp.task('clean', function (cb) {
  return del(['dist'], cb)
})

gulp.task('build', ['clean', 'copy', 'templates', 'stylus'], function () {

})

/**
 * Compile pug files into HTML
 */
gulp.task('templates', function () {
  let p = pug({ pretty: true })
  p.on('error', (e) => {
    log.error(e)
    p.end()
  })
  return gulp
    .src('app/**/*.pug')
    .pipe(p)
    .pipe(gulp.dest('./dist/'));
});



gulp.task('copy', () => {
  return gulp.src(resources)
    .pipe(gulp.dest('./dist/'))
})
/**
 * Important!!
 * Separate task for the reaction to `.pug` files
 */
gulp.task('pug-watch', ['templates'], function () {
  return reload();
});

/**
 * Sass task for live injecting into all browsers
 */
// gulp.task('sass', function () {
//   return gulp
//     .src('app/**/*.scss')
//     .pipe(sass())
//     .on('error', sass.logError)
//     .pipe(gulp.dest('./dist/'));
// });

gulp.task('stylus', function () {
  let styl = stylus()
  styl.on('error', (e) => {
    log.error(e)
    styl.end()
  })
  return gulp
    .src(['app/**/*.styl', 'app/**/*.stylus'])
    .pipe(styl)
    .pipe(gulp.dest('./dist/'));
});

/**
 * Serve and watch the scss/pug files for changes
 */
gulp.task('default', ['stylus', 'templates'], function () {
  browserSync({
    notify: false,
    open: false,
    server: ['app', 'dist']
  });

  // gulp.watch('app/**/*.scss', ['sass', reload]);
  gulp.watch('app/**/*.{styl,stylus}', ['stylus', reload])

  // watch('./app/**/*.pug', { ignoreInitial: false })
  //   .pipe(pug())
  //   .pipe(gulp.dest('./dist/'))
  //   .pipe(reload({ stream: true }));
  gulp.watch('app/**/*.pug', ['pug-watch'])
  gulp.watch('app/**/*.{css,js,html,png,jpeg,gif,jpg}', reload)
});
