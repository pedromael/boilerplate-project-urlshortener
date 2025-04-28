require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { URL } = require('url');
const app = express();

// Banco de dados em memória
const urlDatabase = {};
let urlCounter = 1; // Inicia contador em 1

// Configurações básicas
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Rota POST para criar short url
app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

  let hostname;
  try {
    hostname = new URL(originalUrl).hostname;
  } catch (error) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(hostname, (err, address) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    } else {
      const shortUrl = urlCounter++;

      urlDatabase[shortUrl] = originalUrl;

      res.json({
        original_url: originalUrl,
        short_url: shortUrl
      });
    }
  });
});

// Rota GET para redirecionar
app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'invalid url' });
  }
});

// API Hello (opcional)
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
