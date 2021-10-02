const fs = require("fs");
const path = require("path");
const pathToFfmpeg = require('ffmpeg-static');

const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const YoutubeMusicApi = require("youtube-music-api");

const api = new YoutubeMusicApi();

//Configure YoutubeMp3Downloader with your settings
const YD = new YoutubeMp3Downloader({
  ffmpegPath: pathToFfmpeg, // FFmpeg binary location
  outputPath: path.resolve(__dirname, "..", "audios"), // Output file location (default: the home directory)
  youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
  queueParallelism: 2, // Download parallelism (default: 1)
  progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
  allowWebm: false, // Enable download from WebM sources (default: false)
});

module.exports = {
  fromURL: async (client, message) => {
    const ytUrl = message.body.split("--music-url ")[1] || "";
    await client.sendText(message.from, "Baixando: " + ytUrl);
    const videoCode = ytUrl.split("v=")[1];

    //Download video and save as MP3 file
    YD.download(videoCode);

    YD.on("finished", async function (err, data) {
      const { file, title } = data;
      await client.sendFile(message.from, file, title + ".mp3", title);
      fs.unlinkSync(file);
    });

    YD.on("error", function (error) {
      console.log(error);
    });

    YD.on("progress", function (progress) {
      //   console.log(JSON.stringify(progress));
    });
  },
  fromSearch: async (client, message) => {
    const search = message.body.split("--music-search ")[1] || "";
    api
      .initalize() // Retrieves Innertube Config
      .then((info) => {
        api.search(search).then(({ content }) => {
          let text = `~ _${search}_ \n`;

          let i = 1;
          for (let item of content) {
            console.log(item);
            if (item.name && item.author && item.videoId)
              text += `\n${i++} - ${item.name} \n${
                item.author
              } \nhttps://www.youtube.com/watch?v=${item.videoId} \n`;
          }

          text +=
            "\n Copie alguma URL e use o comando \n```--music-url [URL]``` \npara baixar a música!";

          client.sendText(message.from, text);
        });
      });
  },
};
