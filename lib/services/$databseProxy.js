const DatabaseProxy = require("../db/DatabaseProxy");

module.exports = {
  name: "$databaseProxy",
  factory: function($config) {
    var dbProxy = new DatabaseProxy();
    dbProxy.config($config["DATABASE"]);
    return dbProxy;
  }
};
