const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);
require("dotenv").config();
const { OpenAI } = require("openai"); // Updated OpenAI SDK

const app = express();

// Updated CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "https://vidtools.vercel.app"], // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(cors());
app.use(express.json());

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Ensure necessary directories exist
const dirs = ["temp", "output"];
dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

// Utility function to get video information
function getVideoInfo(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata);
    });
  });
}

// Function to create concat file
function createConcatFile(files) {
  const concatFilePath = path.join(__dirname, "temp", "concat-list.txt");
  const fileContent = files.map((file) => `file '${file}'`).join("\n");
  fs.writeFileSync(concatFilePath, fileContent);
  return concatFilePath;
}

// Enhanced standardization function with fixed output parameters
async function standardizeVideo(inputPath, outputPath) {
  // Get the input video info to log
  const videoInfo = await getVideoInfo(inputPath);
  console.log(`[Standardize] Input video info:`, {
    resolution:
      videoInfo.streams[0]?.width + "x" + videoInfo.streams[0]?.height,
    duration: videoInfo.format.duration,
    size: videoInfo.format.size,
    format: videoInfo.format.format_name,
  });

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-c:v libx264",
        "-preset medium",
        "-crf 23",
        "-c:a aac",
        "-ar 44100", // Standard audio sample rate
        "-b:a 128k",
        "-pix_fmt yuv420p", // Standard pixel format
        "-vf scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:-1:-1:color=black", // Force 1080p with padding
        "-r 30", // Force 30fps
        "-movflags +faststart",
      ])
      .output(outputPath)
      .on("start", (command) => {
        console.log(`[Standardize] Command: ${command}`);
      })
      .on("progress", (progress) => {
        console.log(`[Standardize] Processing: ${progress.percent}% done`);
      })
      .on("end", () => {
        console.log(`[Standardize] Finished: ${outputPath}`);
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error(`[Standardize] Error: ${err.message}`);
        reject(err);
      })
      .run();
  });
}

// 1. Video Compression Route
app.post("/api/compress", upload.single("video"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video file provided" });
  }

  const quality = req.body.quality || "medium"; // Options: very_high, high, medium, low, very_low
  const inputPath = req.file.path;
  const outputFileName = `compressed-${Date.now()}-${req.file.originalname}`;
  const outputPath = path.join(__dirname, "output", outputFileName);

  // Quality presets
  const qualityPresets = {
    very_high: {
      videoBitrate: "3000k",
      audioBitrate: "192k",
      resolution: "1920x1080",
      fps: 30,
    },
    high: {
      videoBitrate: "2000k",
      audioBitrate: "128k",
      resolution: "1280x720",
      fps: 30,
    },
    medium: {
      videoBitrate: "1000k",
      audioBitrate: "96k",
      resolution: "854x480",
      fps: 30,
    },
    low: {
      videoBitrate: "500k",
      audioBitrate: "64k",
      resolution: "640x360",
      fps: 24,
    },
    very_low: {
      videoBitrate: "250k",
      audioBitrate: "32k",
      resolution: "426x240",
      fps: 24,
    },
  };

  const preset = qualityPresets[quality];

  try {
    const inputInfo = await getVideoInfo(inputPath);
    const inputSize = fs.statSync(inputPath).size;

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          `-b:v ${preset.videoBitrate}`,
          `-b:a ${preset.audioBitrate}`,
          `-vf scale=${preset.resolution}`,
          `-r ${preset.fps}`,
          "-preset medium",
          "-movflags +faststart",
        ])
        .output(outputPath)
        .on("progress", (progress) => {
          console.log(`[Compress] Progress: ${progress.percent}%`);
        })
        .on("end", async () => {
          const outputSize = fs.statSync(outputPath).size;
          const compressionRatio = ((1 - outputSize / inputSize) * 100).toFixed(
            2
          );

          resolve({
            outputPath,
            compressionRatio,
            inputSize,
            outputSize,
          });
        })
        .on("error", reject)
        .run();
    });

    // Clean up input file
    fs.unlinkSync(inputPath);

    res.json({
      success: true,
      outputFile: `/output/${outputFileName}`,
      stats: {
        originalSize: inputSize,
        compressedSize: fs.statSync(outputPath).size,
        compressionRatio:
          ((1 - fs.statSync(outputPath).size / inputSize) * 100).toFixed(2) +
          "%",
      },
    });
  } catch (error) {
    console.error("[Compress] Error:", error);
    res.status(500).json({ error: "Failed to compress video" });

    // Clean up on error
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  }
});

