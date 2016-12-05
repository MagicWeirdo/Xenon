const UrlMatcher = require("../url/UrlMatcher");
const path = require("path");
const fs = require("fs");
const ContentTypeExtractor = require("./ContentTypeExtractor");

/**
 * @description
 *
**/
class FileSender {
  constructor() {
    this._files = [];
    this._extractor = new ContentTypeExtractor();
  }

  /**
   * @public
   * @param {String} directory
   * @description
   * configuring file directory
  **/
  setDirectory(directory) {
    this._directory = directory;
  }

  /**
   * @public
   * @param {RegExp} pattern
   * @param {String} filePath
   * @description
   * register a file
  **/
  registerFile(pattern, filePath) {
    this._files.push({
      matcher: new UrlMatcher(pattern),
      filePath: filePath
    });
  }

  /**
   * @public
   * @param {http.ServerResponse} res
   * @param {String} url
   * @return {Boolean}
   * @description
   * match and render template. if succeed return
   * true
  **/
  matchAndSend(res, url) {
    var filePath = this._match(url);
    // match url
    if(filePath !== null) {
      this._send(res, path.join(this._directory, filePath));
      return true;
    }else {
      return false;
    }
  }

  /**
   * @private
   * @param {String} url
   * @return {String|null}
   * @description
   * match url against patterns and return filePath
  **/
  _match(url) {
    for(var i = 0;i < this._files.length;i++) {
      if(this._files[i].matcher.match(url)) {
        return this._files[i].filePath;
      }
    }

    return null;
  }

  /**
   * @private
   * @param {http.ServerResponse} res
   * @param {String} filePath
   * @description
   * send file to client
  **/
  _send(res, filePath) {
    try {
      var stats = fs.statSync(filePath);

      res.writeHead(200, {
        "Content-Type": this._extractor.extract(filePath),
        "Content-Length": stats.size
      });

      var readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    } catch(err) {
      throw "File: " + filePath + " doesn't exist";
    }
  }

}

module.exports = FileSender;
