const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/download/:id', async (req, res, next) => {
  try {
    const id = req.params.id; // getting the id as parameter
    const videoUrl = `https://youtu.be/${id}`; // creating the youtube url
    const videoInfo = await ytdl.getInfo(videoUrl); // getting the video information
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestaudio' }); // getting the audio
    
    // setting the headers
    res.header('Content-Type', 'audio/mpeg');
    res.header('Content-Disposition', `attachment; filename="${videoInfo.title}.mp3"`);

    // streaming the audio
    ytdl(videoUrl, {
      quality: audioFormat.itag
    }).pipe(res);
  } catch (err) {
    next(err);
  }
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`${port} portunda sunucu başlatıldı...`);
});
