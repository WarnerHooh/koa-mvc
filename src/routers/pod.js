import KoaRouter from 'koa-router';
import koaParse from 'co-body';
import { getPods } from '../controllers/pod';

const podRouter = new KoaRouter({prefix: '/pods'});

podRouter.get('/:podName', async (ctx, next) => {
  console.log(ctx.params);
  ctx.body = await getPods(ctx.params.podName);
});


export default podRouter;
