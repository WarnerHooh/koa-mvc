import f from 'promise.prototype.finally'
import promiser from './promiser';

/**
* @param parallel 最大并行数量
**/
function Queuer(parallel = 5) {
  this._parallel = parallel;
  this._execting = 0;
  this._tasks = [];
  this._results = [];

  return this;
}

Queuer.prototype.add = function(task) {
  this._tasks.push(task);
}

Queuer.prototype.getSize = function() {
  return this._tasks.length;
}

Queuer.prototype.getNext = function() {
  return this.getSize() ? this._tasks.shift() : false;
}

Queuer.prototype.inspect = function() {
  if(this._tasks.length &&  this._execting < this._parallel) {
    this.next();
  }
}

Queuer.prototype.next = function() {
  let s = this;
  let next = this.getNext();

  if(next) {
    s._execting ++;
    console.log('current _execting: ' + this._execting);
    s.inspect();

    next.then(function(data) {
      if(data !== undefined) {
        // console.log(data)
        s._results.push(data);
      }
    }).finally(function(e) {
      s._execting --;
      s.inspect();
    });
  }
}

Queuer.prototype.run = function() {
  this.next();
}

Queuer.prototype.all = function() {

}

export default Queuer;