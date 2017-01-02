# Overview

Xenon.js whole new version. We think modern web application should be based
on RESTful backend with static file & template file serve features.  

## Xenon Application Structure

```sh
|-app
  |- api
     |- controllers
     |- models
     |- services
     |- middlewares
  |- config
     |- setting.js
  |- files
  |- node_modules
  |- view
  |- static
  |- package.json
  |- README.md
  |- app.js
```

## What The Framework Wants To Achieve

- RESTful feature. All requests, except requests for static files and
  templates, are transformed into JSON, and response too.
- Separate of concern. You don't have to worry about how to serve your  
  static contents, which are all done in Xenon.js by writing a short configuration snippet. You just need to focus on how to design your RESTful APIs and leave the frontend to those who are responsible.
- models & services can be load by using ModelLoader & ServiceLoader

## Configuration Overview

### settings.js

```sh
module.exports = {
  debug: true,
  hostname: "127.0.0.1",
  port: 80,
  database: {
    driver: "mysql",
    host: "127.0.0.0",
    user: "xxx",
    password: "xxx",
    database: "xxx"
  },
  static_root: "/static/",
  middlewares: [
    "$restfulMiddleware",
    "$utilsMiddleware"
  ],
  actions: [
    { method: "POST", url: "/api/login", action: "UserController.login" }
  ],
  models: [
    { name: "$userModel" },
    { name: "$apiKeyModel" }
  ],
  services: [
    "$loginService",
    "$apiKeyService",
    { scope: "singleton", name: "$loginService" },
    { scope: "singleton", name: "$apiKeyService" }
  ],
  files: [
    { url: "/", filePath: "template/index.html" },
    { url: "/static/css/style.css", filePath: "css/style.css" },
    { url: "/static/js/app.js", filePath: "js/app.js" }
  ]
};
```

## Middleware Definition

```sh
module.exports = function ($log, req ,res) => {
  // do something
}
```

## Action Definition

```sh
module.exports = {
  "login": ($apiKeyService, req, res) => {
    // do something
  }
};
```

## Service Definition

```sh
module.exports = function ($userModel) {
  // return object
}
```

## Model Definition

```sh
module.exports = function ($mysql) {
  #statements
}
```
