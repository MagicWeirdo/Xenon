const Action = require("../http/Action");
const path = require("path");

/**
 * @description
 * load action and
**/
class ActionLoader {
  constructor() {
    this._re = /(\w+Controller)\.(\w+)/g;
    // cache controllers
    this._cache = {};
  }

  /**
   * @public
   * @param {object} config
   * @description
   * setup the configuration
  **/
  config(config) {
    this._config = config;
  }

  /**
   * @public
   * @description
   * load actions
  **/
  loadActions() {
    var basePath = this._config["BASE_PATH"];
    var actionsConfig = this._config["ACTIONS"];
    var actions = [];

    for(var i = 0;i < actionsConfig.length;i++) {
      var option = actionsConfig[i];

      var action = new Action();
      action.setMethod(option.method);
      action.setPattern(option.pattern);
      action.setAction(this._getAction(option.action));

    }

    return actions;
  }

  /**
   * @private
   * @param {String} name
   * @return {Function}
   * @description
   *
  **/
  _getAction(name) {
    var result = this._re.exec(name);
    // TODO: error handling
    var controller = result[1];
    var action = result[2];

    if(this._cache[controller] === undefined) {
      // if it is not in cache
      var ctrlPath = path.join(this._config["BASE_PATH"], "api"
        , "controllers", controller);

      this._cache[controller] = require(ctrlPath);
    }

    return this._cahce[controller][action];
  }

  /**
   * @private
   * @param {name}
  **/
  _getService(name) {

  }
}
