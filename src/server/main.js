#!/usr/bin/env node

const { app, BrowserWindow } = require("electron");
const path = require("path");
const bindings = require("bindings");
app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // For secure context bridging
      contextIsolation: true,
      nodeIntegration: false, // You want the renderer to behave like a real browser
    },
  });
  win.loadFile("index.html");
});
3;
