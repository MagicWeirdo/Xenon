const path = require("path");

/**
 * @description
 *
**/
class ModelLoader {
  constructor() {
    this._regex = /(\w+Model)/;
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
   * load all models
  **/
  loadAllModels() {
    var options = this._options;
    var models = [];

    for(var i = 0;i < options.length;i++) {
      var option = options[i];

      models.push({
        name: option.name,
        factory: this._getModel(option.factory)
      });
    }

    return models;
  }

  /**
   * @public
   * @param {String} name
   * @return {Function}
   * get the factory of the given name
  **/
  _getModel(name) {
    var re = new RegExp(this._regex);
    var result = re.exec(name);

    if(result === null) {
      throw "Invalid Model " + name + " defined in config/settings.js";
    }

    var model = result[1];
    var filePath = path.join(this._basePath, "api", "models", model + ".js");

    return require(filePath);
  }
}

module.exports = ModelLoader;
