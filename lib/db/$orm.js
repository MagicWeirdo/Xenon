const orm = require("orm");
const path = require("path");

module.exports = {
  scope: "singleton",
  name: "$orm",
  factory: function($config, $logger) {
    return {
      _initialized: false,
      _definitions: [],
      /**
       * @public
       * @param {Array} names
       * @param {Function} callback
       * @description
       * do database operations on the table
      **/
      query: function(names, callback) {
        var self = this;
        // load table definitions
        if(self._initialized === false) {
          // if not initialized
          self._init();
        }

        // reset tables' state
        self._reset();

        // activate tables
        names.forEach(function(name) {
          self._activate(name);
        });

        // connect to database
        self._connect(function(tables) {
          // pass the reference of the specified table
          callback(tables);
        });
      },
      /**
       * @private
       * @description
       * initialization
      **/
      _init: function() {
        var self = this;

        var models = $config.models;
        models.forEach(function(model) {
          let definition = require(path.join($config.basePath, "api/models", model));
          self._define(
            definition.name,
            definition.mapping,
            definition.options,
            definition.association
          );

          $logger.log("load model " + definition.name);
        });

        this._initialized = true;
      },
      /**
       * @private
       * @description
       * reset all tables' state to deactive
      **/
      _reset: function() {
        this._definitions.forEach(function(definition) {
          definition.active = false;
        });
      },
      /**
       * @private
       * @param {String} name
       * @description
       * activate table of the given name
      **/
      _activate: function(name) {
        let definitions = this._definitions;
        for(var i = 0;i < definitions.length;i++) {
          if(definitions[i].name === name) {
            definitions[i].active = true;
            break;
          }
        }
      },
      /**
       * @private
       * @param {String} name
       * @param {object} mapping
       * @param {object} options
       * @param {object} association
       * @description
       * defining table
      **/
      _define: function(name, mapping, options, association) {
        this._definitions.push({
          name: name,
          mapping: mapping,
          options: options,
          association: association,
          active: false
        });
      },
      /**
       * @private
       * @param {Function} callback
       * @return {Promise}
       * @description
       * connect to database
      **/
      _connect: function(callback) {
        var self = this;
        // connect to database
        orm.connect(this._format($config.database), function(err, db) {
          if(err) {
            $logger.error(err.message);
          }

          // store table references
          var tables = {};

          // defining tables
          self._definitions.forEach(function(definition) {
            if(definition.active === true) {
              tables[definition.name] = db.define(definition.name, definition.mapping, definition.options);
            }
          });

          // defining relationships
          self._definitions.forEach(function(definition) {
            // TODO: bug
            if(definition.active === true) {
              // check if association is defined
              if(definition.association !== undefined) {
                let association = definition.association;

                // check if it is hasOne
                if(association.hasOne !== undefined) {
                  association.hasOne.forEach(function(entry) {
                    let name = entry.name;
                    let model = tables[entry.model];
                    let option = entry.option;

                    tables[definition.name].hasOne(name, model, option);
                  });
                }

                // check if it is hasMany
                if(association.hasMany !== undefined) {
                  association.hasMany.forEach(function(entry) {
                    let name = entry.name;
                    let model = tables[entry.model];
                    let extraProps = entry.extraProps;
                    let opts = entry.opts;

                    tables[definition.name].hasMany(name, model, extraProps, opts);
                  });
                }
              }
            }
          });

          // add the table to the database
          db.sync(function(err) {
            if(err) {
              throw err;
            }

            // execute callback & pass references
            callback(tables);
          });
        });
      },
      /**
       * @private
       * @param {object} options
       * @return {String}
       * @description
       * formating connection string
      **/
      _format: function(options) {
        let driver = options.driver;
        let host = options.host;
        let port = options.port;
        let user = options.user;
        let password = options.password;
        let database = options.database;

        return driver + "://" + user + ":" + password + "@" + host + ":" + port + "/" + database;
      }
    };
  }
};
