const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const { Client } = require('discord.js');

const app = express();

app.use(cors());

app.get('/download/:id', async (req, res, next) => {
  try {
    const id = req.params.id; // parametre olarak id alıyoruz
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

// discord botu
const client = new Client();
client.login('BOT_TOKEN');

// stream için route
app.get('/avatar/:userId', (req, res) => {
    const userId = req.params.userId;
    // user idsinden avatarı çekiyoruz
    client.users.fetch(userId)
    .then(user => {
        // user bulunamadıysa 404 döndürüyoruz
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        // headerları ayarlıyoruz
        res.set({
            'Content-Type': 'image/png',
            'Content-Disposition': 'attachment; filename=avatar.png',
        });

        // avatarı stream ediyoruz
        const avatar = user.displayAvatarURL({ format: 'png', size: 512 }).pipe(res);
    })
    // hata varsa 404 döndürüyoruz
    .catch(err => {
        res.status(404).send('User not found');
    }
    );
});

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`${port} portunda sunucu başlatıldı...`);
});