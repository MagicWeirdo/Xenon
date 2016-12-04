const path = require("path");
const ConfigurationLoader = require("./config/ConfigurationLoader");
const ServerFactory = require("./http/ServerFactory");

class App {
  constructor() {

  }

  /**
   * @public
   * @param {String} basePath
   * @description
   * set the base path of the project
  **/
  setBasePath(basePath) {
    this._basePath = basePath;
  }

  /**
   * @public
   * @description
   * running the application
  **/
  run() {
    // setup configuration loader
    var configLoader = new ConfigurationLoader();
    var configPath = path.join(this._basePath, "config", "local.js");
    configLoader.setConfigLocation(configPath);

    // setup server factory
    var serverFactory = new ServerFactory();
    serverFactory.setConfigLoader(configLoader);
    
    // create and run server
    this._server = serverFactory.createServer();
    this._server.run();
  }
}