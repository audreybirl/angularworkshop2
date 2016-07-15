
var gulp = require('gulp'),
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
            'app/vendor/jquery/dist/jquery.js',
            'app/vendor/angular/angular.js',
            'app/vendor/angular-animate/angular-animate.js',
            'app/vendor/angular-route/angular-route.js',
            'app/vendor/angular-mocks/angular-mocks.js',
            'app/vendor/lodash/lodash.js',
            'app/config/*.js',
            'app/core/**/*.js',
            'app/user/userModule.js',
            'app/user/userController.js',
            'app/user/userRestService.js',
            'test/unit/**/*-spec.js'
      ]
    },
    del = require('del'),
    karma = require('node-karma-wrapper'),
    prereqs = ([]).concat('test:clean'),
    portfinder = require('portfinder'),
    testPaths = {
            protractor: {
                configurationFile: 'test/protractor.conf.js'
            },
            functional: {
                testFiles: 'test/functional/**/*-spec.js'
            },
            smoke: {
                testFiles: 'test/smoke/**/*-spec.js'
            }
    },
    proxyList = [
      '^/testendpoint/(.*)$ http://localhost:1337/$1 [P]',
      '^/groups/(.*)$ http://localhost:1337/$1 [P]'
    ],
    modRewrite = require('connect-modrewrite'),
    integrationServerOptions = _.identity;

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
  var karmaTest = karma({ configFile: 'test/karma.conf.js', files: getFiles() });
  karmaTest.simpleRun(function (exitCode) {
    if(exitCode !== 0) {
      throw new Error('Unit Tests Failed');
    }
  });
});

gulp.task('watch:test:unit', prereqs, function () {
  var karmaTest = karma({ configFile: 'test/karma.conf.js', files: getFiles() });
  karmaTest.inBackground();
  karmaTest.start();
});


gulp.task('webdriver_update', function(){
  //'webdriver-manager start';
  protractor.webdriver_update;
});

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


gulp.task('test:functional', ['webdriver_update'], function(callback) {

    console.log("inside the functional");
    console.log(callback);

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

