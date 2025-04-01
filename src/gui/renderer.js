// This is safe: browser-native mic access
navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    console.log("Mic stream ready", stream);
  })
  .catch((err) => {
    console.error("Mic error:", err);
  });

// Call preload API if needed
window.electronAPI.hello();
