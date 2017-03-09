const orm = require("orm");
const path = require("path");

module.exports = {
  scope: "singleton",
  name: "$orm",
  factory: function($config, $logger) {
    return {
      /**
       * @public
       * @param {Function} callback
       * @description
       * query database
      **/
      query: function(callback) {
        var self = this;

        // load database configurations
        var options = $config.database;

        // connect to database
        orm.connect(self._formatConnectionString(options), function(err, db) {
          if(err) {
            $logger.error(err.message);
          }

          $logger.log("connect to database - " + options.database);

          // load model definitions
          self._loadModelDefinitions(orm, db);

          // sync database
          db.sync(function(err) {
            if(err) {
              $logger.error(err);
            }

            $logger.log("synchronized with database");

            // do query
            callback(orm, db);
          });
        });
      },
      /**
       * @private
       * @param {object} options
       * @description
       * formating connection string
      **/
      _formatConnectionString: function(options) {
        var driver = options.driver;
        var host = options.host;
        var port = options.port;
        var user = options.user;
        var password = options.password;
        var database = options.database;

        return driver + "://" + user + ":" + password + "@" + host + ":" + port + "/" + database;
      },
      /**
       * @private
       * @param {orm} orm
       * @param {db} db
       * @description
       * load model definitions
      **/
      _loadModelDefinitions: function(orm, db) {
        // load configurations
        var models = $config.models;

        // load definitions
        var definitions = models.map(function(model) {
          let definition = require(path.join($config.basePath, "api/models", model));

          $logger.log("load model - " + model);

          return definition;
        });

        // execute all before functions
        definitions.forEach(function(definition) {
          definition.before(orm, db);
        });

        // execute all after functions
        definitions.forEach(function(definition) {
          definition.after(orm, db);
        });
      }
    };
  }
};
