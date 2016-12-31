const url = require("url");

module.exports = {
  scope: "singleton",
  name: "$urlDispatcher",
  factory: function($actions, $files) {
    return {
      /**
       * @public
       * @param {http.IncomingMessage} req
       * @param {http.ServerResponse} res
       * @return {Function|null}
      **/
      dispatch: function(req, res) {
        var method = req.method;
        var pathname = url.parse(req.url).pathname;

        // dispatch to action
        for(var i = 0;i < $actions.length;i++) {
          let action = $actions[i];

          if(action.method === method && action.url === pathname) {
            return action.callback;
          }
        }

        // dispatch to file
        for(var j = 0;j < $files.length;j++) {
          let file = $files[j];

          if("GET" === method && file.url === pathname) {
            return file.callback;
          }
        }

        return null;
      }
    };
  }
};
