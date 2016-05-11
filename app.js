import Koa from 'koa';
import initApp from './src/config';

const app = new Koa();
initApp(app);

app.listen(3000);