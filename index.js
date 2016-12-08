const App = require("./lib/App");
const DatabaseProxy = require("./lib/db/DatabaseProxy")

exports.App = () => {
  return new App();
};

exports.DatabaseProxy = () => {
  return new DatabaseProxy();
};
