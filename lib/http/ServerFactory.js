const UrlDispathcer = require("../url/UrlDispathcer");
const RequestHandler = require("./RequestHandler");
const Server = require("./Server");

/**
 * @description
 * Factory to manufacture Server to serve web content
**/
class ServerFactory {
  constructor() {

  }

  /**
   * @public
   * @param {ConfigurationLoader} configLoader
   * @description
   * set configuration loader for the factory
  **/
  setConfigLoader(configLoader) {
    this._configLoader = configLoader;
  }

  /**
   * @public
   * @return {Server}
   * @description
   *
  **/
  createServer() {
    // load configuration
    var config = this._configLoader.load();

    var urlDispathcer = new UrlDispathcer();
    // TODO: loop to load actions

    var requestHandler = new RequestHandler();
    requestHandler.registerUrlDispatcher(urlDispathcer);
    // TODO: loop to load middlewares
    // TODO: loop to load models
    // TODO: loop to load services

    var server = new Server();
    server.setRunningConfig(config["HOST_NAME"], config["PORT"]);
    server.registerRequestHandler(requestHandler);

    return server;
  }
}

module.exports = ServerFactory;
