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
  this._running = false;

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
  if(this._tasks.length === 0) {
    this.sleep();
  } else {
    if(this._running && this._execting < this._parallel) {
      this.next();
    }
  }
}

Queuer.prototype.next = function() {
  let s = this;
  let next = this.getNext();

  if(next) {
    s._execting ++;
    console.log('current _execting: ' + this._execting);
    s.inspect();

    next().then(function(data) {
      if(data !== undefined) {
        // console.log(data)
        s._results.push(data);
      }
    }).finally(function(e) {
      s._execting --;
      s.inspect();
    });
  } else {
    this.sleep();
  }
}

Queuer.prototype.run = function() {
  this._running = true;
  this.next();
}

Queuer.prototype.sleep = function() {
  this._running = false;
}

Queuer.prototype.wake = function() {
  console.log(this._running);
  if(!this._running) {
    this.run();
  }
}

// TODO
Queuer.prototype.all = function() {

}

export default Queuer;