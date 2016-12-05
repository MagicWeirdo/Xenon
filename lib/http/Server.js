const http = require("http");

/**
 * @description
 * A server that receives requests and sends responses
**/
class Server {
  constructor() {

  }

  /**
   * @public
   * @param {String} hostname
   * @param {Integer} port
   * configuring the running settings
  **/
  setRunningConfig(hostname, port) {
    this._hostname = hostname;
    this._port = port;
  }

  /**
   * @public
   * @param {RequestHandler} handler
   * @description
   * register a handler to handle requests
  **/
  registerRequestHandler(handler) {
    this._handler = handler;
  }

  /**
   * @public
   * @description
   * running the server
  **/
  run() {
    this._server = http.createServer((req, res) => {
      this._handler.handle(req, res);
    }).listen(this._port, this._hostname, () => {
      console.log("Server running at http://" + this._hostname + ":" +
        this._port);
    });
  }
}

module.exports = Server;
