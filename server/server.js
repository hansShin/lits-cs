const express = require('express');
const app = express();
const request = require('superagent');
const port = process.env.PORT || 5000;
const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api', (req, res) => {
  res.send({ express: 'EXPRESS CONNECTED' });
});

app.post('/api', (req, res) => {
  const ip = req.body.ip
  const url = 'http://' + ip + '/hp/device/DeviceStatus/index';

  request.get(url).timeout(5000).set('Cache-Control', 'no-cache')
    .end((error, result) => {
      if (error) {
        res.send({html: null});
      } else {
        res.send({html: result.text});
      }
    }
  );
});

app.get('/maclab', (req, res) => {
  exec("php ./legacy_php/maclab/index.php",
    {maxBuffer: 1024 * 1024 * 8},
    function(error, stdout, stderr) {
      res.send(stdout);
    }
  );
});

app.get('/pclab1', (req, res) => {
  exec("php ./legacy_php/pclab1/index.php",
    {maxBuffer: 1024 * 1024 * 8},
    function(error, stdout, stderr) {
      res.send(stdout);
    }
  );
});

app.get('/pclab2', (req, res) => {
  exec("php ./legacy_php/pclab2/index.php",
    {maxBuffer: 1024 * 1024 * 8},
    function(error, stdout, stderr) {
      res.send(stdout);
    }
  );
});

app.get('/profiles/*', (req, res) => {
  if (!fs.existsSync(req.originalUrl)) {
    res.sendFile(path.join(__dirname, 'public/profiles/open 1.jpg'));
  }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
