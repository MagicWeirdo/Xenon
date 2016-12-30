const url = require("url");

module.exports = {
  scope: "prototype",
  name: "$requestHandler",
  factory: function($logger, $injector, $middlewares, $urlDispatcher, $injector) {
    return {
      /**
       * @public
       * @private
       *
      **/
      handle: function(req, res) {
        var method = req.method;
        var pathname = url.parse(req.url).pathname;

        // start timer
        $logger.time(method + " " + pathname);

        // process by middlewares
        $middlewares.forEach(middleware) {
          // dependency injection & execute
          $injector.inject(middleware)();
        };

        // dispatch request
        var callback = $urlDispatcher.dispatch(req, res);

        if(callback !== null) {
          $injector.inject(callback)();
        }else {
          res.send404();
        }

        // end timer
        $logger.timeEnd(method + " " + pathname);
      }
    };
  }
};
