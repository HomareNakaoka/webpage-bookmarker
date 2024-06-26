'use strict';
// ライブラリ読み込み
const pug = require('pug');
const Cookies = require('cookies');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: [ 'query' ] });
const util = require('./handler-util');
const crypto = require('node:crypto');
const { currentOrderKey } = require('../config');

// dayjs読み込みと設定
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const relativeTime = require('dayjs/plugin/relativeTime');
require('dayjs/locale/ja');
dayjs.locale('ja');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.tz.setDefault('Asia/Tokyo');

const oneTimeTokenMap = new Map(); // キー: ユーザー名 値: トークン
const ascOrder = 'asc';
const descOrder = 'desc';

async function handle(req, res) {
  const cookies = new Cookies(req, res);
  const currentOrder = cookies.get(currentOrderKey) || descOrder;
  const options = { maxAge: 30 * 86400 * 1000 };
  cookies.set(currentOrderKey, currentOrder, options);
  switch (req.method) {
    case 'GET':
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
      });
      const posts = await prisma.post.findMany(
        {
          orderBy: {
            id: currentOrder
          }
        }
      );
      const adminTotalCount = await prisma.post.count();
      const totalCount = await prisma.post.count({
        where: {
          postedBy: req.user
        }
      });
      posts.forEach((post) => {
        post.relativeCreatedAt = dayjs(post.createdAt).tz().fromNow();
        post.formattedCreatedAt = dayjs(post.createdAt).tz().format('YYYY年MM月DD日 HH時mm分ss秒');
      });
      const oneTimeToken = crypto.randomBytes(8).toString('hex');
      oneTimeTokenMap.set(req.user, oneTimeToken);
      res.end(pug.renderFile('./views/index.pug', { posts, totalCount, adminTotalCount, user: req.user, oneTimeToken, currentOrder }));
      console.info(
        `閲覧されました: user: ${req.user}, ` +
        `remoteAddress: ${req.socket.remoteAddres}, ` +
        `userAgent: ${req.headers['user-agent']}`
      );
      break;
    case 'POST':
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      }).on('end', async () => {
        const params = new URLSearchParams(body);
        const content = params.get('content');
        const note = params.get('note');
        const requestedOneTimeToken = params.get('oneTimeToken');
        if (!content) {
          handleRedirectPosts(req, res);
          return;
        }
        if (!requestedOneTimeToken) {
          util.handleBadRequest(req, res);
          return;
        }
        if (oneTimeTokenMap.get(req.user) !== requestedOneTimeToken) {
          util.handleBadRequest(req, res);
          return;
        }
        console.info(`送信されました: ${content}`);
        await prisma.post.create({
          data: {
            content,
            note,
            postedBy: req.user
          }
        });
        oneTimeTokenMap.delete(req.user);
        handleRedirectPosts(req, res);
      });
      break;
    default:
      util.handleBadRequest(req, res);
      break;
  }
}

function handleRedirectPosts(req, res) {
  res.writeHead(303, {
    'Location': '/posts'
  });
  res.end();
}

function handleDelete(req, res) {
  switch (req.method) {
    case 'POST':
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      }).on('end', async () => {
        const params = new URLSearchParams(body);
        const id = parseInt(params.get('id'));
        const requestedOneTimeToken = params.get('oneTimeToken');
        if (!id) {
          util.handleBadRequest(req, res);
          return;
        }
        if (!requestedOneTimeToken) {
          util.handleBadRequest(req, res);
          return;
        }
        if (oneTimeTokenMap.get(req.user) !== requestedOneTimeToken) {
          util.handleBadRequest(req, res);
          return;
        }
        const post = await prisma.post.findUnique({
          where: { id }
        });
        if (req.user === post.postedBy || req.user === 'admin') {
          await prisma.post.delete({
            where: { id }
          });
          console.info(
            `削除されました: ${req.user}, ` +
            `remoteAddress: ${req.socket.remoteAddres}, ` +
            `userAgent: ${req.headers['user-agent']}`
            );
            handleRedirectPosts(req, res);
          }
      });
      break;
    default:
      util.handleBadRequest(req, res);
      break;
  }
}

module.exports = {
  handle,
  handleDelete
};