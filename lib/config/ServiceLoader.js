const path = require("path");
const fs = require("fs");

/**
 * @description
 *
**/
class ServiceLoader {
  constructor() {
    this._regex = /(\w+Service)/;
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
   * @return {Array}
   * @description
   * load all services
  **/
  loadAllServices() {
    var options = this._options;
    var services = [];

    // preload services
    var servicesPath = path.resolve(path.join(global.libPath, "services"));

    // get all service filenames
    try {
      var files = fs.readdirSync(servicesPath);
      for(var i = 0;i < files.length;i++) {
        var service = require(path.join(servicesPath, files[i]));

        services.push({
          scope: service.scope,
          name: service.name,
          factory: service.factory
        });
      }
    }catch(err) {
      throw err;
    }

    // load user defined services
    for(var j = 0;j < options.length;j++) {
      var option = options[j];

      services.push({
        scope: option.scope,
        name: option.name,
        factory: this._getService(option.factory)
      });
    }

    return services;
  }

  /**
   * @public
   * @param {String} name
   * @return {Function}
   * get the factory of the given name
  **/
  _getService(name) {
    var re = new RegExp(this._regex);
    var result = re.exec(name);

    if(result === null) {
      throw "Invalid Service " + name + " defined in config/settings.js";
    }

    var service = result[1];
    var filePath = path.join(this._basePath, "api", "services", service + ".js");

    return require(filePath);
  }
}

module.exports = ServiceLoader;
