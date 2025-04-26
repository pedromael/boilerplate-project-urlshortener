require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Banco de dados simples
const urlDatabase = {};

// Configurações básicas
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;
  const shortUrl = Math.random().toString(36).substring(2, 8);

  urlDatabase[shortUrl] = originalUrl;

  res.json({
    original_url: originalUrl,
    short_url: shortUrl
  });
});

app.get('/api/shorturl/:id', function(req, res) {
  const shortId = req.params.id;
  const originalUrl = urlDatabase[shortId];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
