const { src, dest, series, watch } = require("gulp");
const concat = require("gulp-concat");
const htmlMin = require("gulp-htmlmin");
const autoprefixes = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const svgSprite = require("gulp-svg-sprite");
const image = require("gulp-image");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify-es").default;
const notify = require("gulp-notify");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const browserSync = require("browser-sync").create();

const clean = () => {
  return del(["dist"]);
};

const resources = () => {
  return src("src/resources/**").pipe(dest("dist"));
};
const fonts = () => {
  return src("src/fonts/**").pipe(dest("dist/fonts"));
};

const styles = () => {
  return src("src/styles/**/*.css")
    .pipe(sourcemaps.init())
    .pipe(concat("main.css"))
    .pipe(autoprefixes({ cascade: false }))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(sourcemaps.write())
    .pipe(dest("dist"))
    .pipe(browserSync.stream()); // обновление страницы
};

const stylesDev = () => {
  return src("src/styles/**/*.css")
    .pipe(concat("main.css"))
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
};
const stylesBuild = () => {
  return src("src/styles/**/*.css")
    .pipe(concat("main.css"))
    .pipe(autoprefixes({ cascade: false }))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(dest("dist"));
};

const htmlMinify = () => {
  return src("src/**/*.html")
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
};

const htmlMinifyDev = () => {
  return src("src/**/*.html").pipe(dest("dist")).pipe(browserSync.stream());
};

const htmlMinifyBuild = () => {
  return src("src/**/*.html")
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(dest("dist"));
};

const svgSprites = () => {
  return src("src/images/svg/**/*.svg")
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
          },
        },
      })
    )
    .pipe(dest("dist/images"));
};

const scripts = () => {
  return src(["src/js/components/**/*.js", "src/js/main.js"])
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(concat("app.js"))
    .pipe(uglify({ toplevel: true }).on("error", notify.onError()))
    .pipe(sourcemaps.write())
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
};

const scriptsDev = () => {
  return src(["src/js/components/**/*.js", "src/js/main.js"])
    .pipe(concat("app.js"))
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
};

const scriptsBuild = () => {
  return src(["src/js/components/**/*.js", "src/js/main.js"])
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(concat("app.js"))
    .pipe(uglify({ toplevel: true }).on("error", notify.onError()))
    .pipe(dest("dist"));
};

const images = () => {
  return src([
    "src/images/**/*.jpg",
    "src/images/**/*.png",
    "src/images/**/*.jpeg",
    "src/images/*.svg",
  ])
    .pipe(image())
    .pipe(dest("dist/images"));
};

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });
};

watch("src/**/*.html", htmlMinifyDev);
watch("src/styles/**/*.css", stylesDev);
watch("src/js/**/*.js", scriptsDev);
watch("src/images/svg/**/*.svg", svgSprites);
watch("src/resources/**", resources);
watch("src/fonts/**", fonts);

exports.styles = styles;
exports.htmlMinify = htmlMinify;
exports.scripts = scripts;
exports.scriptsDev = scriptsDev;
exports.scriptsBuild = scriptsBuild;
exports.default = series(
  clean,
  resources,
  fonts,
  htmlMinify,
  styles,
  scripts,
  images,
  svgSprites,
  watchFiles
);

exports.build = series(
  clean,
  resources,
  fonts,
  htmlMinifyBuild,
  stylesBuild,
  scriptsBuild,
  images,
  svgSprites
);

exports.dev = series(
  clean,
  resources,
  fonts,
  htmlMinifyDev,
  stylesDev,
  scriptsDev,
  images,
  svgSprites,
  watchFiles
);
