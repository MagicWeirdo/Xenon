const path = require("path");

/**
 * @description
 * load action and
**/
class ActionLoader {
  constructor() {
    this._pattern = /(\w+Controller)\.(\w+)/;
    // cache controllers
    this._cache = {};
  }

  /**
   * @public
   * @param {String} basePath
   * @param {object} options
   * @description
   * setup the configuration
  **/
  config(basePath, options) {
    this._basePath = basePath;
    this._options = options;
  }

  /**
   * @public
   * @description
   * load actions
  **/
  loadAllActions() {
    var basePath = this._basePath;
    var options = this._options;
    var actions = [];

    for(var i = 0;i < options.length;i++) {
      var option = options[i];

      // add action
      actions.push({
        method: option.method,
        pattern: option.pattern,
        callback: this._getAction(option.name)
      });
    }

    return actions;
  }

  _reset() {
    this._re = new RegExp(this._pattern, "g");
  }

  /**
   * @private
   * @param {String} name
   * @return {Function}
   * @description
   *
  **/
  _getAction(name) {
    this._reset();
    var result = this._re.exec(name);

    // if not match
    if(result === null) {
      throw "Invalid Action " + name + " defined in config/settings.js";
    }

    var controller = result[1];
    var action = result[2];

    var ctrlPath = path.join(this._basePath, "api", "controllers", controller
      + ".js");

    this._cache[controller] = require(ctrlPath);
    return this._cache[controller][action];
    // if(this._cache[controller] === undefined) {
    //   // if it is not in cache
    //   var ctrlPath = path.join(this._basePath, "api", "controllers", controller
    //     + ".js");
    //
    //   this._cache[controller] = require(ctrlPath);
    //
    // }
    //
    // // TODO: bug
    // console.log(this._cahce);
    // return this._cahce[controller][action];
  }
}

module.exports = ActionLoader;
