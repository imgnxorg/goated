#!/usr/bin/env node

// const process = globalThis.process;

export const createStore = (initialState) => {
  let value = initialState;

  return Object.freeze({
    get() {
      return value;
    },
    set(newValue) {
      value = newValue;
      return value;
    },
    get value() {
      return value;
    },
  });
};

const store = createStore({
  executor: globalThis.process?.argv?.[0],
  script: globalThis.process?.argv?.[1],
  type: "unknown",
  environment: globalThis.process?.env?.SHELL || "",
  runtime: globalThis.process?.env?.RUNTIME || "",
  version: globalThis.process?.env?.VERSION || "",
  directRun: false,
});

const detectRuntime = (variable) => {
  const control = globalThis.process.argv.slice(0),
    args = variable ? variable : control;

  switch (true) {
    case args[0].endsWith("node"):
      return Object.freeze({
        ...store,
        runtime: "node",
      });

    case globalThis.import.meta.url === `file://${args[1]}`:
      return Object.freeze({
        ...store,
        directRun: true,
        runtime: "direct",
      });

    case globalThis.process.title === "node":
      return Object.freeze({
        ...store,
        runtime: "node-process",
      });

    case Boolean(args[1]?.endsWith(".js")):
      return Object.freeze({
        ...store,
        runtime: "script",
      });

    default:
      return Object.freeze({
        ...store,
        runtime: "unknown 🤷‍♂️",
      });
  }
};

const shift = (variable) => {
  console.log("shift.js");
  const control = globalThis.process.argv.slice(0),
    args = variable ? variable : control;
  console.log("args", args);

  const runtime = detectRuntime(args);
  console.log("Runtime:", runtime);

  // Type
  if (args[0] && args[0] == "node") {
    store.set({ ...runtime, type: "module" });
    args.shift();
  } else {
    store.set({ ...runtime, type: "script" });
    // Nothing to shift...
  }

  // Environment
  if (args[0] && args[0].endsWith(".js")) {
    args.shift();
  } else {
    store.set({ ...runtime, environment: "/usr/bin/env node" });
    // Nothing to shift...
  }

  return Object.freeze([...args]);
};

export default shift;
