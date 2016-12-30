const url = require("url");

module.exports = {
  scope: "singleton",
  name: "$urlDispatcher",
  factory: function($actions) {
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

        for(var i = 0;i < $actions.length;i++) {
          let action = $actions[i];

          if(action.method === method && action.url === pathname) {
            return action.callback;
          }
        }

        return null;
      }
    };
  }
};
