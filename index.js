const venom = require("venom-bot");
const http = require("http");
const fetch = require("node-fetch");
const chromium = require("chromium");

require("dotenv").config();

var teste = "não deu certo";

var whitelist = [];

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end(teste || "Made by Wendell de Sousa!");
};

const MusicController = require("./src/controllers/MusicController");
const StickerController = require("./src/controllers/StickerController");

const chromiumArgs = [
  "--disable-web-security",
  "--no-sandbox",
  "--disable-web-security",
  "--aggressive-cache-discard",
  "--disable-cache",
  "--disable-application-cache",
  "--disable-offline-load-stale-cache",
  "--disk-cache-size=0",
  "--disable-background-networking",
  "--disable-default-apps",
  "--disable-extensions",
  "--disable-sync",
  "--disable-translate",
  "--hide-scrollbars",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-first-run",
  "--safebrowsing-disable-auto-update",
  "--ignore-certificate-errors",
  "--ignore-ssl-errors",
  "--ignore-certificate-errors-spki-list",
];

const init = async () => {
  venom
    .create({ session: "sessionName", multidevice: true })
    .then((client) => start(client))
    .catch((erro) => {
      console.log(erro);
    });

  async function start(client) {
    const token = await client.getSessionTokenBrowser();

    const data = await fetch(process.env.PANTRY_URL + "/token", {
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
    // console.log(message);

    if (message.body.indexOf("ping") >= 0) {
      client.sendText(message.from, "pong");
    }

    if (!message.isGroupMsg) {
      console.log("não é mensagem de grupo");
      if (!whitelist.includes(message.chatId)) {
        console.log("não tá na variavel");
        try {
          const { list } = await fetch(process.env.PANTRY_URL + "/whitelist")
            .then((res) => res.json())
            .catch(() => ({}));

          if (!list || !list.includes(message.chatId)) return;
          else {
            console.log("está na whitelist");
            whitelist = list;
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

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

(async () => {
  // const token = await fetch(process.env.PANTRY_URL + "/token")
  //   .then((data) => data.json())
  //   .catch((err) => console.log(err));

  // init(token ? token.token : null);
  init();
})();
