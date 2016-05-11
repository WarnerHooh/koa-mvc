export default async (ctx, next) => {
	console.log(2)
	await next();
	console.log(3)
}