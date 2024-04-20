'use strict';

// ツールチップの有効化
const toolTipTriggerElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
toolTipTriggerElements.forEach((toolTipTriggerElement) => {
  new bootstrap.Tooltip(toolTipTriggerElement);
});


const formElement = document.forms['content-form'];
const contentTextareaElement = formElement.elements['content'];
const noteTextareaElement = formElement.elements['note'];
contentTextareaElement.addEventListener('keydown', (event) => {
  if (isPressedSubmitKey(event) && postContentValidation()) {
    event.preventDefault();
    formElement.submit();
  }
});
noteTextareaElement.addEventListener('keydown', (event) => {
  if (isPressedSubmitKey(event) && postContentValidation()) {
    event.preventDefault();
    formElement.submit();
  }
});
const form = document.getElementById('content-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (postContentValidation()) {
    form.submit();
  }
});

// テキストエリアの検証
function postContentValidation() {
  const postContent = document.getElementById('post-content');
  const validationMessageElement = document.getElementById('validation-message');
  const postContentText = String(postContent.value);
  const newLinePattern = /\r\n|\n/;
  const urlPattern = /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g;
  if (!postContentText.match(newLinePattern)) {
    validationMessageElement.innerText = '改行してください';
    return false;
  }
  if (!postContentText.match(urlPattern)) {
    validationMessageElement.innerText = 'URLが含まれていない、もしくは無効な形式です';
    return false;
  }
  return true;
}

// キーの判別
function isPressedSubmitKey(event) {
  if (event.key !== 'Enter') {
    return false;
  }
  if (event.ctrlKey) {
    return true;
  }
  if (event.metaKey) {
    return true;
  }
}