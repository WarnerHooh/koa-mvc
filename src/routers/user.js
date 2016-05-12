import KoaRouter from 'koa-router';
import { getUsers, getUserById } from '../controllers/user';

const userRouter = new KoaRouter({prefix: '/users'});

userRouter.get('/', async (ctx, next) => {
  ctx.body = await getUsers();
});

userRouter.get('/:id', (ctx, next) => {
  ctx.body = getUserById(1);
});

export default userRouter;