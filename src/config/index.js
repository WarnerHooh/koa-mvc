import KoaPug from 'koa-pug';
import serve from 'koa-static';
import routerConf from '../config/routerConf';

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
}

export default initApp;