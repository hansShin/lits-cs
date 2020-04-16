const express = require('express');
const app = express();
const request = require('superagent');
const port = process.env.PORT || 5000;

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.listen(port, () => console.log(`Listening on port ${port}`));
