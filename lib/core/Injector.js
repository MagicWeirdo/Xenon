/**
 * @description
**/
class Injector {
  constructor() {
    this._regex = /.*\((.*)\).+/;
    this._dependencies = [];
  }

  /**
   * @public
   * @param {String} name
   * @param {Function} factory
   * @description
   * register for dependency injection
  **/
  put(name, factory) {
    this._dependencies.push({
      name: name,
      factory: factory
    });
  }

  /**
   * @public
   * @param {String} name
   * @return {Function}
   * @description
   * get the dependency with the given name
  **/
  get(name) {
    for(var i = 0;i < this._dependencies.length;i++) {
      if(this._dependencies[i].name === name) {
        return this._dependencies[i].factory;
      }
    }

    return null;
  }

  /**
   * @public
   * @param {Function} fn
   * @return {Function}
   * @description
   * inject dependencies as params into the function
   * return the function wih params injected
  **/
  inject(fn) {
    if(fn instanceof Function) {
      var params = this._extractParams(fn);

      for(var i = 0;i <params.length;i++) {
        var factory = params[i];
        fn = fn.bind(null, factory());
      }

      return fn;
    }else {
      throw "Given parameter is not a function";
    }
  }

  /**
   * @private
   * @param {Function} fn
   * @return {Array}
   * extract the parameters requested by the function
  **/
  _extractParams(fn) {
    var re = new RegExp(this._regex);
    var result = re.exec(fn.toString());
    var paramStr = result[1];

    paramStr = this._trim(paramStr);

    var params = [];

    // check if it has requested dependencies
    if(paramStr !== "") {
      var arr = paramStr.split(",");

      for(var i = 0;i < arr.length;i++) {
        var factory = this.get(arr[i]);

        if(factory !== null) {
          factory = this.inject(factory);
          params.push(factory);
        }
      }
    }

    return params;
  }

  /**
   * @private
   * @param {String} str
   * @return {String}
   * trim all whitespaces from the string
  **/
  _trim(str) {
    while(str.indexOf(" ") !== -1) {
      str = str.replace(" ", "");
    }

    return str;
  }

}

module.exports = Injector;
