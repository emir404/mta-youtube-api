const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/download', async (req, res, next) => {
  try {
    const id = req.query.id; // query parametresi olarak id alıyoruz
    const videoUrl = `https://youtu.be/${id}`; // youtube url'ini oluşturuyoruz
    const videoInfo = await ytdl.getInfo(videoUrl);
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestaudio' });
    
    res.header('Content-Type', 'audio/mpeg');
    res.header('Content-Disposition', `attachment; filename="${videoInfo.title}.mp3"`);

    ytdl(videoUrl, {
      quality: audioFormat.itag
    }).pipe(res);
  } catch (err) {
    next(err);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
