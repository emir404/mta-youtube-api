const express = require('express');
const ytdl = require('ytdl-core');

const app = express();

app.get('/download/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const videoUrl = `https://youtu.be/${id}`;
    const videoInfo = await ytdl.getInfo(videoUrl);
    const audioFormat = ytdl.filterFormats(videoInfo.formats, 'audioonly')[0];
    
    res.header('Content-Type', 'audio/mpeg');
    res.header('Content-Disposition', `attachment; filename="${videoInfo.videoDetails.title}.mp3"`);

    ytdl(videoUrl, { format: audioFormat }).pipe(res);

    res.on('finish', () => {
      res.end();
    });
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
