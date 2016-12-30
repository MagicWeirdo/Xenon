/**
 * @description
 * add json facilities to request and response object
**/
module.exports = function(req, res) {
  req.readAsJson = function(callback) {
    var arr = [];
    req.on("data", function(chunk) {
      arr.push(chunk);
    });

    req.on("end", function() {
      var data = Buffer.concat(arr).toString();

      try {
        var jsonData = JSON.parse(data);
        callback(jsonData);
      }catch(err) {
        res.send404();
      }
    });
  };

  req.sendAsJson = function(data) {
    var jsonData = JSON.stringify(data);

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(jsonData, "utf8")
    });
  };
};
