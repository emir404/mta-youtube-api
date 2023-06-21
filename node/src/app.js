const express = require('express');
const ytdl = require('ytdl-core-discord');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/download/:id', async (req, res, next) => {
  try {
    const id = req.params.id; // getting the id as parameter
    const videoUrl = `https://youtu.be/${id}`; // creating the YouTube URL
    const videoInfo = await ytdl.getInfo(videoUrl); // getting the video information
    const audioFormat = ytdl.filterFormats(videoInfo.formats, { quality: 'highestaudio' })[0]; // getting the audio format

    // setting the headers
    res.header('Content-Type', 'audio/mpeg');
    res.header('Content-Disposition', `attachment; filename="${videoInfo.title}.mp3"`);

    // streaming the audio
    ytdl(videoUrl, {
      quality: audioFormat.itag,
    }).pipe(res);
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});