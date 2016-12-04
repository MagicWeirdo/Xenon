# Overview

Xenon.js whole new version. We think modern web application should be based
on RESTful backend with static file & template file serve features.  

## Xenon Application Structure

```sh
|-app
  |- api
     |- controllers // controller definitions
     |- models // model definitions
     |- services // services definitions
     |- middlewares // middleware definitions
  |- config
     |- local.js development environment configuration file
     |- xenonsrc.js production environment configuration file
  |- templates // templates
  |- statics // static files
  |- node_modules // dependencies
  |- package.json // project definition
  |- README.md // project introduction
  |- app.js //
```

## What The Framework Wants To Achieve

- RESTful feature. All requests except requests for static files and templates
  are transformed into JSON, and response too.
- Separate of concern. You don't have to worry about how to serve your static
  contents, which are all done in Xenon.js by writing a short configuration
  snippet. You just need to focus on how to design your RESTful APIs and leave
  the frontend to those who are responsible.
- Support both development and production configuration files
- Cluster
- ORM

## Configuration Overview

### local.js

```sh
module.exports = {
  BASE_PATH: __dirname,
  HOST_NAME: "127.0.0.1",
  PORT: 80,
  MIDDLEWARES: [
    "RestfulMiddleware",
    "UtilsMiddleware"
  ],
  ACTIONS: [
    {
      method: "POST",
      pattern: /\/api\/login/g,
      action: "UserController.login",
      services: [
        "LoginService"
      ]
    }
  ],
  MODEL: [
    {name: "UserModel"},
    {name: "ApiKeyModel"}
  ],
  SERVICE: [
    {
      name: "LoginService",
      models: {
        "UserModel",
        "ApiKeyModel"
      }
    }
  ]
};
```

## Action Definition

```sh
module.exports = {
  "login": (data, args) => {
    var loginService = args["LoginService"];
    return loginService.login(data);
  }
};
```

## Service Definition

```sh
class LoginService {
  constructor(args) {
    this._userModel = args["UserModel"];
    this._apiKeyModel = args["ApiKeyModel"];
  }

  //...

  login(data) {
    // do something
  }
}

module.exports = LoginService;
```

## Model Definition

```sh
class UserModel extends Model {
  constructor() {
    super();
  }

  //...
}
```