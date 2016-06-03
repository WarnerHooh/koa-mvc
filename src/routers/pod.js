import KoaRouter from 'koa-router';
import koaParse from 'co-body';
import { getPodList, getPods } from '../controllers/pod';

const podRouter = new KoaRouter({prefix: '/pods'});

podRouter.get('/', async (ctx, next) => {
  ctx.body = await getPodList('Pods');
});

podRouter.get('/:podName', async (ctx, next) => {
  ctx.body = await getPods(ctx.params.podName);
});


export default podRouter;
