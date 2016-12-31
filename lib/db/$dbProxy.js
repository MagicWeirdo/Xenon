module.exports = {
  scope: "singleton",
  name: "$dbProxy",
  factory: function($config, $mysql) {
    // configuring mysql
    var options = $config.database;
    if(options.driver === "mysql") {
      $mysql.config({
        host: options.host,
        user: options.user,
        password: options.password,
        database: options.database
      });
    }

    return {
      /**
       * @public
       * @param {String} sql
       * @param {Array|object} params
       * @param {Function} callback
       * @description
       * execute database operation
      **/
      query: function(sql, params, callback) {
        $mysql.query(sql, params, callback);
      }
    };
  }
};
