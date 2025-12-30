// serialManager.js
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

class SerialManager {
  constructor(path, baudRate = 115200) {
    this.port = new SerialPort({
      path: path,
      baudRate: baudRate,
      autoOpen: false,
    });

    // Parser converts raw "bits" into readable lines of text
    this.parser = this.port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
  }

  async open() {
    return new Promise((resolve, reject) => {
      this.port.open((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  write(data) {
    this.port.write(data + "\n"); // The \n tells the board "the command is finished"
  }

  // Listen for when the Shrike Lite says "OK" or "DONE"
  onData(callback) {
    this.parser.on("data", callback);
  }
}

module.exports = SerialManager;
