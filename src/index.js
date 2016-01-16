module.exports = function(src, options) {
    options = options || {};

    var dest = src
        .replace(/@import([\s\S]+?)\.mcss([\s'"]+?);/g, '@import$1.scss$2;')    // *.mcss -> *.scss
        .replace(/(?!\$)index\((.*),(.*)\)/g, 'nth($1,$2 + 1)')    // index -> nth
        .replace(/typeof/g, 'type-of')    // typeof -> type-of
        .replace(/(?!\$)(?:a-adjust|fade)\((.*),(.*),\s*true\)/g, 'fade_out($1, 1 -$2)')    // a-adjust- -> fade-out
        .replace(/(?!\$)(?:a-adjust|fade)\((.*),\s*-(.*)\)/g, 'fade_out($1,$2)')    // a-adjust- -> fade-out
        .replace(/(?!\$)(?:a-adjust|fade)\((.*),\s*(.*)\)/g, 'fade_in($1,$2)')    // a-adjust -> fade-in
        .replace(/(?!\$)l-adjust\((.*),\s*-(.*)\)/g, 'darken($1,$2)')    // l-adjust- -> darken
        .replace(/(?!\$)l-adjust\((.*),\s*(.*)\)/g, 'lighten($1,$2)')    // l-adjust -> lighten
        .replace(/(?!\$)s-adjust\((.*),\s*-(.*)\)/g, 'desaturate($1,$2)')    // s-adjust- -> desaturate
        .replace(/(?!\$)s-adjust\((.*),\s*(.*)\)/g, 'saturate($1,$2)')    // s-adjust -> saturate
        .replace(/(?!\$)h-adjust\((.*),\s*(.*)\)/g, 'adjust-hue($1,$2)')    // h-adjust- -> adjust-hue
        .replace(/\$([\w-]+?)\s*\??=\s*([\(\{])/g, '@mixin $1$2')    // $function -> @mixin
        .replace(/\$([\w-]+?)\(/g, '@include $1(')    // $function() -> @include mixin
        .replace(/\$([\w-]+?)\s*:\s*(.*?)\s*;/g, '@include $1($2);')    // $function:  -> @include mixin
        .replace(/@for(.*?)of(.*?)\.{3}/g, '@for$1from$2 through ')    // @for of ... -> @for from through
        .replace(/@for(.*?)in/g, '@each$1in')    // @for in -> @each in
        .replace(/\s*\&\&\s*/g, ' and ')    // && -> and
        .replace(/\s*\|\|\s*/g, ' or ')    // || -> or
        // .replace(/\s*!\s*/g, ' not ')    // ! -> not
        .replace(/\$([\w-]+?)\s*\??=(?!=)([\s\S]+?)([;,\(\)\{\}])/g, '$$$1:$2$3')    // = -> :
    ;

    if(options.importCSS) {
        dest = dest
            .replace(/@import([\s\S]+?)\.css([\s'"]+?);/g, '@import$1$2;')
        ;
    }

    // for mass
    if(options.mass || options.mass2scss) {
        dest = dest
            .replace(/@include placeholder\((\{[\s\S]*?\})\);/g, '&::-webkit-input-placeholder $1 &::-moz-placeholder $1 &:-moz-placeholder $1 &:-ms-placeholder $1')
            .replace(/@include keyframes\((.*),\s*(\{[\s\S]*?\})\);/g, '@keyframes $1 $2')
            .replace(/@import "mass\/mass\/index\.scss";/g, '@import "mass2scss/dist/index.scss";')
            // .replace(/@import "mass\/mass\/index\.scss";/g, '@import "../../node_modules/mass2scss/dist/index.scss";')
        ;
    }

    if(options.mass2scss) {
        dest = dest
            .replace(/\$prefix-properties:[\s\S]*?;/g, function(m) {
                m = m.replace(/\/\/.*\n/g, '').replace(/null/g, '(webkit moz ms o)')

                var cap, reg = /\s+([\w-]+)\s+\(?(.*?)\)?[,;]/g;
                var result = [];
                while(cap = reg.exec(m)) {
                    var property = cap[1];
                    var prefixes = cap[2].split(' ');
                    var mixin = prefixes.map(function(prefix) {
                        return '-' + prefix + '-' + property + ': $value;';
                    }).join('');
                    mixin = '@mixin ' + property + '($value...) {' + mixin + (property + ': $value;') + '}';
                    result.push(mixin);
                }

                return result.join('\n');
            })
            .replace(/\@include -generate\((.*?),\s*\(\$prefix,?(.*?)\)\s*(\{[\s\S]*?\})(?:,\s*\{([\s\S]*?)\})?\);/g, function(m, $1, $2, $3, $4) {
                $2 = $2.trim() && '(' + $2 + ')';
                // $3 = $3.replace(/#\{\$prefix\}/, '');
                // $3 = $3.replace(/#\{\$prefix\}(.*?):(.*?)([;\}])/g, '@include $1($2)$3');

                var result = [];
                result.push('@mixin ' + $1 + $2 + '{');
                
                ['-webkit-', '-moz-', '-o-', ''].forEach(function(prefix) {
                    result.push('@' + prefix + 'keyframes ' + $1 + $3.replace(/#\{\$prefix\}/g, prefix));
                });

                result.push('.animated.' + $1 + '{@include animation-name(' + $1 + ');' + ($4 || '').trim() + '}');

                result.push('}');

                return result.join('\n');
            });
        ;
    }

    return dest;
}