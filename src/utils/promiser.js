/**
* wrapper a function as a promise
**/

export default function(func, context) {
  return function() {
    let args = Array.from(arguments);

    return new Promise((resolve, reject) => {
      args.push((error, data) => {
        if(error) {
          reject(error);
        } else {
          resolve(data);
        }
      });

      func.apply(context, args);
    });
  }
}