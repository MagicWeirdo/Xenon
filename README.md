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
     |- settings.js // configuration file
  |- files // where you place files
  |- node_modules // dependencies
  |- package.json // project definition
  |- README.md // project introduction
  |- app.js //
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
      pattern: /\/api\/login/,
      name: "UserController.login",
    }
  ],
  MODEL: [
    {name: "UserModel"},
    {name: "ApiKeyModel"}
  ],
  SERVICE: [
    {name: "LoginService"},
    {name: "ApiKeyService"}
  ],
  FILE: [
    {pattern: /\//g, filePath: "template/index.html"},
    {pattern: /\/static\/css\/style\.css/g, filePath: "css/style.css"},
    {pattern: /\/static\/js\/app.js/g, filePath: "js/app.js"}
  ]
};
```

## Middleware Definition

```sh
module.exports = (req ,res) => {
  // do something
}
```

## Action Definition

```sh
module.exports = {
  "login": (data) => {
    // do something
  }
};
```

## Service Definition

```sh
class LoginService {
  constructor() {
    // do something
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
class UserModel {
  constructor() {
    super();
  }

  //...
}
```
