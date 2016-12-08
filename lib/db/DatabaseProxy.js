const MySqlDatabaseWrapper = require("./MySqlDatabaseWrapper");

/**
 * @description
 * database proxy supports multiple database
**/
class DatabaseProxy {
  constructor() {

  }

  /**
   * @public
   * @param {object} options
   * @description
   * configuring the wrapper
   * {
   *   DRIVER: "mysql"
   *   HOST: "127.0.0.1",
   *   USER: "xxx",
   *   PASSWORD: "xxx",
   *   DATABASE: "xxx" // optioncal
   * }
  **/
  config(options) {
    this._config = options;

    // if it is mysql
    if(config["DRIVER"] === "mysql") {
      this._db = new MySqlDatabaseWrapper();
      this._db.config(options);
    }
  }

  /**
   * @public
   * @param {Function} callback
   * @description
   * execute raw queries
  **/
  rawExecute(callback) {
    this._db.rawExecute(callback);
  }

  /**
   * @public
   * @param {String} sql
   * @param {Array} params
   * @param {Function} callback
   * @description
   * execute database operation
  **/
  execute(sql, params, callback) {
    this._db.execute(sql, params, callback)
  }

}

module.exports = DatabaseProxy;
