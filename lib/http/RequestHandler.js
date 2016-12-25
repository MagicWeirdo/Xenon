const url = require("url");
const Injector = require("../core/Injector");

/**
 * @description
 * A handler that handles requests
**/
class RequestHandler {
  constructor() {
    this._middlewares = [];
    this._injector = new Injector();
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
   * @param {String} name
   * @param {Function} factory
   * @description
   * register model with given name and factory method
  **/
  registerModel(name, factory) {
    this._injector.put(name, factory);
  }

  /**
   * @public
   * @param {String} name
   * @param {Function} factory
   * @description
   * register service with given name and factory method
  **/
  registerService(name, factory) {
    this._injector.put(name, factory);
  }

  /**
   * @public
   * @param {Function} callback
   * @description
   * fully access to configure injector
  **/
  configInjector(callback) {
    callback(this._injector);
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
   * @private
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @description
   * process request object & response object by middlewares
  **/
  _proceedMiddlewares(req, res) {
    for(var i = 0;i < this._middlewares.length;i++) {
      try {
        // dependency injection
        var callback = this._injector.inject(this._middlewares[i]);

        // execute
        callback(req, res);
      }catch(err) {
        throw err;
      }
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
    var pathname = url.parse(req.url).pathname;
    console.log("Received Method: " + method + " URL: " + pathname);

    // process request object and response object by middlewares
    this._proceedMiddlewares(req, res);

    var callback = this._urlDispatcher.dispatch(req, res);

    // execute ation
    if(callback !== null) {
      try {
        // dependency injection
        callback = this._injector.inject(callback);

        // execute action
        callback(req, res);

        console.log("Dispatched Method " + method + " URL " + pathname);
      }catch(err) {
        throw err;
      }
    }
  }
}

module.exports = RequestHandler;
