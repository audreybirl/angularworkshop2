
var gulp = require('gulp');
    connect = require('gulp-connect'),
    eslint = require('gulp-eslint'),
    jsPath = [
          'app/!(vendor)/**/*.js',
          'test/**/*.js',
          '!test/unit/dataMocks/**/*.js',
          '!app/jadeTemplates.js'
      ];

var proxyList = [
    '^/testendpoint/(.*)$ http://localhost:1337/$1 [P]',
    '^/groups/(.*)$ http://localhost:1337/$1 [P]'
];

var modRewrite = require('connect-modrewrite');

gulp.task('default', function () {
  connect.server({
    root: 'app/',
    port: 8888,
    livereload: true,
    middleware: function () {
          return [
              modRewrite(proxyList)
          ];
      }
  });
});

gulp.task('eslint', function() {
  return gulp.src(jsPath)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('eslint:xml', function() {
  return gulp.src(jsPath)
    .pipe(eslint())
    .pipe(eslint.format('checkstyle', fs.createWriteStream('checkstyle.xml')));
});

