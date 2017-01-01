const fs = require("fs");

module.exports = {
  scope: "singleton",
  name: "$cache",
  factory: function($logger) {
    return {
      _caches: {},
      /**
       * @public
       * @param {String} alias
       * @return {Boolean}
       * @description
       * check if the file is cached or not
      **/
      isCached: function(alias) {
        return this._caches[alias] !== undefined;
      },
      /**
       * @public
       * @param {String} alias
       * @param {String} filePath
       * @param {Function} callback
       * @description
       * new a cache or replace origin cache to store the specified file
      **/
      newBuffer: function(alias, filePath, callback) {
        var self = this;

        try {
          var stats = fs.statSync(filePath);

          // cache the file
          var arr = [];
          var readStream = fs.createReadStream(filePath);
          readStream.on("data", function(chunk) {
            arr.push(chunk);
          });

          readStream.on("end", function() {
            self._caches[alias] = {
              buffer: Buffer.concat(arr),
              size: stats.size
            };

            // finished caching
            callback();
          });
        }catch(err) {
          $logger.error("file: " + filePath + " does not exist");
        }
      },
      /**
       * @public
       * @param {String} alias
       * @return {Buffer}
       * @description
       * get the buffer from cache
      **/
      getBuffer(alias) {
        return this._caches[alias];
      }
    };
  }
};
