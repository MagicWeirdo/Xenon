const fs = require("fs");
const path = require("path");
const url = require("url");

module.exports = {
  scope: "singleton",
  name: "$statics",
  factory: function($config, $mime, $cache, $logger) {
    var staticLoader = {
      /**
       * @public
       * @param {String} directory
       * @description
       * setup the configuration
      **/
      config: function(directory) {
        this._directory = directory;
      },
      /**
       * @public
       * @return {Array}
       * @description
       * load all static definitions
      **/
      loadAll: function() {
        return this._loadFromDirectory(this._directory);
      },
      /**
       * @private
       * @param {String} directory
       * @return {Array}
       * @description
       * load static definitions from the given directory
      **/
      _loadFromDirectory: function(directory) {
        var self = this;
        var statics = [];

        // get all files and directories
        var files = fs.readdirSync(directory);
        files.forEach(function(file) {
          let filePath = path.join(directory, file);
          let stats = fs.statSync(filePath);

          // is directory
          if(stats.isDirectory()) {
            statics = statics.concat(self._loadFromDirectory(filePath));
          }else {
            let relativePath = path.relative(self._directory, filePath);

            statics.push({
              url: $config.static_root + url.format(relativePath),
              callback: function(req, res) {
                if($config.debug === true) {
                  // get real-time data

                  // send to client
                  res.writeHead(200, {
                    "Content-Type": $mime.lookup(filePath),
                    "Content-Length": fs.statSync(filePath).size
                  });

                  var readStream = fs.createReadStream(filePath);
                  readStream.pipe(res);
                }else {
                  // if the static file is not cached
                  if($cache.isCached(relativePath) === false) {
                    $cache.newBufferSync(relativePath, filePath);
                  }

                  let cache = $cache.getBuffer(relativePath);

                  res.writeHead(200, {
                    "Content-Type": $mime.lookup(filePath),
                    "Content-Length": cache.size
                  });

                  res.end(cache.buffer);
                }
              }
            });
          }
        });

        return statics;
      }
    };

    staticLoader.config(path.join($config.basePath, "static"));
    return staticLoader.loadAll();
  }
};
