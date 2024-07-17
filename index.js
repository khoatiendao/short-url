require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const validUrl = require('valid-url')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlDatabase = {}
let urlId = 1

// api post URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url

  if(!validUrl.isWebUri(originalUrl)) {
    return res.json({error: 'Invalid URL'})
  }

  const shorturl = urlId++;
  urlDatabase[shorturl] = originalUrl;

  return res.json({original_url: originalUrl, short_url: shorturl})
})

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl
  const originalUrl = urlDatabase[shortUrl]

  if(originalUrl) {
    res.redirect(originalUrl)
  } else {
    res.json({error: 'Invalid URL'})
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
