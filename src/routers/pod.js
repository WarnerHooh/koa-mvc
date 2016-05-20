import KoaRouter from 'koa-router';
import koaParse from 'co-body';
import { getPods } from '../controllers/pod';

const podRouter = new KoaRouter({prefix: '/pods'});

podRouter.get('/', async (ctx, next) => {
  ctx.body = await getPods();
});

export default podRouter;