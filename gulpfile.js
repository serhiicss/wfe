const {src, dest, series, watch} = require('gulp')
const sass =         require('gulp-sass')
const csso =         require('gulp-csso')
const include =      require('gulp-file-include')
const htmlmin =      require('gulp-htmlmin')
const del =          require('del')
const concat =       require('gulp-concat')
const minify =       require('gulp-minify')
const imagemin =     require('gulp-imagemin')
const autoPrefixer = require('gulp-autoprefixer')
const sync =         require('browser-sync').create()

function html() {
  return src('src/**.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('dist'))
}
function scss(){
  return src('src/sass/**.sass')
    .pipe(sass())
    .pipe(autoPrefixer({
      "overrideBrowserslist": ["last 2 versions"]
    }))
    .pipe(csso())
    .pipe(concat('main.css'))
    .pipe(dest('dist'))
}

function js(){
  return src('src/js/**.js')
    .pipe(minify({
      noSource: true
    }))
    .pipe(dest('dist'))
}

function images() {
	return src('src/img/**/*')
		.pipe(imagemin())
		.pipe(dest('dist/img'))
}

function clear(){
  return del('dist')
}

function serve() {
  sync.init({
    server: './dist'
  })
  watch('src/**/*.html', series(html)).on('change', sync.reload)
  watch('src/sass/**/*.sass', series(scss)).on('change', sync.reload)
  watch('src/**/*.js', series(js)).on('change', sync.reload)
}

exports.build = series(clear, scss, html, images)
exports.serve = series(clear, scss, html, images, serve)
exports.clear = clear //clears dist folder
