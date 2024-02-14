'use strict';

const toolTipTriggerElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
toolTipTriggerElements.forEach((toolTipTriggerElement) => {
  new bootstrap.Tooltip(toolTipTriggerElement);
});

const formElement = document.forms['content-form'];
const contentTextareaElement = formElement.elements['content'];
const noteTextareaElement = formElement.elements['note'];
contentTextareaElement.addEventListener('keydown', (event) => {
  if (isPressedSubmitKey(event)) {
    event.preventDefault();
    formElement.submit();
  }
});
noteTextareaElement.addEventListener('keydown', (event) => {
  if (isPressedSubmitKey(event)) {
    event.preventDefault();
    formElement.submit();
  }
})

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