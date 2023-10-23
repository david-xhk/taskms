module.exports = function (api) {
  api.cache(true)

  return {
    babelrcRoots: [".", "./packages/*"],
    include: ["./packages/**/*.js", /node_modules\/@han-keong/],
    presets: [["@babel/preset-env", { targets: "defaults" }]]
  }
}
