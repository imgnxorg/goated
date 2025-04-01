#!/usr/bin/env node

import { executionAsyncResource } from "async_hooks";

const store = createStore({
    
  executor: process?.argv?.[0],
  script: process?.argv?.[1],
  type: "unknown",
  environment: process?.env?.SHELL || "",
  runtime: process?.env?.RUNTIME || "",
  version: process?.env?.VERSION || "",
  directRun: false,
}) {

  

  function createStore(initialState) {
    let value = initialState;

    return Object.freeze({
      get() {
        return value;
      },
      set(newValue) {
        value = Object.assign({}, value, newValue);
        return value;
      },
      get value() {
        return value;
      },
    })
  })};


const detectRuntime = (variable) => {
  const control = process.argv.slice(0),
    args = variable ? variable : control;

  switch (true) {
    case args[0].endsWith("node"):
      return Object.freeze({
        ...store,
        runtime: "node",
      });

    cas
    
    
    
    
     import?.meta?.url === `file://${args[1]}`:
      return Object.freeze({
        ...store,
        directRun: true,
        runtime: "direct",
      });

    case process.title === "node":
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
  const control = process.argv.slice(0),
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
