const portAudio = require("naudiodon");

const ai = new portAudio.AudioInput({
  channelCount: 1,
  sampleFormat: portAudio.SampleFormat16Bit,
  sampleRate: 44100,
  deviceId: -1, // default device
  closeOnError: true,
});

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
  process.exit(0);
});
