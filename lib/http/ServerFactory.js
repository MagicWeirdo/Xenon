const UrlDispatcher = require("../url/UrlDispatcher");
const ActionLoader = require("../config/ActionLoader");
const FileSender = require("../utils/FileSender");
const path = require("path");
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

    // configuring UrlDispatcher
    var urlDispatcher = new UrlDispatcher();

    // configuring action loader
    var actionLoader = new ActionLoader();
    actionLoader.config(config["BASE_PATH"], config["ACTIONS"]);

    // load action
    var actions = actionLoader.loadAllActions();
    for(var i = 0;i < actions.length;i++) {
      var action = actions[i];
      urlDispatcher.registerAction(
        action.method,
        action.pattern,
        action.callback
      );

      console.log("Register Action to Method: " + action.method +
        " Pattern: " + action.pattern);
    }

    // configure file sender
    var fileSender = new FileSender();
    fileSender.setDirectory(path.join(config["BASE_PATH"], "files"));

    // register files
    var files = config["FILE"];
    for(var j = 0;j < files.length;j++) {
      var file = files[j];
      fileSender.registerFile(file.pattern, file.filePath);

      console.log("Register File to Path " + file.filePath + " Pattern "
        + file.pattern);
    }

    // register file sender
    urlDispatcher.registerFileSender(fileSender);


    // configuring RequestHandler
    var requestHandler = new RequestHandler();
    requestHandler.registerUrlDispatcher(urlDispatcher);

    // configuring middleware loader
    var middlewareLoader = new MiddlewareLoader();
    middlewareLoader.config(config["BASE_PATH"], config["MIDDLEWARES"]);

    // load middlewares
    var middlewares = middlewareLoader.loadAllMiddlewares();
    for(var k = 0;k < middlewares.length;k++) {
      requestHandler.registerMiddleware(middlewares[k].callback);

      console.log(middlewares[k].name + " is loaded");
    }

    var server = new Server();
    server.setRunningConfig(config["HOST_NAME"], config["PORT"]);
    server.registerRequestHandler(requestHandler);

    return server;
  }
}

module.exports = ServerFactory;
