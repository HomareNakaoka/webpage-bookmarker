'use strict';

const toolTipTriggerElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
toolTipTriggerElements.forEach((toolTipTriggerElement) => {
  new bootstrap.Tooltip(toolTipTriggerElement);
});