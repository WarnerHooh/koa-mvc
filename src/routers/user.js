import KoaRouter from 'koa-router';

const userRouter = new KoaRouter({prefix: '/users'});

userRouter.get('/:id', (ctx, next) => {
  ctx.render('user')
});

export default userRouter;