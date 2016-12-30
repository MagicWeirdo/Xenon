const http = require("http");

module.exports = {
  scope: "prototype",
  name: "$server",
  factory: function($config, $requestHandler, $logger) {
    return {
      run: function() {
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
