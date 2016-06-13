/*

Queue.js

A function to represent a queue

Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

var Log = require('Log');

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */
function Queue(values) {
    if(_.isUndefined(values)) {
        values = [];
    } else if(!_.isArray(values)) {
        Log.crash('Values is not an array: ' + values);
    } else {
        values = values.slice(0);
    }

    // initialise the queue and offset
    this.queue  = values;
    this.offset = 0;
};

// Returns the length of the queue.
Queue.prototype.getLength = function(){
    return (this.queue.length - this.offset);
};

// Returns true if the queue is empty, and false otherwise.
Queue.prototype.isEmpty = function(){
    return (this.queue.length == 0);
};

/* Enqueues the specified item. The parameter is:
*
* item - the item to enqueue
*/
Queue.prototype.enqueue = function(item){
    this.queue.push(item);
};

/* Dequeues an item and returns it. If the queue is empty, the value
* 'undefined' is returned.
*/
Queue.prototype.dequeue = function(){
    var queue = this.queue;

    // if the queue is empty, return immediately
    if (queue.length == 0)
        return undefined;

    // store the item at the front of the queue
    var offset = this.offset;
    var item = queue[offset];

    // increment the offset and remove the free space if necessary
    if (++ offset * 2 >= queue.length){
        this.queue  = queue.slice(offset);
        this.offset = 0;
    }

    // return the dequeued item
    return item;
};

/* Returns the item at the front of the queue (without dequeuing it). If the
* queue is empty then undefined is returned.
*/
Queue.prototype.peek = function(){
    return (this.queue.length > 0 ? this.queue[this.offset] : undefined);
};

Queue.prototype.clear = function() {
    this.queue = [];
    this.offset = 0;
};

module.exports = Queue;
