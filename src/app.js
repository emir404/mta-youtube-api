const express = require('express');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const app = express();

// API endpoint
app.get('/convert', (req, res) => {
  const id = req.query.id;

  // Va lidate video ID
  if (!ytdl.validateID(id)) {
    res.status(400).send('Invalid YouTube video ID');
    return;
  }

  // Fetch video info
  ytdl.getInfo(id, (err, info) => {
    if (err) {
      res.status(500).send('Error fetching video info');
      return;
    }

    // Extract audio stream
    const audioStream = ytdl.downloadFromInfo(info, {
      filter: 'audioonly',
      quality: 'highestaudio'
    });

    // Convert audio stream to mp3 using ffmpeg
    const ffmpegCommand = ffmpeg(audioStream)
      .format('mp3')
      .on('error', (err) => {
        console.error(err);
        res.status(500).send('Error converting audio stream');
      })
      .on('end', () => {
        console.log('Audio conversion finished');
      });

    // Stream mp3 to response
    res.setHeader('Content-Type', 'audio/mpeg');
    ffmpegCommand.pipe(res);
  });
});

// Start server
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
