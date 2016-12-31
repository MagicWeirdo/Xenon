const mysql = require("mysql");

module.exports = {
  scope: "singleton",
  name: "$mysql",
  factory: function($logger) {
    return {
      /**
       * @public
       * @param {object} options
       * @description
       * configuring $mysql
       * {
       *   host: "127.0.0.1",
       *   user: "xxx",
       *   password: "xxx",
       *   database: "xxx"
       * }
      **/
      config: function(options) {
        this._config = options;
        this._check();
      },
      /**
       * @private
       * @description
       * check the configuration
      **/
      _check: function() {
        var config = this._config;

        if(config.host === undefined) {
          $logger.error("\'host\' has to be defined to be able to access database");
        }else if(config.user === undefined) {
          $logger.error("\'user\' has to be defined to be able to access database");
        }else if(config.password === undefined) {
          $logger.error("\'password\' has to be defined to be able to access database ");
        }else if(config.database === undefined) {
          $logger.error("\'database\' has to be defined to be ablt to access database");
        }
      },
      /**
       * @private
       * @param {Function} callback
       * @description
       * get database connection
      **/
      _operate: function(callback) {
        var config = this._config;

        var conn = mysql.createConnection({
          host: config.host,
          user: config.user,
          password: config.password,
          database: config.database
        });

        conn.connect();
        callback(conn);
        conn.end();
      },
      /**
       * @public
       * @param {String} sql
       * @param {Array|object} params
       * @param {Function} callback
       * @description
       * execute database operation
      **/
      query: function(sql, params, callback) {
        this._operate(function(conn) {
          conn.query(sql, params, callback);
        });
      }
    };
  }
};
