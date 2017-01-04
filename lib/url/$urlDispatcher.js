const url = require("url");

module.exports = {
  scope: "singleton",
  name: "$urlDispatcher",
  factory: function($config, $actions, $statics) {
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

          if(action.method === method && action.matcher.match(pathname)) {
            // check if it has path parameters
            if(action.matcher.hasPathParams()) {
              // add pathParans attribute to request object
              req.routeParams = action.matcher.getPathParams();
            }

            return action.callback;
          }
        }

        // dispatch to statics
        if("GET" === method && pathname.startsWith($config.static_root)) {
          return $statics.getHandler(pathname);
        }

        return null;
      }
    };
  }
};
