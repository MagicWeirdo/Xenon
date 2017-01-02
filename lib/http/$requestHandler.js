const url = require("url");

module.exports = {
  scope: "prototype",
  name: "$requestHandler",
  factory: function($logger, $injector, $middlewares, $urlDispatcher, $injector) {
    return {
      /**
       * @public
       * @private
       * @param {http.IncomingMessage} req
       * @param {http.ServerResponse} res
       * @description
       * handle request
      **/
      handle: function(req, res) {
        var method = req.method;
        var pathname = url.parse(req.url).pathname;

        // start timer
        $logger.time(method + " " + pathname);

        $middlewares.process(req, res);

        // dispatch request
        var callback = $urlDispatcher.dispatch(req, res);

        if(callback !== null) {
          $injector.inject(callback)(req, res);
        }else {
          res.send404();
        }

        // end timer
        $logger.timeEnd(method + " " + pathname);
      }
    };
  }
};
