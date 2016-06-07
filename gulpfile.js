
var gulp = require('gulp');
var connect = require('gulp-connect');

/* plugins
var connect = require('gulp-connect');

gulp.task('default', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});*/


// add near to the top of the file
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
