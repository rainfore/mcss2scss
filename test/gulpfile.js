var gulp = require('gulp');
var mcss2scss = require('../src/gulp.js');

gulp.task('mcss2scss', function() {
    return gulp.src('./*.mcss')
    .pipe(mcss2scss())
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['mcss2scss']);