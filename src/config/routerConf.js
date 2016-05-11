import fs from 'fs';
import path from 'path';

const routerDir = path.resolve(__dirname, '../routers');

let router = null;

// Dynamic require all router
export default function(app) {
  fs.lstat(routerDir, (error, stats) => {
    if(error) {
      console.log(error);
    } else {
      if(stats.isDirectory()) {
        fs.readdirSync(routerDir).forEach((file) => {
          router = require(path.join(routerDir, file)).default;
          try {
            app
              .use(router.routes())
              .use(router.allowedMethods());
          } catch(e) {
            console.log(e);
          }
        })
      }
    }
  })
}