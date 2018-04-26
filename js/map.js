'use strict';

(function () {

  var PIN_MAIN_SIZE = 65;
  var PIN_MIN_Y = 150;
  var PIN_MAX_Y = 500;

  var mapElement = document.querySelector('.map');
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var formElement = document.querySelector('.ad-form');
  var fieldsetElements = formElement.querySelectorAll('fieldset');
  var addressElement = formElement.querySelector('#address');


  function onLoadSuccess(data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      fragment.appendChild(window.pin.create(data[i]));
    }
    mapPinsElement.appendChild(fragment);
  }

  function onError(message) {
    var messageElement = document.createElement('div');
    messageElement.classList.add('error-mesage');
    messageElement.textContent = message;
    document.body.insertAdjacentElement('afterbegin', messageElement);

    setTimeout(function () {
      messageElement.parentElement.removeChild(messageElement);
    }, 3000);
  }

  function getCoordsPinMain(center) {
    var shift = center === 'center' ? 2 : 1;
    var left = parseInt(mapPinMainElement.offsetLeft, 10) + PIN_MAIN_SIZE / 2;
    var top = parseInt(mapPinMainElement.offsetTop, 10) + PIN_MAIN_SIZE / shift;

    return left + ', ' + top;
  }

  function activateSite() {
    mapElement.classList.remove('map--faded');
    formElement.classList.remove('ad-form--disabled');
    for (var i = 0; i < fieldsetElements.length; i++) {
      fieldsetElements[i].disabled = false;
    }
    addressElement.value = getCoordsPinMain();
    window.backend.load(onLoadSuccess, onError);
  }

  function onPinMainMouseDown(e) {
    var maxLeft = mapElement.offsetWidth - PIN_MAIN_SIZE;
    var minLeft = 0;
    var maxTop = PIN_MAX_Y - PIN_MAIN_SIZE;
    var minTop = PIN_MIN_Y - PIN_MAIN_SIZE;

    var startX = e.clientX;
    var startY = e.clientY;

    function onMouseMove(evt) {
      var endX = evt.clientX;
      var endY = evt.clientY;

      var shiftLeft = endX - startX;
      var shiftTop = endY - startY;

      var newLeft = mapPinMainElement.offsetLeft + shiftLeft;
      var newTop = mapPinMainElement.offsetTop + shiftTop;

      if (newLeft < minLeft) {
        newLeft = minLeft;
      } else if (newLeft > maxLeft) {
        newLeft = maxLeft;
      }

      if (newTop < minTop) {
        newTop = minTop;
      } else if (newTop > maxTop) {
        newTop = maxTop;
      }

      mapPinMainElement.style.left = newLeft + 'px';
      mapPinMainElement.style.top = newTop + 'px';

      addressElement.value = getCoordsPinMain();

      startX = endX;
      startY = endY;
    }

    function onMouseUp() {
      if (!window.map.isActive) {
        activateSite();
        window.map.isActive = true;
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }


  mapPinMainElement.addEventListener('mousedown', onPinMainMouseDown);


  window.map = {
    getCoordsPinMain: getCoordsPinMain,
    onError: onError,
    isActive: false
  };

})();

