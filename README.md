# mcss2scss
A [MCSS](https://github.com/leeluolee/mcss)-to-[SCSS](http://sass-lang.com) converter.

I make this converter just because SCSS is too popular but I still tend to use MCSS.

Some features cannot be converted entirely.

### Following features can be converted entirely

- `@import *.mcss` -> `@import *.scss`
- `index($list, $index)` -> `nth($list, $index + 1)`
- `typeof` -> `type-of`
- `a-adjust` -> `fade_in` or `fade_out`
- `l-adjust` -> `lighten` or `darken`
- `s-adjust` -> `saturate` or `desaturate`
- `h-adjust` -> `adjust-hue`
- `$function = {}` -> `@mixin: {}`
- `$xxx = (...){...}` -> `@mixin xxx(...){...}`
- `$xxx(...)` -> `@include $xxx(...)`
- `@for ... of x...x` -> `@for ... from x through x`
- `@for ... in` -> `@each ... in`
- `=` -> `:`
- `mass/mass/index.mcss` -> `mass2scss/dist/index.scss`

### Following features **CANNOT** be converted

- `x-adjust(..., ..., true/false)` ->
- `$function = {}` -> `@function`
- `$keyframe` -> `@-prefix-keyframe`
- Any features **NOT** mentioned above
