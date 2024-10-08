'use strict';
const pug = require('pug');
const fs = require('node:fs');
const Cookies = require('cookies');
const { currentOrderKey } = require('../config');

function handleTop(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.end(pug.renderFile('./views/top.pug'));
}

function handleLogout(req, res) {
  res.writeHead(401, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.end(pug.renderFile('./views/logout.pug'));
}

function handleNotFound(req, res) {
  res.writeHead(404, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.end(pug.renderFile('./views/notfound.pug'));
}

function handleBadRequest(req, res) {
  res.writeHead(400, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.end('未対応のリクエストです');
}

function handleFavicon(req, res) {
  res.writeHead(200, {
    'Content-Type': 'image/vnd.microsoft.icon',
    'Cache-Control': 'public, max-age=604800'
  });
  const favicon = fs.readFileSync('./favicon.ico');
  res.end(favicon);
}

function handleChangeOrder(req, res) {
  const ascOrder = 'asc';
  const descOrder = 'desc';
  const cookies = new Cookies(req, res);
  const currentOrder = (cookies.get(currentOrderKey) !== descOrder ? descOrder : ascOrder);
  cookies.set(currentOrderKey, currentOrder);
  res.writeHead(303, {
    'Location': '/posts'
  });
  res.end();
}

function handleStyleCssFile(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/css'
  });
  const file = fs.readFileSync('./stylesheets/style.css');
  res.end(file);
}

function handleWebPageBookMarkerJsFile(req, res) {
  res.writeHead(200, {
    'ContentType': 'text/javascript'
  });
  const file = fs.readFileSync('./public/webpage-bookmarker-util.js');
  res.end(file);
}
module.exports = {
  handleTop,
  handleLogout,
  handleStyleCssFile,
  handleFavicon,
  handleChangeOrder,
  handleWebPageBookMarkerJsFile,
  handleBadRequest,
  handleNotFound
};