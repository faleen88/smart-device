'use strict';

var MAX_MOBILE_WIDTH = 767;

// Аккордеон

var siteAccordeon = document.querySelector('.accordeon');

siteAccordeon.classList.remove('accordeon--nojs');

var buttonsAccordeon = siteAccordeon.querySelectorAll('.accordeon__button');
var listAccordeon = siteAccordeon.querySelectorAll('.accordeon__item');

var getAccordeonContent = function (currentValue) {

  listAccordeon.forEach(function (item) {
    if (item.id === currentValue) {
      if (!item.classList.contains('accordeon__item--active')) {
        item.classList.add('accordeon__item--active');
      } else {
        item.classList.remove('accordeon__item--active');
      }
    }

    if (item.id !== currentValue) {
      item.classList.remove('accordeon__item--active');
    }
  });
};

if (window.screen.availWidth <= MAX_MOBILE_WIDTH) {
  buttonsAccordeon.forEach(function (button) {
    button.addEventListener('click', function (evt) {
      evt.preventDefault();

      getAccordeonContent(evt.target.dataset.item);
    });
  });
}
