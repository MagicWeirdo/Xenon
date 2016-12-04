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
    this._configPath = path;
  }

  /**
   * @public
   * @return {object}
  **/
  load() {
    this._checkConfig();

    return require(this._configPath);
  }

  /**
   * @private
   * @description
   * check configuration
   * TODO:
  **/
  _checkConfig() {

  }
}

module.exports = ConfigurationLoader;
