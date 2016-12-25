const RestfulMiddleware = require("../middlewares/RestfulMiddleware");
const UtilsMiddleware = require("../middlewares/UtilsMiddleware");
const path = require("path");

/**
 * @description
 *
**/
class MiddlewareLoader {
  constructor() {
    this._regex = /(\w+Middleware)/g;
  }

  /**
   * @public
   * @param {String} basePath
   * @param {object} options
   * setup the configuration
  **/
  config(basePath, options) {
    this._basePath = basePath;
    this._options = options;
  }

  /**
   * @public
   * @return {Array}
   * @description
   * load all middlewares
  **/
  loadAllMiddlewares() {
    var basePath = this._basePath;
    var options = this._options;
    var middlewares = [];

    // load RestfulMiddleware
    middlewares.push({
      name: "RestfulMiddleware",
      callback: RestfulMiddleware
    });

    // load UtilsMiddleware
    middlewares.push({
      name: "UtilsMiddleware",
      callback: UtilsMiddleware
    });

    for(var i = 0;this._options.length;i++) {
      var option = options[i];

      middlewares.push({
        name: option.name,
        callback: this._getMiddleware(option.name)
      });
    }

    return middlewares;
  }

  /**
   * @private
   * @param {String} name
   * @return {Function}
   * @description
   *
  **/
  _getMiddleware(name) {
    var re = new RegExp(this._regex);
    var result = re.exec(name);

    // if not match
    if(result === null) {
      throw "Invalid Midleware " + name + " defined in config/settings.js";
    }

    var middleware = result[1];
    var filePath = path.join(this._basePath, "api", "middlewares",
      middleware +".js");

    return require(filePath);
  }
}

module.exports = MiddlewareLoader;
