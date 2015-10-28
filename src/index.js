module.exports = function(src) {
    var dest = src.replace(/\$([\w-]+?)\s*=([\s\S]+?);/g, '$$$1:$2;');

    return dest;
}