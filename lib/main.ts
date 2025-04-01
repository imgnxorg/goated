#!/usr/bin/env node

import { log } from "console";
import naudiodon from "naudiodon";

const { AudioIO, SampleFormat16Bit } = naudiodon;

const devices = naudiodon.getDevices();

log(devices);

const apis = naudiodon.getHostAPIs();

log(apis);

const fdlisajfsdlk = new AudioIO({
  inOptions: {
    channelCount: 2,
    sampleFormat: SampleFormat16Bit,
    sampleRate: 44100,
    deviceId: -1, // Use -1 or omit the deviceId to select the default device
    closeOnError: true, // Close the stream if an audio error is detected, if set false then just log the error
  },
});

log(fdlisajfsdlk);

// Create an instance of AudioIO with inOptions and outOptions, which will return a DuplexStream
const aio = AudioIO({
  inOptions: {
    channelCount: 2,
    sampleFormat: SampleFormat16Bit,
    sampleRate: 44100,
    deviceId: -1, // Use -1 or omit the deviceId to select the default device
  },
  outOptions: {
    channelCount: 2,
    sampleFormat: SampleFormat16Bit,
    sampleRate: 44100,
    deviceId: -1, // Use -1 or omit the deviceId to select the default device
  },
});

aio.start();

const opts = new AudioEngineOptions({
  channelCount: 1,
  sampleFormat: SampleFormat16Bit,
  sampleRate: 44100,
  deviceId: -1, // default device
  closeOnError: true,
});

const ai = AudioIO(opts);

ai.on("data", (chunk) => {
  const samples = new Int16Array(chunk.buffer);
  const peak = Math.max(...samples.map(Math.abs)) / 32768;
  console.log("Amplitude:", peak.toFixed(3));
});

ai.start();

ai.on("error", (err) => {
  console.error("Error:", err);
});

process.on("SIGINT", () => {
  console.log("Stopping audio input...");
  ai.stop();
  ai.close();
  globalThis.process.exit(0);
});
