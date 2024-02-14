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