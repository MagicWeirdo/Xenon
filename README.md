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
     |- route.js // routes configuration
     |- model.js // models configuration
     |- service.js // service configuration
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

### route.js

module.exports = [
  {
    method: "POST",
    pattern: \/api\/login,
    action: UserController.login,
    services: [
      "LoginService",
    ]
  }
];

### model.js

module.exports = [
  {name: "UserModel"}
];

### service.js

module.exports = [
  {

  }
];
