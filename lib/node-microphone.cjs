#!/usr/bin/env node
import child_process, { exec, spawn, execFile } from "node:child_process";
import { log } from "node:console";
import { promisify } from "node:util";

import events from "events";

const { EventEmitter } = events;

const isMac = globalThis.os.type().includes("Darwin");

async function getVersion() {
  const { stdout } = await execFile("node", ["--version"]);
  console.log(stdout);
}
getVersion();

const vari = exec("echo ${red} Hello! ${reset}");

log(vari);

const myFile = promisify(child_process.execFile);

log(myFile);

const ls = spawn("ls", ["-lh", "/usr"]);

ls.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

ls.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});

ls.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

ls.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
// const isWin = globalThis.os.type().includeschildpres.spawn = childpres.spawn;

class Microphone extends EventEmitter {
  constructor(options) {
    super();
    this.ps = null;

    options = options || {};
    this.endian = options.endian || "little";
    this.bitwidth = options.bitwidth || "16";
    this.encoding = options.encoding || "signed-integer";
    this.rate = options.rate || "16000";
    this.channels = options.channels || "1";
    this.additionalParameters = options.additionalParameters || false;
    this.useDataEmitter = !!options.useDataEmitter;
    if (isWin) {
      this.device = options.device || "default";
    }
    if (!isWin && !isMac) {
      this.device = options.device || "plughw:1,0";
      this.format = undefined;
      this.formatEndian = undefined;
      this.formatEncoding = undefined;

      if (this.encoding === "unsigned-integer") {
        this.formatEncoding = "U";
      } else {
        this.formatEncoding = "S";
      }
      if (this.endian === "big") {
        this.formatEndian = "BE";
      } else {
        this.formatEndian = "LE";
      }
      this.format =
        this.formatEncoding + this.bitwidth + "_" + this.formatEndian;
    }
  }

  // end on silence - default threshold 0.5
  //'silence', '1', '0.1', options.threshold + '%',
  //'1', '1.0', options.threshold + '%'

  startRecording() {
    let audioOptions;
    if (this.ps === null) {
      if (isWin) {
        audioOptions = [
          "-b",
          this.bitwidth,
          "--endian",
          this.endian,
          "-c",
          this.channels,
          "-r",
          this.rate,
          "-e",
          this.encoding,
          "-t",
          "waveaudio",
          this.device,
          "-p",
        ];
        if (this.additionalParameters) {
          audioOptions = audioOptions.concat(this.additionalParameters);
        }
        this.ps = spawn("sox", audioOptions);
      } else if (isMac) {
        audioOptions = [
          "-q",
          "-b",
          this.bitwidth,
          "-c",
          this.channels,
          "-r",
          this.rate,
          "-e",
          this.encoding,
          "-t",
          "wav",
          "-",
        ];
        if (this.additionalParameters) {
          audioOptions = audioOptions.concat(this.additionalParameters);
        }
        this.ps = spawn("rec", audioOptions);
      } else {
        audioOptions = [
          "-c",
          this.channels,
          "-r",
          this.rate,
          "-f",
          this.format,
          "-D",
          this.device,
        ];
        if (this.additionalParameters) {
          audioOptions = audioOptions.concat(this.additionalParameters);
        }
        this.ps = spawn("arecord", audioOptions);
      }
      this.ps.on("error", (error) => {
        this.emit("error", error);
      });
      this.ps.stderr.on("error", (error) => {
        this.emit("error", error);
      });
      this.ps.stderr.on("data", (info) => {
        this.emit("info", info);
      });
      if (this.useDataEmitter) {
        this.ps.stdout.on("data", (data) => {
          this.emit("data", data);
        });
      }
      return this.ps.stdout;
    }
  }

  stopRecording() {
    if (this.ps) {
      this.ps.kill();
      this.ps = null;
    }
  }
}

module.exports = Microphone;
