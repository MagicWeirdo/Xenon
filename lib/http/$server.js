const http = require("http");

module.exports = {
  scope: "prototype",
  name: "$server",
  factory: function($config, $orm2, $requestHandler, $logger) {
    return {
      run: function() {
        var self = this;

        // if database is configured
        if($config.database) {
          // initialize $orm2
          $orm2.initialize(function() {
            self._bootstrap();
          });
        }else {
          self._bootstrap();
        }
      },
      _bootstrap: function() {
        // bootstrap server
        var hostname = $config.hostname;
        var port = $config.port;

        this._server = http.createServer(function(req, res) {
          $requestHandler.handle(req, res);
        }).listen(port, hostname, function() {
          $logger.log("Server running at http://%s:%s/", hostname, port);
        });
      }
    };
  }
};
