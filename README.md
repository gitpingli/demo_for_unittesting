# console-core-service-sherpa

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

under the project root dir, tell egg.js to use your config.local.js:
```bash
echo 'local' >config/env
```

create a `config.local.js` in `~/console-core-service-sherpa/config`:
```js
/* eslint valid-jsdoc: "off" */
  
'use strict';

module.exports = () => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // your configs
  config.serviceName = {
    //...
  };

  // default settings to sequelize to connect docker container
  config.sequelize = {
    dialect: 'postgres',
    database: 'platform',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgresql',
    password: 'password',
  };

  return {
    ...config,
  };
}; 
```

start the Postgres docker container:
```bash
cd ~/console-core-service-sherpa/docker
docker-compose up postgres
```

start the service:
```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

[egg]: https://eggjs.org
