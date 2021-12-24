import tinycolor from 'tinycolor2';

const getColor = (value) => value.toHexString();

const getBrandColors = (hex) => ({
  50: getColor(tinycolor(hex).lighten(58), '50'),
  100: getColor(tinycolor(hex).lighten(52), '100'),
  200: getColor(tinycolor(hex).lighten(40), '200'),
  300: getColor(tinycolor(hex).lighten(28), '300'),
  400: getColor(tinycolor(hex).lighten(11), '400'),
  500: getColor(tinycolor(hex), '500'),
  600: getColor(tinycolor(hex).darken(6), '600'),
  700: getColor(tinycolor(hex).darken(12), '700'),
  800: getColor(tinycolor(hex).darken(18), '800'),
  900: getColor(tinycolor(hex).darken(24), '900'),
});

export default getBrandColors;
