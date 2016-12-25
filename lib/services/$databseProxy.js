const DatabaseProxy = require("../db/DatabaseProxy");

module.exports = {
  scope: "singleton",
  name: "$databaseProxy",
  factory: function($config) {
    // check if database is configured
    if($config["DATABASE"] === undefined) {
      throw "DATABASE has to be configured to be able to access $databaseProxy";
    }

    var dbProxy = new DatabaseProxy();
    dbProxy.config($config["DATABASE"]);
    return dbProxy;
  }
};
