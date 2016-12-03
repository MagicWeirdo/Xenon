/**
 * @description
 * loader to dynamically load configurations
**/
class ConfigurationLoader {
  constructor() {

  }

  /**
   * @public
   * @param {String} path
   * @description
   * set the configuration file location to be loaded
  **/
  setConfigLocation(path) {
    this._basePath = path;
  }

  /**
   * @public
   * 
  **/
  load() {
    //
  }
}

module.exports = ConfigurationLoader;
