const venom = require("venom-bot");

const MusicController = require("./src/controllers/MusicController");
const StickerController = require("./src/controllers/StickerController");

venom
  .create("sessionName", (base64Qrimg, asciiQR, attempts, urlCode) => {
    console.log("Number of attempts to read the qrcode: ", attempts);
    console.log("Terminal qrcode: ", asciiQR);
    console.log("base64 image string qrcode: ", base64Qrimg);
    console.log("urlCode (data-ref): ", urlCode);
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => handleMessage(client, message));
}

async function handleMessage(client, message) {
  const commandIs = (string, caption = false) =>
    caption
      ? message.caption?.indexOf(string) >= 0
      : message.body?.indexOf(string) >= 0;

  // console.log(message);

  /// Get Music from URL
  if (commandIs("--music-url")) MusicController.fromURL(client, message);
  /// Get Music from Search
  else if (commandIs("--music-search"))
    MusicController.fromSearch(client, message);
  /// Image and GIF to Sticker
  else if (commandIs("--fig-url"))
    StickerController.URLToSticker(client, message);
  else if (commandIs("--fig", true))
    StickerController.imageToSticker(client, message);
  else {
    await client.clearChatMessages(message.from);
  }
}
