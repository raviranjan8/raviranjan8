
 function CountdownLatch (limit) {
  this.limit = limit;
  this.count = 0;
  this.waitBlock = function (){};
};

CountdownLatch.prototype.countDown = function (){
  this.count = this.count + 1;
  if(this.limit <= this.count){
    return this.waitBlock();
  }
};

CountdownLatch.prototype.await = function(callback){
  this.waitBlock = callback;
};

export default CountdownLatch;