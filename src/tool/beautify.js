/* eslint-disable */
const beautify = SimplyBeautiful();
const sass = new Sass();
export default {
  html: beautify.html,
  css: function(scss, callback) {
    sass.compile(scss, function(result) {
      const cssRes = result.text;
      callback(beautify.css(cssRes));
    });
  }
};