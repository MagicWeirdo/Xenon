const path = require("path");
const fs = require("fs");

module.exports = {
  scope: "singleton",
  name: "$files",
  factory: function($config, $mimeUtil, $cache, $logger) {
    // file loader to load files
    var fileLoader = {
      /**
       * @public
       * @param {String} basePath
       * @param {Array} options
       * @description
       * setup for configuration
      **/
      config: function(basePath, options) {
        this._basePath = basePath;
        this._options = options;
      },
      /**
       * @public
       * @description
       * load all files
      **/
      loadAll: function() {
        var self = this;
        var options = this._options;

        var files = [];
        options.forEach(function(option) {
          files.push({
            url: option.url,
            callback: function(req, res) {
              // transform to absolute path
              var filePath = path.join($config.basePath, "files", option.filePath);

              if($config.debug === true) {
                // if debug is enabled, files will not be cached
                try {
                  var stats = fs.statSync(filePath);

                  res.writeHead(200, {
                    "Content-Type": $mimeUtil.getContentTypeFor(filePath),
                    "Content-Length": stats.size
                  });

                  var readStream = fs.createReadStream(filePath);
                  readStream.pipe(res);
                }catch(err) {
                  $logger.error("file " + filePath + " does not exist");
                }
              }else {
                // if it is not cached
                if($cache.isCached(option.filePath) === false) {
                  // cache the file
                  $cache.newBuffer(option.filePath, filePath, function() {
                    // write to response after it is cached
                    let cache = $cache.getBuffer(option.filePath);

                    res.writeHead(200, {
                      "Content-Type": $mimeUtil.getContentTypeFor(filePath),
                      "Content-Length": cache.size
                    });

                    res.end(cache.buffer);
                  });
                }else {
                  let cache = $cache.getBuffer(option.filePath);

                  res.writeHead(200, {
                    "Content-Type": $mimeUtil.getContentTypeFor(filePath),
                    "Content-Length": cache.size
                  });

                  res.end(cache.buffer);
                }
              }
            }
          });
        });

        return files;
      }
    };

    fileLoader.config($config.basePath, $config.files);
    return fileLoader.loadAll();
  }
};