// 2. MP3 Extraction Route
app.post("/api/extract-mp3", upload.single("video"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video file provided" });
  }

  const inputPath = req.file.path;
  const outputFileName = `audio-${Date.now()}.mp3`;
  const outputPath = path.join(__dirname, "output", outputFileName);

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat("mp3")
        .outputOptions([
          "-ab 192k", // Audio bitrate
          "-ar 44100", // Sample rate
          "-ac 2", // Stereo
        ])
        .output(outputPath)
        .on("progress", (progress) => {
          console.log(`[Extract] Progress: ${progress.percent}%`);
        })
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    // Clean up input file
    fs.unlinkSync(inputPath);

    res.json({
      success: true,
      outputFile: `/output/${outputFileName}`,
      fileSize: fs.statSync(outputPath).size,
    });
  } catch (error) {
    console.error("[Extract] Error:", error);
    res.status(500).json({ error: "Failed to extract audio" });

    // Clean up on error
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  }
});

// 3. Watermarking Route
app.post(
  "/api/watermark",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "watermark", maxCount: 1 },
  ]),
  async (req, res) => {
    if (!req.files?.video?.[0] || !req.files?.watermark?.[0]) {
      return res
        .status(400)
        .json({ error: "Both video and watermark image are required" });
    }

    const videoPath = req.files.video[0].path;
    const watermarkPath = req.files.watermark[0].path;
    const outputFileName = `watermarked-${Date.now()}-${
      req.files.video[0].originalname
    }`;
    const outputPath = path.join(__dirname, "output", outputFileName);

    try {
      // Define position mappings for the watermark
      const positions = {
        topleft: "10:10",
        topright: "main_w-overlay_w-10:10",
        bottomleft: "10:main_h-overlay_h-10",
        bottomright: "main_w-overlay_w-10:main_h-overlay_h-10",
        center: "(main_w-overlay_w)/2:(main_h-overlay_h)/2",
      };

      // Use the position from the request or default to bottomright
      const position = req.body.position || "bottomright";

      await new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .input(watermarkPath)
          .complexFilter(`overlay=${positions[position]}`)
          .outputOptions(["-preset medium", "-movflags +faststart"])
          .output(outputPath)
          .on("progress", (progress) => {
            console.log(`[Watermark] Progress: ${progress.percent}%`);
          })
          .on("end", resolve)
          .on("error", reject)
          .run();
      });

      // Clean up input files
      fs.unlinkSync(videoPath);
      fs.unlinkSync(watermarkPath);

      res.json({
        success: true,
        outputFile: `/output/${outputFileName}`,
      });
    } catch (error) {
      console.error("[Watermark] Error:", error);
      res.status(500).json({ error: "Failed to add watermark" });

      // Clean up on error
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      if (fs.existsSync(watermarkPath)) fs.unlinkSync(watermarkPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }
  }
);

// 4. Merge Route
app.post("/api/merge", upload.array("videos", 10), async (req, res) => {
  console.log("[Merge] Starting video merge process");

  const videoFiles = req.files;
  const tempDir = path.join(__dirname, "temp");
  const outputPath = path.join(__dirname, "output", `merged-${Date.now()}.mp4`);
  const standardizedVideos = [];

  try {
    if (!videoFiles || videoFiles.length < 2) {
      throw new Error("At least two videos are required for merging");
    }

    console.log(`[Merge] Processing ${videoFiles.length} videos`);

    // Step 1: Standardize all videos
    for (let i = 0; i < videoFiles.length; i++) {
      const tempPath = path.join(
        tempDir,
        `standardized-${i}-${Date.now()}.mp4`
      );
      console.log(`[Merge] Standardizing video ${i + 1}/${videoFiles.length}`);

      try {
        const standardizedPath = await standardizeVideo(
          videoFiles[i].path,
          tempPath
        );
        standardizedVideos.push(standardizedPath);
        fs.unlinkSync(videoFiles[i].path); // Clean up original
      } catch (err) {
        console.error(`[Merge] Error processing video ${i + 1}:`, err);
        throw new Error(`Failed to process video ${i + 1}: ${err.message}`);
      }
    }

    // Step 2: Create concat file
    const concatFile = createConcatFile(standardizedVideos);

    // Step 3: Merge using concat demuxer
    console.log("[Merge] Starting final merge process");

    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(concatFile)
        .inputOptions(["-f concat", "-safe 0"])
        .outputOptions([
          "-c copy", // Use copy since files are already standardized
          "-movflags +faststart",
        ])
        .output(outputPath)
        .on("start", (command) => {
          console.log(`[Merge] Final merge command: ${command}`);
        })
        .on("progress", (progress) => {
          console.log(
            `[Merge] Final merge progress: ${progress.percent}% done`
          );
        })
        .on("end", () => {
          console.log("[Merge] Final merge completed successfully");
          resolve();
        })
        .on("error", (err) => {
          console.error("[Merge] Final merge error:", err);
          reject(err);
        })
        .run();
    });

    // Clean up
    standardizedVideos.forEach((video) => {
      try {
        fs.unlinkSync(video);
      } catch (err) {
        console.error(`[Merge] Error cleaning up temp file ${video}:`, err);
      }
    });
    fs.unlinkSync(concatFile);

    res.json({
      success: true,
      message: "Videos merged successfully",
      outputFile: `/output/${path.basename(outputPath)}`,
    });
  } catch (error) {
    console.error("[Merge] Error in merge process:", error);

    // Clean up any remaining files
    [...videoFiles.map((f) => f.path), ...standardizedVideos].forEach(
      (file) => {
        try {
          if (fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
        } catch (cleanupError) {
          console.error("[Merge] Error during cleanup:", cleanupError);
        }
      }
    );

    res.status(500).json({
      success: false,
      error: error.message || "Failed to merge videos",
      details: error.stack,
    });
  }
});

