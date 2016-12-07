/**
 * @description
 * to match url
**/
class UrlMatcher {
  /**
   * @public
   * @param {RegExp} pattern
   * @description
   * create a UrlMatcher
  **/
  constructor(pattern) {
    this._pattern = pattern;
  }

  /**
   * @private
   * @description
   * reset matcher to initial state
  **/
  _reset() {
    this._regex = new RegExp(this._pattern, "g");
    this._hasPathVars = false;
    this._pathVars = [];
  }

  /**
   * @description
   * @param {String} url
   * @return {Boolean}
   * @description
   * match the url against the pattern and return groups
  **/
  match(url) {
    this._reset();

    var result = this._regex.exec(url);

    if(result !== null && result[0] === url) {
      // check if it has path varables
      if(result > 1) {
        this._hasPathVars = true;
        for(var i = 1;i < result.length;i++) {
          this._pathVars.push(result[i]);
        }
      }

      return true;
    }else {
      return false;
    }
  }

  /**
   * @public
   * @return {Boolean}
   * @description
   * check if it has path variables
  **/
  hasPathVariables() {
    return this._hasPathVars;
  }

  /**
   * @return {Array}
   * @description
   * get path variables
  **/
  getPathVariables() {
    return this._pathVars;
  }
}

module.exports = UrlMatcher;