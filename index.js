'use strict';
const http = require('node:http');
const auth = require('http-auth');
const router = require('./lib/router');
const util = require('./lib/handler-util');

const basic = auth.basic({
  realm: 'Enter username and password.',
  file: './users.htpasswd'
});

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {
      'Content-Type':'text/charset=utf-8'
    });
    res.end(util.handleTop(req, res));
  } else {
    basic.check((req, res) => {
      router.route(req, res);
    })
    (req, res);
  }
}).on('error', e => {
  console.error('Server Error', e);
}).on('clientError', e => {
  console.error('Client Error', e);
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
