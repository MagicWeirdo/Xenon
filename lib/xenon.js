const Injector = require("./core/Injector");
const path = require("path");

module.exports = {
  _injector: new Injector(),
  /**
   * @public
   * @param {String} basePath
   * @description
   * set the base path of the app
  **/
  setBasePath: function(basePath) {
    this._basePath = basePath;
  },
  /**
   * @public
   * @description
   * running the app
  **/
  run: function() {
    // initialize the app
    this._init();

    // get & run $server
    var $server = this._injector.getModule("$server");
    $server.run();
  },
  /**
   * @private
   * @description
   * do initialization
  **/
  _init: function() {
    var self = this;
    // register injector itself as dependency
    self._injector.put("singleton", "$injector", function() {
      return self._injector;
    });

    // load configuration
    self._loadConfig();

    // load modules
    self._loadModules();
  },
  /**
   * @private
   * @description
   * load configuration
  **/
  _loadConfig: function() {
    // load configuration file
    var configPath = path.join(this._basePath, "config/setting.js");
    var config = require(configPath);

    // add additional config
    config.basePath = this._basePath;

    // register to $injector
    this._injector.put("singleton", "$config", function() {
      return config;
    });
  }
  /**
   * @private
   * @description
   * load modules
  **/
  _loadModules: function() {
    var self = this;
    var modules = [
      "./config/$actions",
      "./config/middlewares",
      "./http/$requestHandler",
      "./http/$server",
      "./url/$urlDispatcher",
      "./utils/$logger"
    ];

    modules.forEach(function(module) {
      self._injector.uses(require(module));
    });
  }
};
