/**
 * @description
 *
**/
class Action {
  constructor() {
    this._services = {};
  }

  /**
   * @public
   * @param {String} method
   * @description
   * set action method
  **/
  setMethod(method) {
    this._method = method;
  }

  /**
   * @public
   * @param {RegExp} pattern
   * set action pattern
  **/
  setPattern(pattern) {
    this._pattern = pattern;
  }

  /**
   * @public
   * @param {Function} callback
   * description
   *
  **/
  setAction(callback) {
    this._callback = callback;
  }

  /**
   * @public
   * @param {String} name
   * @param {Service} service
   * @description
   * register service to action
  **/
  registerService(name, service) {
    this._services[name] = service;
  }

  /**
   * @public
   * @param {object} data
   * @return {object}
   * @description
   *
  **/
  handle(data) {
    return this._callback(data, this.services);
  }

}
