class ContentTypeExtractor {
  constructor() {
    this._pattern = /.+(\..+)/;
    this._contentTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/x-javascript"
    }
  }

  /**
   * @private
   * @description
   * reset the regex state
  **/
  _reset() {
    this._regex = new RegExp(this._pattern, "g");
  }

  /**
   * @public
   * @param {String} filePath
   * @description
   * extract content type from the given file path
  **/
  extract(filePath) {
    this._reset();

    var suffix = this._extractSuffix(filePath);
    return this._getContentType(suffix);
  }

  /**
   * @private
   * @param {String} filePath
   * @param {String}
   * @description
   * extract the suffix
   * TODO: bug
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
