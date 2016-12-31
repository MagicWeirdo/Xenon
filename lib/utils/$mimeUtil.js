module.exports = {
  scope: "singleton",
  name: "$mimeUtil",
  factory: function($logger) {
    return {
      _contentTypes: {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/x-javascript"
      },
      /**
       * @public
       * @param {String} fileName
       * @return {String}
       * @description
       * get the mime type of the given file name
      **/
      getContentTypeFor: function(fileName) {
        return this._contentTypes[this._getSuffix(fileName)];
      },
      /**
       * @private
       * @param {String} fileName
       * @return {String}
      **/
      _getSuffix: function(fileName) {
        var re = /.+(\.\w+)/;
        var result = re.exec(fileName);

        if(result !== null) {
          return result[1];
        }else {
          $logger.error("invalid " + fileName + " registered in config/setting.js");
        }
      }
    };
  }
};