// 5. Format Conversion Route
app.post("/api/formatconversion", upload.single("video"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video file provided" });
  }

  const inputPath = req.file.path;
  const targetFormat = req.body.format || "mp4"; // Default format is MP4
  const outputFileName = `converted-${Date.now()}.${targetFormat}`;
  const outputPath = path.join(__dirname, "output", outputFileName);

  // Valid video formats (add more as needed)
  const validFormats = ["mp4", "avi", "mkv", "mov", "webm"];

  if (!validFormats.includes(targetFormat.toLowerCase())) {
    return res.status(400).json({ error: "Invalid target format specified" });
  }

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputFormat(targetFormat)
        .output(outputPath)
        .on("progress", (progress) => {
          console.log(`[FormatConversion] Progress: ${progress.percent}%`);
        })
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    // Clean up input file
    fs.unlinkSync(inputPath);

    res.json({
      success: true,
      outputFile: `/output/${outputFileName}`,
      format: targetFormat,
      fileSize: fs.statSync(outputPath).size,
    });
  } catch (error) {
    console.error("[FormatConversion] Error:", error);
    res.status(500).json({ error: "Failed to convert video format" });

    // Clean up on error
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  }
});

// Serve static files
app.use(
  "/output",
  (req, res, next) => {
    const ext = path.extname(req.path);
    const contentTypes = {
      ".mp4": "video/mp4",
      ".mp3": "audio/mpeg",
    };

    res.set({
      "Content-Type": contentTypes[ext] || "application/octet-stream",
      "Content-Disposition": "inline",
    });
    next();
  },
  express.static(path.join(__dirname, "output"))
);

// 6. Subtitle Generation Route
app.post("/api/generatesubtitles", upload.single("video"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video file provided" });
  }

  const inputPath = req.file.path;
  const outputFileName = `subtitled-${Date.now()}-${req.file.originalname}`;
  const outputPath = path.join(__dirname, "output", outputFileName);
  const tempSubtitlePath = path.join(__dirname, "temp", `${Date.now()}.srt`);

  try {
    // Step 1: Extract audio from video for transcription
    const audioPath = path.join(__dirname, "temp", `audio-${Date.now()}.wav`);
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .output(audioPath)
        .toFormat("wav")
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    // Step 2: Transcribe the audio using OpenAI's Whisper API
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
    });

    // Step 3: Format the transcription into .srt format
    const subtitles = response.text;
    const subtitleContent = subtitlesToSRT(subtitles);
    fs.writeFileSync(tempSubtitlePath, subtitleContent);

    // Step 4: Overlay subtitles onto the video
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .input(tempSubtitlePath)
        .outputOptions([
          "-vf subtitles=" + tempSubtitlePath,
          "-preset medium",
          "-movflags +faststart",
        ])
        .output(outputPath)
        .on("progress", (progress) => {
          console.log(`[Subtitle] Progress: ${progress.percent}%`);
        })
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    // Clean up temporary files
    fs.unlinkSync(inputPath); // Original video
    fs.unlinkSync(audioPath); // Extracted audio
    fs.unlinkSync(tempSubtitlePath); // Subtitle file

    // Step 5: Return final video
    res.json({
      success: true,
      outputFile: `/output/${outputFileName}`,
    });
  } catch (error) {
    console.error("[GenerateSubtitles] Error:", error);
    res.status(500).json({ error: "Failed to generate subtitles" });

    // Clean up on error
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  }
});

// Helper function to convert text to .srt format
function subtitlesToSRT(transcription) {
  const lines = transcription.split("\n").map((text, index) => {
    const start = formatTime(index * 2); // Assuming each line takes ~2 seconds; adjust as needed
    const end = formatTime((index + 1) * 2);
    return `${index + 1}\n${start} --> ${end}\n${text}\n`;
  });
  return lines.join("\n\n");
}

// Helper function to format time as SRT timestamp
function formatTime(seconds) {
  const date = new Date(seconds * 1000).toISOString().substr(11, 8);
  return `${date},000`; // Standard SRT format requires milliseconds
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
