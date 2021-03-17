/* eslint-disable */
// @ts-ignore
const beautify = SimplyBeautiful();
// @ts-ignore
const sass = new Sass();
export default {
  html: beautify.html,
  css: function(scss:any, callback:any) {
    sass.compile(scss, function(result:any) {
      const cssRes = result.text;
      callback(beautify.css(cssRes));
    });
  }
};