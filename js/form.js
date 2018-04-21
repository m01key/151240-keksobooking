'use strict';

(function () {

  var mapElement = document.querySelector('.map');
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var formElement = document.querySelector('.ad-form');
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
    for (var i = 0; i < fieldsetElements.length; i++) {
      fieldsetElements[i].disabled = true;
    }
    addressElement.value = window.map.getCoordsPinMain();
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

  function onResetClick() {
    mapElement.classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');
    mapPinMainElement.style.left = pinMainLeft + 'px';
    mapPinMainElement.style.top = pinMainTop + 'px';
    var card = mapElement.querySelector('.map__card');
    var pins = mapPinsElement.querySelectorAll('.map__pin');

    if (card) {
      window.card.close(card);
    }
    for (var i = 1; i < pins.length; i++) {
      mapPinsElement.removeChild(pins[i]);
    }

    setTimeout(function () {
      disableForm();
    }, 0);
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
        priceElement.min = 0;
        priceElement.placeholder = 0;
        break;
      case 'flat':
        priceElement.min = 1000;
        priceElement.placeholder = 1000;
        break;
      case 'house':
        priceElement.min = 5000;
        priceElement.placeholder = 5000;
        break;
      default:
        priceElement.min = 10000;
        priceElement.placeholder = 10000;
    }
  }


  formElement.addEventListener('reset', onResetClick);
  guestsElement.addEventListener('change', onElementChange);
  roomsElement.addEventListener('change', onElementChange);
  timeinElement.addEventListener('change', onTimeinChange);
  timeoutElement.addEventListener('change', onTimeoutChange);
  typeElement.addEventListener('change', onTypeChange);


  disableForm();

})();
