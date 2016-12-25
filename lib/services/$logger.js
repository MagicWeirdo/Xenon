module.exports = {
  name: "$logger",
  factory: function() {
    return new Console(process.stdout, process.stderr);
  }
};
