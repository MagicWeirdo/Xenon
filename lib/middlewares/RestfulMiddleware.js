/**
 * @description
 *
**/
module.exports = (req, res) => {
  req.readAsJson = (callback) => {
    var arr = [];
    req.on("data", (chunk) => {
      arr.push(chunk);
    });

    req.on("end", () => {
      var data = Buffer.concat(arr).toString();

      try {
        var jsonData = JSON.parse(data);
        callback(jsonData);
      } catch(err) {
        res.sendNotFound();
      }
    });
  };

  req.sendAsJson = (data) => {
    var jsonData = JSON.stringify(data);

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Content-Length": jsonData.length
    });

    res.end(jsonData);
  };
};
