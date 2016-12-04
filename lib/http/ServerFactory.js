const UrlDispathcer = require("../url/UrlDispathcer");
const ActionLoader = require("../config/ActionLoader");
const RequestHandler = require("./RequestHandler");
const MiddlewareLoader = require("../config/MiddlewareLoader");
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
   * @param {object} config
   * @description
   * set configuration to create Server
  **/
  setConfig(config) {
    this._config = config;
  }

  /**
   * @public
   * @return {Server}
   * @description
   *
  **/
  createServer() {
    // load configuration
    var config = this._config;

    // configuring UrlDispathcer
    var urlDispathcer = new UrlDispathcer();

    // configuring action loader
    var actionLoader = new ActionLoader();
    actionLoader.config(config["BASE_PATH"], config["ACTIONS"]);

    // load action
    var actions = actionLoader.loadAllActions();
    for(var i = 0;i < actions.length;i++) {
      var action = actions[i];
      urlDispathcer.registerAction(
        action.method,
        action.pattern,
        action.callback
      );

      console.log("Register Action  to Method: " + action.method +
        " Pattern: " + action.pattern);
    }

    // configuring RequestHandler
    var requestHandler = new RequestHandler();
    requestHandler.registerUrlDispatcher(urlDispathcer);

    // configuring middleware loader
    var middlewareLoader = new MiddlewareLoader();
    middlewareLoader.config(config["BASE_PATH"], config["MIDDLEWARES"]);

    // load middlewares
    var middlewares = middlewareLoader.loadAllMiddlewares();
    for(var j = 0;j < middlewares.length;j++) {
      requestHandler.registerMiddleware(middlewares[j].callback);

      console.log(middlewares[j].name + " is loaded");
    }

    var server = new Server();
    server.setRunningConfig(config["HOST_NAME"], config["PORT"]);
    server.registerRequestHandler(requestHandler);

    return server;
  }
}

module.exports = ServerFactory;
