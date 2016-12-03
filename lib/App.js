const ConfigurationLoader = require("./config/ConfigurationLoader");
const ServerFactory = require("./http/ServerFactory");

class App {
  constructor() {

  }

  /**
   * @public
   * @param {String} path
   * @description
   * set the base path of the project
  **/
  setBasePath(path) {
    this._basePath = path;
  }

  /**
   * @public
   * @description
   * running the application
  **/
  run() {
    // setup configuration loader
    var configLoader = new ConfigurationLoader();
    configLoader.setConfigLocation();

    // setup server factory
    var serverFactory = new ServerFactory();
    serverFactory.setConfigLoader(configLoader);

    // create and run server
    this._server = serverFactory.createServer();
    this._server.run();
  }
}
