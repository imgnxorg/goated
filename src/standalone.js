// This Node.js script converts a WAV file to a MIDI file by detecting drum transients.
// Requirements: npm install node-wav @tonejs/midi

import fs from "fs";
import wav from "node-wav";
import { basename } from "path";
import shift from "../lib/shift.js"; // Custom module to handle command line arguments
import tonejs from "@tonejs/midi"; // Correct ESM import for @tonejs/midi

const { Midi } = tonejs; // Destructure Midi from tonejs
// import { decode } from "wav-decoder"; // ESM import for wav-decoder
// import { encode } from "wav-encoder"; // ESM import for wav-encoder

// const args = shift.args;

console.log("shift", `${shift}`);

const AUDIO_FILE = process?.argv?.[2]; // Must be mono WAV file
console.log(`Using audio file: ${AUDIO_FILE}`);
if (!AUDIO_FILE) {
  console.error("Please provide a WAV file as an argument.");
  process.exit(1);
}

const MIDI_FILE = basename(AUDIO_FILE, ".wav") + ".midi"; // Output MIDI file
const THRESHOLD = 0.3; // Adjust for sensitivity
const NOTE = 36; // C1 (Kick)
const NOTE_DURATION = 0.05; // seconds
const VELOCITY = 1; // 0-1

function main() {
  const buffer = fs.readFileSync(AUDIO_FILE);
  const result = wav.decode(buffer);

  if (result.channelData.length > 1) {
    console.warn("Using only the first channel (mono only)");
  }

  const samples = result.channelData[0];
  const sampleRate = result.sampleRate;
  const hits = [];

  for (let i = 1; i < samples.length - 1; i++) {
    if (samples[i] > THRESHOLD && samples[i - 1] <= THRESHOLD) {
      hits.push(i / sampleRate);
      i += sampleRate * 0.05; // skip 50ms to avoid duplicate hits
    }
  }

  console.log(Midi);
  const midi = Midi();
  console.log(midi);

  const track = midi.addTrack();

  hits.forEach((time) => {
    track.addNote({
      midi: NOTE,
      time,
      duration: NOTE_DURATION,
      velocity: VELOCITY,
    });
  });

  fs.writeFileSync(MIDI_FILE, Buffer.from(midi.toArray()));
  console.log(`✅ MIDI file created: ${MIDI_FILE}`);
}

main();
