const mysql = require("mysql");

/**
 * @description
 * database wrapper for mysql operation
**/
class MySqlDatabaseWrapper {
  constructor() {

  }

  /**
   * @public
   * @param {object} options
   * @description
   * configuring the wrapper
   * {
   *   HOST: "127.0.0.1",
   *   USER: "xxx",
   *   PASSWORD: "xxx",
   *   DATABASE: "xxx" // optioncal
   * }
  **/
  config(options) {
    this._config = options;
    this._check();
  }

  /**
   * @private
   * @description
   * check the configuration
  **/
  _check() {
    var config = this._config;

    if(config["HOST"] === undefined) {
      throw "HOST has to be set to be able to access database";
    }

    if(config["USER"] === undefined) {
      throw "USER has to be set to be able to access database";
    }

    if(config["PASSWORD"] === undefined) {
      throw "PASSWORD has to be set to be able to access database";
    }

    if(config["DATABASE"] === undefined) {
      throw "DATABASE has to be set to be able to access database";
    }
  }

  /**
   * @private
   * @param {Function} callback
   * @description
   * get database connection
  **/
  _operate(callback) {
    var config = this._config;

    var conn = mysql.createConnection({
      host: config["HOST"],
      user: config["USER"],
      password: config["PASSWORD"],
      database: config["DATABASE"]
    });

    conn.connect();
    callback(conn);
    conn.end();
  }

  /**
   * @public
   * @param {Function} callback
   * @description
   * execute raw queries
  **/
  rawExecute(callback) {
    this._operate(callback);
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
    this._operate((conn) => {
      conn.query(sql, params, callback);
    });
  }

}

module.exports = MySqlDatabaseWrapper;
