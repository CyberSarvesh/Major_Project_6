// commandQueue.js
module.exports = class CommandQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  // Add a new command (like X10Y20) to the list
  add(command) {
    this.queue.push(command);
  }

  // Get the next command to send
  getNext() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }
};
