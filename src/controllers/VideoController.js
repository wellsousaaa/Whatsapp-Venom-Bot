const IG_URL = "https://snapinsta.app/pt";

const FormData = require("form-data");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

module.exports = {
  downloadVideo: async (client, message) => {
    const [_, url, index = 1] = message.body.split(" ") || ["", "", 1];

    const form = new FormData();
    form.append("url", url);

    const data = await fetch(url).then(async (res) => {
      const html = await res.text();
      // console.log(html);

      let $ = cheerio.load(html);

      //basic data from the meta tags
      let video_link = $("meta[property='og:video:secure_url']").attr(
        "content"
      );
      let file = $('meta[property="og:type"]').attr("content");
      let url = $('meta[property="og:url"]').attr("content");
      let title = $('meta[property="og:title"]').attr("content");
      console.log({ title, url, file, video_link });
    });

    return;

    /// text to base64
    // const base64 = Buffer.from(file).toString("base64");
    // await client.sendFileFromBase64(message.from, base64, "video.mp4");
    // console.log(type);

    // if (file) {
    //   const fileName = links[index - 1].split("/").pop();
    //   const filePath = `./downloads/${fileName}`;

    //   fs.writeFileSync(path.resolve("..", ".."), file);

    //   // client.sendMessage(message.from, `${IG_URL}/downloads/${fileName}`);
    // }

    return;

    /// file buffer to base64
    // const base64 = Buffer.from(file).toString("base64");

    if (links.length)
      return await client.sendFileFromBase64(message.from, base64);

    return client.sendMessage(
      message.from,
      "Não foi possível encontrar o vídeo."
    );

    // const value = await instagram_download.downloadMedia(url, "./");
    // console.log(value);

    //   const links = await instagramGetUrl(url).catch((err) => {
    //     console.log(err);
    //     return {
    //       results_number: 0,
    //     };
    //   });
    //   console.log(links);

    //   if (links.results_number) {
    //     const link = links.url_list[index - 1];

    //     if (link) await client.sendFile(message.from, link);
    //     else await client.sendText(message.from, "Ocorreu um erro");
    //   } else await client.sendText(message.from, "Ocorreu um erro");
  },
};
