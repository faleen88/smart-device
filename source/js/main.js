'use strict';

var MIN_NAME_LENGTH = 1;
var ALERT_SHOW_TIME = 4000;
var MAX_MOBILE_WIDTH = 767;
var FOCUS_TABINDEX = 0;
var DEFOCUS_TABINDEX = -1;

var anchor = document.querySelector('.promo__button');

var openPopupButton = document.querySelector('.main-header__button');
var modalPopup = document.querySelector('.modal');
var closePopupButton = modalPopup.querySelector('.modal__button');
var siteBody = document.querySelector('.page__body');
var modalOverlay = document.querySelector('.modal__overlay');

var siteAccordeon = document.querySelector('.accordeon');
var buttonsAccordeon = siteAccordeon.querySelectorAll('.accordeon__button');
var listAccordeon = siteAccordeon.querySelectorAll('.accordeon__item');

var formConnection = document.querySelector('.form--connection');
var formModal = document.querySelector('.form--modal');

var nameFields = document.querySelectorAll('#name, #name-modal');
var phoneFields = document.querySelectorAll('#phone, #phone-modal');
var textFields = document.querySelectorAll('#comment, #comment-modal');

var nameInputConnection = formConnection.querySelector('#name');
var phoneInputConnection = formConnection.querySelector('#phone');
var commentConnection = formConnection.querySelector('#comment');
var nameInputModal = formModal.querySelector('#name-modal');
var phoneInputModal = formModal.querySelector('#phone-modal');
var commentModal = formModal.querySelector('#comment-modal');

var focusElements = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])'
];
var documentFocusElements = siteBody.querySelectorAll(focusElements);
var modalFocusElements = modalPopup.querySelectorAll(focusElements);

// Якорные ссылки

anchor.addEventListener('click', function (evt) {
  evt.preventDefault();
  var id = anchor.getAttribute('href');

  document.querySelector(id).scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
});

// local storage

var isStorageSupport = true;
var storageName = '';
var storagePhone = '';
var storageComment = '';

try {
  storageName = localStorage.getItem('name');
  storagePhone = localStorage.getItem('phone');
  storageComment = localStorage.getItem('comment');
} catch (err) {
  isStorageSupport = false;
}

if (storageName) {
  nameFields.forEach(function (field) {
    field.value = storageName;
  });
}

if (storagePhone) {
  phoneFields.forEach(function (field) {
    field.value = storagePhone;
  });
}

if (storagePhone) {
  textFields.forEach(function (field) {
    field.value = storageComment;
  });
}

// Отправка формы

var modalSuccess = document.querySelector('.modal-success');

var showAlert = function () {
  modalSuccess.classList.remove('visually-hidden');

  setTimeout(function () {
    modalSuccess.classList.add('visually-hidden');
  }, ALERT_SHOW_TIME);
};

var formSubmitHandler = function (evt, name, phone, text) {
  evt.preventDefault();

  if (!phone.value && !name.value) {
    evt.preventDefault();
  } else {
    if (isStorageSupport) {
      localStorage.setItem('phone', phone.value);
      localStorage.setItem('name', name.value);
      localStorage.setItem('comment', text.value);
    }

    showAlert();
    if (modalPopup.classList.contains('modal--show')) {
      modalPopup.classList.remove('modal--show');
    }
  }
};

formConnection.addEventListener('submit', function (evt) {
  evt.preventDefault();

  formSubmitHandler(evt, nameInputConnection, phoneInputConnection, commentConnection);
});

formModal.addEventListener('submit', function (evt) {
  evt.preventDefault();

  formSubmitHandler(evt, nameInputModal, phoneInputModal, commentModal);
});

// Попап\

var appropriateTabIndex = function (elements, tabIndex) {
  elements.forEach(function (element) {
    element.tabIndex = tabIndex;
  });
};

var closeModal = function () {
  modalOverlay.classList.remove('modal__overlay--show');
  modalPopup.classList.remove('modal--show');
  closePopupButton.removeEventListener('click', closePopupHandler);
  modalOverlay.removeEventListener('click', closePopupOverlay);
  document.removeEventListener('keydown', closeEscKeydownHandler);
  siteBody.classList.remove('overflow-hidden');
  appropriateTabIndex(modalFocusElements, DEFOCUS_TABINDEX);
  appropriateTabIndex(documentFocusElements, FOCUS_TABINDEX);
  appropriateTabIndex(buttonsAccordeon, DEFOCUS_TABINDEX);
};

var closePopupHandler = function (evt) {
  evt.preventDefault();
  if (evt.target === closePopupButton) {
    closeModal();
  } else {
    return;
  }
};

var closePopupOverlay = function (evt) {
  evt.preventDefault();
  closeModal();
};

var closeEscKeydownHandler = function (evt) {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    closeModal();
  }
};

var openPopupHandler = function (evt) {
  evt.preventDefault();
  modalOverlay.classList.add('modal__overlay--show');
  modalPopup.classList.add('modal--show');
  appropriateTabIndex(documentFocusElements, DEFOCUS_TABINDEX);
  appropriateTabIndex(modalFocusElements, FOCUS_TABINDEX);
  modalPopup.querySelector('#name-modal').focus();

  closePopupButton.addEventListener('click', closePopupHandler);
  modalOverlay.addEventListener('click', closePopupOverlay);
  document.addEventListener('keydown', closeEscKeydownHandler);
  siteBody.classList.add('overflow-hidden');
};

openPopupButton.addEventListener('click', openPopupHandler);

// Аккордеон

siteAccordeon.classList.remove('accordeon--nojs');

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

buttonsAccordeon.forEach(function (button) {
  button.addEventListener('click', function (evt) {
    getAccordeonContent(evt.target.dataset.item);
  });

  button.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      getAccordeonContent(evt.target.dataset.item);
    }
  });
});

window.addEventListener('resize', function (evt) {
  evt.preventDefault();
  if (window.screen.availWidth <= MAX_MOBILE_WIDTH) {
    appropriateTabIndex(buttonsAccordeon, FOCUS_TABINDEX);
  } else {
    appropriateTabIndex(buttonsAccordeon, DEFOCUS_TABINDEX);
  }
});

// Валидация формы

nameFields.forEach(function (field) {
  field.addEventListener('input', function () {
    var valueName = field.value;

    if (valueName < MIN_NAME_LENGTH) {
      field.setCustomValidity('Введите ваше имя.');
    } else {
      field.setCustomValidity('');
    }

    field.reportValidity();
  });
});

// eslint-disable-next-line no-undef
var im = new Inputmask('+7 (999) 999-99-99');
im.mask(phoneFields);

