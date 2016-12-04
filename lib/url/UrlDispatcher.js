const url = require("url");

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
      pattern: pattern,
      callback: callback
    });
  }

  /**
   * @public
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   * @return {Function|null}
   * @description
   * dispatch request to an Action and return it
  **/
  dispatch(req, res) {
    var method = req.method;
    var pathname = url.parse(req.url).pathname;

    console.log("Dispatching Method: " + method + " URL: " + pathname);

    for(var i = 0;i < this._actions.length;i++) {
      var action = this._actions[i];
      if(action.method === method && action.pattern.test(pathname)) {
        console.log("Dispatched Method: " + method + " URL: " + pathname);

        return action.callback;
      }
    }

    res.sendNotFound();
    console.log("Handled invalid Method: " + method + " URL: " + pathname);
    return null;
  }
}
