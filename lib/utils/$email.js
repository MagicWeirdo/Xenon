const email = require("emailjs");

module.exports = {
  scope: "singleton",
  name: "$email",
  factory: function($config) {
    return {
      /**
       * @public
       * @param {object} message
       * @param {Function} callback
       * @description
       * send an email via SMTP protocol
      **/
      send: function(message, callback) {
        var server = email.server.connect($config.email);
        server.send(message, callback);
      }
    };
  }
};
