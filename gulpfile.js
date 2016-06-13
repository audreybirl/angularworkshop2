
var gulp = require('gulp');
    connect = require('gulp-connect'),
    eslint = require('gulp-eslint'),
    _ = require('lodash'),
    jsPath = [
          'app/!(vendor)/**/*.js',
          'test/**/*.js',
          '!test/unit/dataMocks/**/*.js',
          '!app/jadeTemplates.js'
    ],
    protractor = require('gulp-protractor'),
    argv = require('yargs').argv,
    logger = require('log4js').getLogger(),
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
    prereqs = ([]).concat('test:clean'),
    portfinder = require('portfinder'),
    testPaths = {
            protractor: {
                configurationFile: 'app/test/protractor.conf.js'
            },
            functional: {
                testFiles: 'app/test/functional/**/*-spec.js'
            },
            smoke: {
                testFiles: 'test/smoke/**/*-spec.js'
            }
        };


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


gulp.task('webdriver_update', protractor.webdriver_update);

function formattedArguments(args) {
    return _(args).
        pick('grid', 'baseUrl', 'env', 'parallel', 'useMocks').
        map(function (value, key) {
            return ['--' + key, value];
        }).
        flatten().
        value();
}

function runProtractor(files, args) {
    return gulp.src(files)
        .pipe(protractor.protractor({
            configFile: testPaths.protractor.configurationFile,
            args: formattedArguments(args || argv)
        }));
}

var integrationServerOptions = _.identity;

gulp.task('test:functional', ['webdriver_update'], function(callback) {
    var args = _.assign({
        useMocks: true
    }, argv);


    if (args.env || args.baseUrl) {
        return runProtractor([testPaths.functional.testFiles], args);
    } else {
        logger.info('Using connect local server');
        return portfinder.getPort(function (__, port) {
            connect.server(integrationServerOptions({
                root: 'app',
                port: port
            }));
            args.baseUrl = 'http://localhost:' + port + '/';
            return runProtractor([testPaths.functional.testFiles], args)
                .on('end', function () {
                    connect.serverClose();
                    callback();
                });
        });
    }
});

