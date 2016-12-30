const path = require("path");

module.exports = {
  scope: "singleton",
  name: "$middlewares",
  factory: function($config, $logger) {
    // middleware loader to load middlewares
    var middlewareLoader = {
      /**
       * @public
       * @param {String} basePath
       * @param {object} options
       * @description
       * setup the configuration
      **/
      config: function(basePath, options) {
        this._basePath = basePath;
        this._options = options;
      },
      /**
       * @public
       * @description
       * load all middlewares
      **/
      loadAll: function() {
        var self = this;
        var options = this._options;

        var middlewares = [];
        options.forEach(function(option) {
          middlewares.push({
            name: option.name,
            callback: self._getCallback(option.name)
          });

          $logger.log("%s is loaded", option.name);
        });

        return middlewares;
      },
      /**
       * @private
       * @param {String} name
       * @return {Function}
      **/
      _getCallback: function(name) {
        var des = path.join(this._basePath, "api/middlewares", name + ".js");
        return require(des);
      }
    };

    // load & return middlewares
    middlewareLoader.config($config.basePath, $config.middlewares);
    return middlewareLoader.loadAll();
  }
};
