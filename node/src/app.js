const express = require('express');
const {ytdl, getInfo, chooseFormat} = require('ytdl-core-discord');

const app = express();

app.get('/download/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const videoUrl = `https://youtu.be/${id}`;
    const videoInfo = await getInfo(videoUrl);
    const audioFormat = chooseFormat(videoInfo.formats, { filter: 'audioonly' });
    res.header('Content-Type', 'audio/mpeg');
    res.header('Content-Disposition', `attachment; filename="${videoInfo.videoDetails.title}.mp3"`);

    const stream = ytdl(videoUrl, { filter: 'audioonly', format: audioFormat });
    stream.on('data', (chunk) => {
      res.write(chunk);
    });
    stream.on('end', () => {
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
