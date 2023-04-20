const { Client, Intents } = require('discord.js');

// Discord client initialization
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.login('YOUR_DISCORD_BOT_TOKEN');

// Express route to handle avatar streaming
app.get('/avatar/:userId', (req, res) => {
  // Find the user with the given ID in the Discord server
  const userId = req.params.userId;
  const user = client.users.cache.get(userId);

  // If user not found, return 404
  if (!user) {
    res.status(404).send('User not found');
    return;
  }

  // Set the response headers to indicate that it's an image
  res.set({
    'Content-Type': 'image/png',
    'Content-Disposition': `attachment; filename=${user.tag}.png`,
  });

  // Stream the avatar image to the response
  user.displayAvatarURL({ format: 'png', size: 512 }).pipe(res);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
