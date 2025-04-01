const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  hello: () => console.log("Hello from preload!"),
  // Add fs, mic recording hooks, etc. here later
});
