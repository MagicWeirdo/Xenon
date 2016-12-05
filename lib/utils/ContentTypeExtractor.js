class ContentTypeExtractor {
  constructor() {
    this._regex = /.+(\.\w+)/g;
    this._contentTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/x-javascript"
    }
  }

  /**
   * @public
   * @param {String} filePath
   * @description
   * extract content type from the given file path
  **/
  extract(filePath) {
    var suffix = this._extractSuffix(filePath);
    return this._getContentType(suffix);
  }

  /**
   * @private
   * @param {String} filePath
   * @param {String}
   * @description
   * extract the suffix
  **/
  _extractSuffix(filePath) {
    var result = this._regex.exec(filePath);
    return result[1];
  }

  /**
   * @private
   * @param {String} suffix
   * @return {String}
   * @description
   * get the content type
  **/
  _getContentType(suffix) {
    return this._contentTypes[suffix];
  }
}

module.exports = ContentTypeExtractor;
