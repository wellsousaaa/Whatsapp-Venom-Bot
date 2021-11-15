const jimp = require("jimp");
const fs = require("fs");
const mime = require("mime-types");

module.exports = {
  imageToSticker: async (client, message) => {
    const buffer = await client.decryptFile(message);
    const fileName = `some-file-name.${mime.extension(message.mimetype)}`;

    fs.writeFile(fileName, buffer, async (err) => {
      if (err) return;
      await client.sendImageAsSticker(message.from, buffer.toString("base64"));
    });
  },
  URLToSticker: async (client, message) => {
    const url = message.body.split("--fig-url ")[1] || "";

    console.log(url);

    // url.indexOf(".gif") >= 0
    // ?
    // await client
    //     .sendImageAsStickerGif(message.from, url)
    //     .catch((err) => console.log(err))
    // :
    await client
      .sendImageAsSticker(message.from, url)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  },
};
