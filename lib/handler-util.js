'use strict';
const pug = require('pug');
const fs = require('node:fs');

function handleLogout(req, res) {
  res.writeHead(401, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.end(pug.renderFile('./views/logout.pug'));
}

function handleNotFound(req, res) {
  res.writeHead(404, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.end('ページがみつかりません')
}

function handleBadRequest(req, res) {
  res.writeHead(400, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.end('未対応のリクエストです');
}

function handleStyleCssFile(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/css',
  });
  const file = fs.readFileSync('./stylesheets/style.css');
  res.end(file);
}

function handleWebPageBookMarkerJsFile(req, res) {
  res.writeHead(200, {
    'ContentType': 'text/javascript',
  });
  const file = fs.readFileSync('./public/webpage-bookmarker-util.js');
  res.end(file);
}
module.exports = {
  handleLogout,
  handleStyleCssFile,
  handleWebPageBookMarkerJsFile,
  handleBadRequest,
  handleNotFound
};