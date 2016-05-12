import KoaPug from 'koa-pug';
import serve from 'koa-static';
import json from 'koa-json';
import routerConf from '../config/routerConf';
import { initConnection as databaseConf } from '../config/databaseConf';

//init router
const initApp = (app) => {
  //setup static folders
  app.use(serve('public'));

  //setup routers
  routerConf(app);

  //setup view engine
  new KoaPug({
    viewPath: 'src/views',
    app: app
  });

  //setup json support
  app.use(json());

  //setup database
  databaseConf();
}

export default initApp;