const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { OpenAI } = require("openai");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
require("dotenv").config();
ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/extract-mp3", upload.single("video"), (req, res) => {
  const videoPath = req.file.path;
  const outputPath = `uploads/${Date.now()}_output.mp3`;

  ffmpeg(videoPath)
    .output(outputPath)
    .on("end", () => {
      fs.unlinkSync(videoPath);
      res.json({ outputFile: `/${outputPath}` });
    })
    .on("error", (err) => {
      console.error("Error during extraction:", err);
      res.status(500).json({ error: "Failed to extract MP3" });
    })
    .run();
});

app.post("/api/compress", upload.single("video"), (req, res) => {
  const videoFilePath = req.file.path;
  const outputFilePath = `compressed_${req.file.originalname}`;
  const compressionLevel = req.body.quality;

  let videoBitrate;
  switch (compressionLevel) {
    case "very_high":
      videoBitrate = "3000k";
      break;
    case "high":
      videoBitrate = "2000k";
      break;
    case "medium":
      videoBitrate = "1500k";
      break;
    case "low":
      videoBitrate = "1000k";
      break;
    case "very_low":
      videoBitrate = "500k";
      break;
    default:
      videoBitrate = "1500k";
  }

  ffmpeg(videoFilePath)
    .videoBitrate(videoBitrate)
    .output(path.join(__dirname, "compressed", outputFilePath))
    .on("end", () => {
      const compressedFileSize = fs.statSync(
        path.join(__dirname, "compressed", outputFilePath)
      ).size;

      res.json({
        outputFile: `/compressed/${outputFilePath}`,
        fileSize: compressedFileSize,
      });

      fs.unlinkSync(videoFilePath);
    })
    .on("error", (err) => {
      console.error("Error compressing video:", err);
      res.status(500).send("Compression failed");
    })
    .run();
});

app.post(
  "/api/generate-subtitles",
  upload.single("video"),
  async (req, res) => {
    const videoFilePath = req.file.path;
    const subtitleOutputPath = `uploads/${Date.now()}_subtitles.srt`;

    try {
      const response = await openai.audio.transcriptions.create({
        file: fs.createReadStream(videoFilePath),
        model: "whisper-1",
      });

      const transcriptionText = response.text;

      const srtContent = generateSRT(transcriptionText);
      fs.writeFileSync(subtitleOutputPath, srtContent);

      const videoWithSubtitlesPath = `uploads/${Date.now()}_with_subtitles.mp4`;
      const ffmpegCommand = `ffmpeg -i ${videoFilePath} -vf subtitles=${subtitleOutputPath} ${videoWithSubtitlesPath}`;

      exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error during FFmpeg execution: ${error.message}`);
          return res
            .status(500)
            .json({ error: "Failed to add subtitles to video" });
        }

        fs.unlinkSync(videoFilePath);

        res.json({
          subtitleFile: `/${subtitleOutputPath}`,
          videoWithSubtitles: `/${videoWithSubtitlesPath}`,
        });
      });
    } catch (error) {
      console.error("Error generating subtitles:", error);
      res.status(500).json({ error: "Failed to generate subtitles" });
    }
  }
);

function generateSRT(transcriptionText) {
  return `1
  00:00:01,000 --> 00:00:05,000
  ${transcriptionText}
  
  2
  00:00:05,000 --> 00:00:10,000
  More subtitles...`;
}

app.use("/compressed", express.static(path.join(__dirname, "compressed")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
