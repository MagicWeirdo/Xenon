const UrlDispatcher = require("../url/UrlDispatcher");
const ActionLoader = require("../config/ActionLoader");
const FileSender = require("../utils/FileSender");
const path = require("path");
const RequestHandler = require("./RequestHandler");
const MiddlewareLoader = require("../config/MiddlewareLoader");
const ModelLoader = require("../config/ModelLoader");
const ServiceLoader = require("../config/ServiceLoader");
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
   * create a server fully configured
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
    var files = config["FILES"];
    for(var j = 0;j < files.length;j++) {
      var file = files[j];
      fileSender.registerFile(file.pattern, file.filePath);
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

    // configuring model loader
    var modelLoader = new ModelLoader();
    modelLoader.config(config["BASE_PATH"], config["MODELS"]);

    // load models
    var models = modelLoader.loadAllModels();
    for(var n = 0; n < models.length;n++) {
      requestHandler.registerModel(models[n].name, models[n].factory);

      console.log(models[n].name + " is loaded");
    }

    // configuring service loader
    var serviceLoader = new ServiceLoader();
    serviceLoader.config(config["BASE_PATH"], config["SERVICES"]);

    // load services
    var services = serviceLoader.loadAllServices();
    for(var m = 0;i < services.length;m++) {
      requestHandler.registerService(services[i].name, services[i].factory);
    }

    var server = new Server();
    server.setRunningConfig(config["HOST_NAME"], config["PORT"]);
    server.registerRequestHandler(requestHandler);

    return server;
  }
}

module.exports = ServerFactory;
