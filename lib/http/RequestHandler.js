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
    var pathname = url.parse(req.url).pathname;
    console.log("Received Method: " + method + " URL: " + pathname);

    // process request object and response object by middlewares
    this._proceedMiddlewares(req, res);

    var action = this._urlDispatcher.dispatch(req, res);

    if(action !== null) {
      // check method
      if(method === "GET") {
        // check path variables
        if(action.pathVals !== undefined) {
          res.sendAsJson(action.callback(data, action.pathVals));
        }else {
          res.sendAsJson(action.callback(data));
        }
      }else if(method === "POST") {
        // check path variables
        if(action.pathVals !== undefined) {
          req.readAsJson((data) => {
            res.sendAsJson(action.callback(data, action.pathVals));
          });
        }else {
          req.readAsJson((data) => {
            res.sendAsJson(action.callback(data));
          });
        }
      }else if(method === "PUT") {
        // TODO: add the featrue later
        res.sendNotFound();
      }else if(method === "PATCH") {
        // TODO: add the featrue later
        res.sendNotFound();
      }else if(method === "DELETE") {
        // TODO: add the featrue later
        res.sendNotFound();
      }

      console.log("Dispatched Method " + method + " URL " + pathname);
    }
  }
}

module.exports = RequestHandler;
