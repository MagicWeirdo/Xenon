module.exports = {
  scope: "singleton",
  name: "$logger",
  factory: function() {
    return new Console(process.stdout, process.stderr);
  }
};
