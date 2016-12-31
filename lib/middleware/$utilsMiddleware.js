/**
 * @description
 * add response utilities
**/
module.exports = function(req, res) {
  /**
   * @description
   * request syntax error
  **/
  res.send400 = function() {
    res.statusCode = 400;
    res.end("Syntax Error");
  };

  /**
   * @description
   * resource unavailable
  **/
  res.send403 = function() {
    res.statusCode = 403;
    res.end("Resource Unavailable");
  };

  /**
   * @description
   * resource not found
  **/
  res.send404 = function() {
    res.statusCode = 404;
    res.end("Resource Not Found");
  };

  /**
   * @description
   *
  **/
  res.send500 = function() {
    res.statusCode = 500;
    res.end();
  };

  /**
   * @description
   *
  **/
  res.send503 = function() {
    res.statusCode = 503;
    res.end();
  };
};
