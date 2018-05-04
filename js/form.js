'use strict';

(function () {

  var PriceMin = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var NOTIFICATION_TIME = 3000;

  var notification = document.querySelector('.success');
  var mapElement = document.querySelector('.map');
  var mapFiltersElement = mapElement.querySelector('.map__filters');
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var formElement = document.querySelector('.ad-form');
  var resetButtonElement = formElement.querySelector('.ad-form__reset');
  var roomsElement = formElement.querySelector('#room_number');
  var guestsElement = formElement.querySelector('#capacity');
  var timeinElement = formElement.querySelector('#timein');
  var timeoutElement = formElement.querySelector('#timeout');
  var typeElement = formElement.querySelector('#type');
  var priceElement = formElement.querySelector('#price');
  var fieldsetElements = formElement.querySelectorAll('fieldset');
  var addressElement = formElement.querySelector('#address');
  var pinMainLeft = mapPinMainElement.offsetLeft;
  var pinMainTop = mapPinMainElement.offsetTop;


  function disableForm() {
    fieldsetElements.forEach(function (elem) {
      elem.disabled = true;
    });
    formElement.reset();
    addressElement.value = window.map.getCoordsPinMain();
  }

  function deactivateSite() {
    var pins = mapPinsElement.querySelectorAll('.map__pin');
    mapElement.classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');
    mapPinMainElement.style.left = pinMainLeft + 'px';
    mapPinMainElement.style.top = pinMainTop + 'px';
    window.card.close();
    pins.forEach(function (elem) {
      mapPinsElement.removeChild(elem);
    });
    mapFiltersElement.reset();
    disableForm();
    window.map.isActive = false;
  }

  function checkValiditation() {
    var roomsValue = roomsElement.value;
    var guestsValue = guestsElement.value;
    var errorMessage = '';

    if (roomsValue === '100' && guestsValue !== '0') {
      errorMessage = 'необходимо выбрать "не для гостей"';
    } else if (roomsValue !== '100' && guestsValue === '0') {
      errorMessage = 'необходимо выбрать как минимум 1 гостя, но не более ' + roomsValue + ' гостей';
    } else if (roomsValue < guestsValue) {
      errorMessage = 'необходимо выбрать не более ' + roomsValue + ' гостей';
    }

    guestsElement.setCustomValidity(errorMessage);
  }

  function changeTime(target, value) {
    target.value = value;
  }

  function onUploadSuccess() {
    deactivateSite();
    notification.classList.remove('hidden');

    setTimeout(function () {
      notification.classList.add('hidden');
    }, NOTIFICATION_TIME);
  }

  function onFormSubmit(e) {
    e.preventDefault();

    var formData = new FormData(formElement);
    window.backend.upload(formData, onUploadSuccess, window.map.onError);
    window.map.isActive = false;
  }

  function onFormReset(e) {
    e.preventDefault();

    deactivateSite();
  }

  function onElementChange() {
    checkValiditation();
  }

  function onTimeinChange() {
    changeTime(timeoutElement, timeinElement.value);
  }

  function onTimeoutChange() {
    changeTime(timeinElement, timeoutElement.value);
  }

  function onTypeChange() {
    switch (typeElement.value) {
      case 'bungalo':
        priceElement.min = PriceMin.BUNGALO;
        priceElement.placeholder = PriceMin.BUNGALO;
        break;
      case 'flat':
        priceElement.min = PriceMin.FLAT;
        priceElement.placeholder = PriceMin.FLAT;
        break;
      case 'house':
        priceElement.min = PriceMin.HOUSE;
        priceElement.placeholder = PriceMin.HOUSE;
        break;
      default:
        priceElement.min = PriceMin.PALACE;
        priceElement.placeholder = PriceMin.PALACE;
    }
  }


  resetButtonElement.addEventListener('click', onFormReset);
  formElement.addEventListener('submit', onFormSubmit);
  guestsElement.addEventListener('change', onElementChange);
  roomsElement.addEventListener('change', onElementChange);
  timeinElement.addEventListener('change', onTimeinChange);
  timeoutElement.addEventListener('change', onTimeoutChange);
  typeElement.addEventListener('change', onTypeChange);


  disableForm();

})();

