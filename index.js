const venom = require("venom-bot");
const http = require("http");
const fetch = require("node-fetch");

require("dotenv").config();

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("Made by Wendell de Sousa!");
};

const MusicController = require("./src/controllers/MusicController");
const StickerController = require("./src/controllers/StickerController");

(async () => {
  const token = await fetch(process.env.PANTRY_URL)
    .then((data) => data.json())
    .catch((err) => console.log(err));

  init(token ? token.token : null);
})();

const init = (token) => {
  venom
    .create(
      "sessionName",
      () => {},
      () => {},
      {},
      token
        ? {
            WABrowserId: token.WABrowserId,
            WASecretBundle: token.WASecretBundle,
            WAToken1: token.WAToken1,
            WAToken2: token.WAToken2,
          }
        : {}
    )
    .then((client) => start(client))
    .catch((erro) => {
      console.log(erro);
    });

  async function start(client) {
    const token = await client.getSessionTokenBrowser();

    const data = await fetch(process.env.PANTRY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token }),
    })
      .then((res) => res.ok)
      .catch((err) => console.log(err));

    console.log(data);

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
};

const port = process.env.PORT || 5000;
const server = http.createServer(requestListener);

server.listen(port, () => {
  console.log("Server running");
});
