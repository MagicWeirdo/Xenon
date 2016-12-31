const path = require("path");

module.exports = {
  scope: "singleton",
  name: "$actions",
  factory: function($config, $logger) {
    // action loader to load actions
    var actionLoader = {
      _cache: {},
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
       * @return {Array}
       * @description
       * load all actions
      **/
      loadAll: function() {
        var self = this;
        var options = this._options;

        // load actions
        var actions = [];
        options.forEach(function(option) {
          actions.push({
            method: option.method,
            url: option.url,
            callback: self._getCallback(option.action)
          });
        });

        // load file serve as action
        

        return actions;
      },
      /**
       * @private
       * @param {String} action
       * @return {Function}
       * @description
       * load callback of the given action
      **/
      _getCallback: function(action) {
        var re = new RegExp(/(.+)\.(.+)/);
        var result = re.exec(action);

        // if not match
        if(result === null) {
          $logger.error("invalid action " + action + " defined in config/setting.js");
        }

        var controller = result[1];
        var action = result[2];

        if(this._cache[controller] === undefined) {
          var des = path.join(this._basePath, "api/controllers", controller + ".js");
          this._cache[controller] = require(des);
        }

        return this._cache[controller][action];
      }
    };

    // load & return actions
    actionLoader.config($config.basePath, $config.actions);
    return actionLoader.loadAll();
  }
};
