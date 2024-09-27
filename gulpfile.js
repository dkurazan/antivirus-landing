import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import autoprefixer from 'gulp-autoprefixer';
import browserSyncModule from 'browser-sync';

const sass = gulpSass(dartSass);
const browserSync = browserSyncModule.create();

const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js'
  },
  html: {
    src: 'src/*.html',
    dest: 'dist'
  },
  json: {
    src: 'src/js/**/*.json',
    dest: 'dist/js'
  }
};

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

function json() {
  return gulp.src(paths.json.src)
    .pipe(gulp.dest(paths.json.dest))
    .pipe(browserSync.stream());
}

function html() {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.json.src, json);
  gulp.watch(paths.html.src, html).on('change', browserSync.reload);
}

export default gulp.series(styles, scripts, html, watch);