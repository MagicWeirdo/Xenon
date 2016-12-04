/**
 * @description
 *
**/
module.exports = (req, res) => {
  res.sendNotFound = () => {
    res.statusCode = 404;
    res.end();
  };
};
