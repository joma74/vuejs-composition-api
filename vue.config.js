/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  // See https://github.com/vuejs/vue-cli/issues/2978#issuecomment-441511019
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.devtool = "eval-source-map"
      config.output.devtoolModuleFilenameTemplate = (info) =>
        info.resourcePath.match(/\.vue$/) &&
        !info.identifier.match(/type=script/) // this is change ✨
          ? `webpack-generated:///${info.resourcePath}?${info.hash}`
          : `webpack-yourCode:///${info.resourcePath}`

      config.output.devtoolFallbackModuleFilenameTemplate =
        "webpack:///[resource-path]?[hash]"
    }
  },
}
