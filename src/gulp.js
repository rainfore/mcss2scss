var through = require('through2');
var gutil = require('gulp-util');
var mcss2scss = require('./index.js');

var PluginError = gutil.PluginError;

var extend = function(o1, o2, override) {
    for(var i in o2)
        if(override || o1[i] === undefined)
            o1[i] = o2[i];

    return o1;
}

module.exports = function (options) {
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) return cb(null, file); 
        if (file.isStream()) return cb(new PluginError('gulp-mcss2scss', 'Streaming not supported'));

        var src = file.contents.toString();
        var dest = mcss2scss(src, options);

        file.contents = new Buffer(dest);
        file.path = file.path.replace(/\.mcss$/, '.scss');
        cb(null, file);
    });
};