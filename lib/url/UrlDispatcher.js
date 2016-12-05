const url = require("url");
const UrlMatcher = require("./UrlMatcher");

/**
 * @description
 * dispatch request to specific Action
**/
class UrlDispathcer {
  constructor() {
    this._actions = [];
  }

  /**
   * @public
   * @param {String} method
   * @param {RegExp} pattern
   * @param {Function} callback
   * @return {Action|null}
   * @description
   * register an Action to UrlDispathcer
  **/
  registerAction(method, pattern, callback) {
    this._actions.push({
      method: method,
      matcher: new UrlMatcher(pattern),
      callback: callback
    });
  }

  /**
   * @public
   * @param {FileSender} fileSender
   * @description
   * register a file sender
  **/
  registerFileSender(fileSender) {
    this._fileSender = fileSender;
  }

  /**
   * @public
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @return {object|null}
   * @description
   * dispatch request to an Action and return it
  **/
  dispatch(req, res) {
    var method = req.method;
    var pathname = url.parse(req.url).pathname;

    console.log("Dispatching Method: " + method + " URL: " + pathname);

    // dispatch to action
    for(var i = 0;i < this._actions.length;i++) {
      var action = this._actions[i];

      // if method matches
      if(action.method === method) {
        // if pathname matches
        if(action.matcher.match(pathname)) {
          // has variables
          if(action.matcher.hasPathVariables()) {
            return {
              callback: action.callback,
              pathVals: action.matcher.getPathVariables()
            };
          }else {
            return {
              callback: action.callback
            }
          }
        }
      }
    }

    // dispatch to file sender
    if(this._fileSender.matchAndSend(res, pathname)) {
      return null;
    }

    // handle not found
    res.sendNotFound();
    console.log("Handled invalid Method: " + method + " URL: " + pathname);
    return null;
  }
}

module.exports = UrlDispathcer;
