const url = require("url");

/**
 * @description
 * A handler that handles requests
**/
class RequestHandler {
  constructor() {
    this._middlewares = [];
  }

  /**
   * @public
   * @param {UrlDispathcer} urlDispathcer
   * @description
   * register a URL Dispatcher
  **/
  registerUrlDispatcher(urlDispathcer) {
    this._urlDispatcher = urlDispathcer;
  }

  /**
   * @public
   * @param {Function} middleware
   * @description
   * register a middleware
  **/
  registerMiddleware(middleware) {
    this._middlewares.push(middleware);
  }

  /**
   * @public
   * @param {Model} models
   * @description
   * register a model
  **/
  registerModel(model) {
    // TODO:
  }

  /**
   * @public
   * @param {Service} service
   * @description
   * register a service
  **/
  registerService(service) {
    // TODO:
  }

  /**
   * @private
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @description
   * process request object & response object by middlewares
  **/
  _proceedMiddlewares(req, res) {
    for(var i = 0;i < this._middlewares.length;i++) {
      this._middlewares[i](req, res);
    }
  }

  /**
   * @public
   * @param {http.IncomingMessage} req
   * @param {http.RequestHandler} res
   * @description
   * handle request
  **/
  handle(req, res) {
    var method = req.method;
    var pathname = url.pase(req.url).pathname;
    console.log("Received Method: " + method + " URL: " + pathname);

    // process request object and response object by middlewares
    this._proceedMiddlewares(req, res);

    var action = this._urlDispatcher.dispatch(req, res);

    if(action !== null) {
      // TODO: get path variables

      // TODO: get models

      // TODO: get services

      // TODO: execute Action
    }

  }
}

module.exports = RequestHandler;
