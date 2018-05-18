var gulp = require('gulp')
var path = require('path')
var util = require('gulp-util')
var through2 = require('through2')
var autoprefixer = require('gulp-autoprefixer')
var less = require('gulp-less')
var rename = require('gulp-rename')
var changed = require('gulp-changed')
var ts = require("gulp-typescript")

// 各类文件的压缩
var htmlMinify = require('gulp-html-minifier')
var jsonMinify = require('gulp-json-minify')
var minifyCSS = require('gulp-minify-css')
var uglify = require('gulp-uglify')
var imagemin = require('gulp-imagemin')

var tsProject = ts.createProject("tsconfig.json")

var buildDir = 'dist'

// 获取src文件夹到当前处理文件的相对路径
function getRelativePath (filePath) {
  return path.dirname(path.relative(__dirname + '/src', filePath))
}

// 对src中的ts文件进行编译和压缩，拷贝到dist对应的路径下
gulp.task('ts', function () {
  return tsProject.src()
  .pipe(through2.obj(function (file, encoding, callback) {
    gulp.src(file.path)
    .pipe(changed(buildDir + '/' + getRelativePath(file.path)))
    .pipe(tsProject())
    .js.pipe(uglify())
    .pipe(gulp.dest(buildDir + '/' + getRelativePath(file.path)))
    .on('end', callback)
  }))
})

//  对src中的wxml文件进行压缩后，拷贝进dist对应路径下
gulp.task('wxml', function () {
  return gulp.src('src/**/**/*.wxml')
  .pipe(through2.obj(function (file, encoding, callback) {
    gulp.src(file.path)
    .pipe(changed(buildDir + '/' + getRelativePath(file.path)))
    .pipe(htmlMinify({
      collapseWhitespace: true,
      removeComments: true,
      keepClosingSlash: true
    }))
    .pipe(gulp.dest(buildDir + '/' + getRelativePath(file.path)))
    .on('error', util.log)
    .on('end', callback)
  }))
})

// 对src中的json文件进行压缩，拷贝到dist对应路径下
gulp.task('json', function () {
  return gulp.src('src/**/**/*.json')
  .pipe(through2.obj(function (file, encoding, callback) {
    gulp.src(file.path)
    .pipe(changed(buildDir + '/' + getRelativePath(file.path)))
    .pipe(jsonMinify())
    .pipe(gulp.dest(buildDir + '/' + getRelativePath(file.path)))
    .on('error', util.log)
  }))
})

gulp.task('less', function () {
  return gulp.src('src/**/**/*.less')
  .pipe(through2.obj(function (file, encoding, callback) {
    gulp.src(file.path)
    .pipe(changed(buildDir + '/' + getRelativePath(file.path)))
    .pipe(autoprefixer({
      browsers: 'last 2 version'
    }))
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(rename({
      extname: '.wxss'
    }))
    .pipe(gulp.dest(buildDir + '/' + getRelativePath(file.path)))
    .on('error', util.log)
    .on('end', callback)
  }))
})

// 对src中images中的图片文件进行压缩，拷贝到dist对应路径下
gulp.task('images', function () {
  return gulp.src('src/images/**/**/*.*')
  .pipe(through2.obj(function(file, encoding, callback) {
    gulp.src(file.path)
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(buildDir + '/' + getRelativePath(file.path)))
    .on('error', util.log)
    .on('end', callback)
  }))
})

//对 src文件夹下的ts文件进行监听变化
gulp.task('watch:ts', function () {
  gulp.watch('src/**/**/*.ts', ['ts'])
})

// 监听src文件夹中json文件变化
gulp.task('watch:json', function () {
  gulp.watch('src/**/**/*.json', ['json'])
})

// 监听src文件夹中wxml文件变化
gulp.task('watch:wxml', function () {
  gulp.watch('src/**/**/*.wxml', ['wxml'])
})

// 监听src文件夹中less文件变化
gulp.task('watch:less', function () {
  gulp.watch('src/**/**/*.less', ['less'])
})

// 监听src文件夹下的images中的变化
gulp.task('watch:images', function () {
  gulp.watch('src/images/**/*.*', ['images'])
})

gulp.task('build', ['ts', 'wxml', 'less', 'json', 'images'])

gulp.task('watch', ['build', 'watch:ts', 'watch:wxml', 'watch:less', 'watch:json', 'watch:images'])
