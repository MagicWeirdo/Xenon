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
    // TODO: load configuration

    var urlDispathcer = new UrlDispathcer();
    // TODO: loop to load actions

    var requestHandler = new RequestHandler();
    requestHandler.registerUrlDispatcher(urlDispathcer);
    // TODO: loop to load middlewares
    // TODO: loop to load models
    // TODO: loop to load services

    var server = new Server();
    server.setRunningConfig();
    server.registerRequestHandler();

    return server;
  }
}

module.exports = ServerFactory;
