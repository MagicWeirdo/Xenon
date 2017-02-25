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
  static_root: "/static/",
  email: {
    user: "xxx",
    password: "xxx",
    host: "xxx",
    port: "xxx",
    ssl: true,
    tls: false,
    timeout: "xxx",
    domain: "xxx",
    authentication: "xxx"
  },
  database: {
    driver: "mysql",
    host: "127.0.0.0",
    port: 3306,
    user: "xxx",
    password: "xxx",
    database: "xxx"
  },
  middlewares: [
    "RestfulMiddleware",
    "UtilsMiddleware"
  ],
  actions: [
    { method: "POST", url: "/api/login", action: "UserController.login" }
  ],
  models: [
    "Person"
  ],
  services: [
    "$loginService",
    "$apiKeyService",
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
module.exports = {
  scope: "singleton",
  name: "$myService",
  factory: function () {
    #statements
  }
}
```

## Model Definition

```sh
module.exports = function(orm, db) {
  db.define("person", {
    name: String,
    surname: String,
    age: Number,
    male: Boolean,
    continent: [ "Europe", "America", "Asia", "Africa", "Australia", "Antartica" ],
    photo: Buffer,
    data: Object
  }, {
    methods: {
      fullName: function() {
        return this.name + " " + this.surname;
      }
    }
  });
};
```
