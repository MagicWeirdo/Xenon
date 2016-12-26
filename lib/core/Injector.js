/**
 * @description
 * injector for dependency injection known as inversion of control
**/
class Injector {
  constructor() {
    this._regex = /.*\((.*)\).+/;
    this._singletons = [];
    this._prototypes = [];
  }

  /**
   * @public
   * @param {String} scope
   * @param {String} name
   * @param {Function} factory
   * @description
   * register for dependency injection
   * scope accepts:
   * {
   *   singleton: only one
   *   prototype: multiple
   * }
  **/
  put(scope, name, factory) {
    if(scope === "singleton") {
      this._singletons.push({
        name: name,
        factory: factory,
        module: null
      });
    }else if(scope === "prototype") {
      this._prototypes.push({
        name: name,
        factory: factory
      });
    }else {
      throw "invalid scope type of " + name + " in config/settings.js";
    }
  }

  /**
   * @public
   * @param {String} name
   * @return {Function}
   * @description
   * get the dependency with the given name
  **/
  get(name) {
    var self = this;

    // find in singletons
    for(var i = 0;i < self._singletons.length;i++) {
      if(self._singletons[i].name === name) {
        return function() {
          // if it is not loade
          if(self._singletons[i].module === null) {
            var factory = self._singletons[i].factory;

            // inject
            factory = self.inject(factory);

            self._singletons[i].module = factory();
          }

          return self._singletons[i].module;
        };
      }
    }

    // find in prototypes
    for(var j = 0;j < self._prototypes.length;j++) {
      if(self._prototypes[j].name === name) {
        return self._prototypes[i].factory;
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
