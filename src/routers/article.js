import KoaRouter from 'koa-router';

const articleRouter = new KoaRouter({prefix: '/articles'});

articleRouter.get('/:id', (ctx, next) => {
  ctx.render('article')
});

export default articleRouter;