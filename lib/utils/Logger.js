/**
 * @description
 * wrapper of Console.log
**/
class Logger {
  constructor() {

  }

  /**
   * @public
   * @param {object} options
   * @description
   * {
   *   STD_OUT: ...,
   *   STD_ERR: ...
   * }
  **/
  config(options) {
    this._check(options);

    this._logger = new Console(options["STD_OUT"], options["STD_ERR"]);
  }

  /**
   * @private
   * @param {object} options
   * @description
   * check configuration
  **/
  _check(options) {
    if(options["STD_OUT"] === undefined) {
      throw "STD_OUT is not defined";
    }

    if(options["STD_ERR"] === undefined) {
      throw "STD_ERR is not defined";
    }
  }

  /**
   * @public
   * @param {?} data
   * @param {?} args
   * @description
   * to log a message
  **/
  log(data, args) {
    this._logger.log(data, args);
  }
}
