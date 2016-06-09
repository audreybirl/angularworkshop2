
var gulp = require('gulp');
    connect = require('gulp-connect'),
    eslint = require('gulp-eslint'),
    jsPath = [
          'app/!(vendor)/**/*.js',
          'test/**/*.js',
          '!test/unit/dataMocks/**/*.js',
          '!app/jadeTemplates.js'
    ],
    getFiles = function () {
      return [
            'vendor/jquery/dist/jquery.js',
            'vendor/angular/angular.js',
            'vendor/angular-animate/angular-animate.js',
            'vendor/angular-route/angular-route.js',
            'vendor/angular-mocks/angular-mocks.js',
            'vendor/lodash/lodash.js',
            'config/*.js',
            'core/**/*.js',
            'hello/**/*.js',
            'test/unit/**/*-spec.js'

        
      ]
    },
    del = require('del'),
    karma = require('node-karma-wrapper'),
    prereqs = ([]).concat('test:clean');

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

gulp.task('test:clean', function(callback) {
  del([ 'coverage/*' ], callback);
});

gulp.task('test:unit', prereqs, function(callback) {
  var karmaTest = karma({ configFile: 'app/test/karma.conf.js', files: getFiles() });
  karmaTest.simpleRun(function (exitCode) {
    if(exitCode !== 0) {
      throw new Error('Unit Tests Failed');
    }
  });
});

gulp.task('watch:test:unit', prereqs, function () {
  var karmaTest = karma({ configFile: 'app/test/karma.conf.js', files: getFiles() });
  karmaTest.inBackground();
  karmaTest.start();
});
