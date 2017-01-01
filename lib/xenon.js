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

    // load middlewares
    self._loadMiddlewares();
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
  },
  /**
   * @private
   * @description
   * load modules
  **/
  _loadModules: function() {
    var self = this;
    var modules = [
      "config/$actions",
      "config/$files",
      "config/$middlewares",
      "db/$dbProxy",
      "db/$mysql",
      "http/$requestHandler",
      "http/$server",
      "url/$urlDispatcher",
      "utils/$cache",
      "utils/$logger",
      "utils/$mimeUtil"
    ];

    // load built-in modules
    modules.forEach(function(module) {
      self._injector.uses(require(path.join(__dirname, module)));
    });

    // load user defined services
    var $config = self._injector.getModule("$config");
    var $logger = self._injector.getModule("$logger");
    var basePath = $config.basePath;
    var services = $config.services;
    services.forEach(function(service) {
      self._injector.put(
        service.scope,
        service.name,
        require(path.join(basePath, "api/services", service.name))
      );

      $logger.log(service.name + " is loaded");
    });

    // load user defiend models
    var models = $config.models;
    models.forEach(function(model) {
      self._injector.put(
        "singleton",
        model.name,
        require(path.join(basePath, "api/models", model.name))
      );

      $logger.log(model.name + " is loaded");
    });
  },
  /**
   * @private
   * @description
   * load built-in middlewares
  **/
  _loadMiddlewares: function() {
    var middlewares = [
      { name: "$restfulMiddleware", path: "middleware/$restfulMiddleware" },
      { name: "$utilsMiddleware", path: "middleware/$utilsMiddleware" }
    ];

    // load built-in middlewares
    var $middlewares = this._injector.getModule("$middlewares");
    middlewares.forEach(function(middleware) {
      $middlewares.push({
        name: middleware.name,
        callback: require(path.join(__dirname, middleware.path))
      });
    });
  }
};
