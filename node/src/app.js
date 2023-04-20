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

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`${port} portunda sunucu başlatıldı...`);
});
