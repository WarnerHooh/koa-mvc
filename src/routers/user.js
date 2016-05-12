import KoaRouter from 'koa-router';
import koaParse from 'co-body';
import { getUsers, getUserById, addUser } from '../controllers/user';

const userRouter = new KoaRouter({prefix: '/users'});

userRouter.get('/', async (ctx, next) => {
  ctx.body = await getUsers();
});

userRouter.get('/add', async (ctx, next) => {
  ctx.render('../views/user', {title: 'user'});
});

userRouter.post('/add', async (ctx, next) => {
  let user = await koaParse(ctx);
  let rs = await addUser(user);

  ctx.body = rs ? 'success' : 'failed';
});

userRouter.get('/:id', async (ctx, next) => {
  ctx.body = await getUserById(ctx.params.id);
});

export default userRouter;