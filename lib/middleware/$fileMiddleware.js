const path = require("path");
const fs = require("fs");

module.exports = function($config, $logger, req, res) {
  // res.sendFile = function(name) {
  //   // parse to absolute path
  //   var filePath = path.join($config.basePath, "files", name);
  //
  //   try {
  //     var stats = fs.statSync(filePath);
  //
  //     res.writeHead(200, {
  //       "Content-Type": "text/html",
  //       "Content-Length": stats.size
  //     });
  //
  //     var readStream = fs.createReadStream(filePath);
  //     readStream.pipe(res);
  //   } catch(err) {
  //     $logger.error("file " + name + " does not exist");
  //   }
  // };
};
