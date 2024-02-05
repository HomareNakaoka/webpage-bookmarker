'use strict';
const pug= require('pug');
const assert = require('node:assert');

const html = pug.renderFile('./views/index.pug', {
  posts: [
    {
      id: 1,
      content: "<script>alert('test');</script>",
      note: '',
      postedBy: 'guest1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  user: 'guest1'
});

assert(html.includes("&lt;script&gt;alert('test');&lt;/script&gt;"));
console.log('test ok');

const str = "正規表現でマッチさせる（URLとメールアドレス編） - きままに記録箱 https://katanugramer.hatenablog.com/entry/2020/07/05/132328 2024/2/5(月) 8時26分50秒";