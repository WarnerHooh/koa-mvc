import util from 'util';
import EventEmitter from 'events';
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

util.inherits(Queuer, EventEmitter);

Queuer.prototype.add = function(task) {
  this._tasks.push(task);
}

Queuer.prototype.getSize = function() {
  return this._tasks.length;
}

Queuer.prototype.getNext = function() {
  return this.getSize() ? this._tasks.shift() : false;
}

//[postExec] If this inspection is after a task execution
Queuer.prototype.inspect = function(postExec) {
  if(this._tasks.length === 0) {
    this.sleep();
    
    if(postExec && this._execting === 0) {
      this.emit('drain', this);
    }
  } else {
    if(this._running && this._execting < this._parallel) {
      this.next();
    }
  }
}

Queuer.prototype.next = function() {
  let _this = this;
  let next = this.getNext();

  if(next) {
    _this._execting ++;
    _this.inspect();

    next().then(function(data) {
      if(data !== undefined) {
        // console.log(data)
        _this._results.push(data);
      }
    }).finally(function(e) {
      _this._execting --;
      _this.inspect(true);
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
  if(!this._running) {
    this.run();
  }
}

// TODO
Queuer.prototype.all = function() {

}

export default Queuer;