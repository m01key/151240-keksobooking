'use strict';

(function () {

  var PIN_MAIN_SIZE = 65;
  var PIN_MIN_Y = 150;
  var PIN_MAX_Y = 500;

  var DEBOUNCE_TIME = 500;

  var OFFERS_AMOUNT = 5;

  var mapElement = document.querySelector('.map');
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var mapFilters = mapElement.querySelector('.map__filters');
  var formElement = document.querySelector('.ad-form');
  var fieldsetElements = formElement.querySelectorAll('fieldset');
  var addressElement = formElement.querySelector('#address');
  var offersData;
  var timerId;


  function debounce(callback, data) {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
    timerId = setTimeout(function () {
      callback(data);
    }, DEBOUNCE_TIME);
  }

  function isContainCheckedFeature(offerFeatures, filterFeatures) {
    var filterFeaturesChecked = [].filter.call(filterFeatures, function (elem) {
      return elem.checked;
    });
    for (var i = 0; i < filterFeaturesChecked.length; i++) {
      if (offerFeatures.indexOf(filterFeaturesChecked[i].value) === -1) {
        return false;
      }
    }
    return true;
  }

  function renderPins(data) {
    var fragment = document.createDocumentFragment();
    var length = data.length > OFFERS_AMOUNT ? OFFERS_AMOUNT : data.length;
    for (var i = 0; i < length; i++) {
      fragment.appendChild(window.pin.create(data[i]));
    }
    mapPinsElement.innerHTML = '';
    mapPinsElement.appendChild(fragment);
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
    window.map.isActive = true;
  }

  function onFilterChange() {
    var typeFilterVal = mapFilters.elements['housing-type'].value;
    var priceFilterVal = mapFilters.elements['housing-price'].value;
    var roomsFilterVal = mapFilters.elements['housing-rooms'].value;
    var guestsFilterVal = mapFilters.elements['housing-guests'].value;
    var featuresFilter = mapFilters.elements['features'];

    var offersFiltered = offersData.filter(function (elem) {

      var i = 0;

      if (isContainCheckedFeature(elem.offer.features, featuresFilter)) {
        i += 1;
      }

      if (typeFilterVal === 'any') {
        i += 1;
      } else if (elem.offer.type === typeFilterVal) {
        i += 1;
      }

      if (roomsFilterVal === 'any') {
        i += 1;
      } else if (elem.offer.rooms === +roomsFilterVal) {
        i += 1;
      }

      if (guestsFilterVal === 'any') {
        i += 1;
      } else if (elem.offer.guests === +guestsFilterVal) {
        i += 1;
      }

      if (priceFilterVal === 'any') {
        i += 1;
      } else if (priceFilterVal === 'low' && elem.offer.price < 10000) {
        i += 1;
      } else if (priceFilterVal === 'middle' && elem.offer.price >= 10000 && elem.offer.price < 50000) {
        i += 1;
      } else if (priceFilterVal === 'high' && elem.offer.price >= 50000) {
        i += 1;
      }

      if (i === 5) {
        return true;
      }
      return false;

    });

    window.card.close();
    debounce(renderPins, offersFiltered);
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

  function onLoadSuccess(data) {
    offersData = data;
    renderPins(offersData);
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
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }


  mapFilters.addEventListener('change', onFilterChange);
  mapPinMainElement.addEventListener('mousedown', onPinMainMouseDown);


  window.map = {
    getCoordsPinMain: getCoordsPinMain,
    onError: onError,
    isActive: false
  };

})();

