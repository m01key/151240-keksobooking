'use strict';

(function () {

  var PIN_WIDTH = 65;
  var PIN_HEIGHT = 84;
  var PIN_MIN_Y = 150;
  var PIN_MAX_Y = 500;
  var DEBOUNCE_TIME = 500;
  var OFFERS_AMOUNT = 5;
  var ERROR_TIME = 3000;

  var PinBound = {
    MAX_TOP: PIN_MAX_Y - PIN_HEIGHT,
    MIN_TOP: PIN_MIN_Y - PIN_HEIGHT,
    MIN_LEFT: 0 - PIN_WIDTH / 2
  };

  var Price = {
    MIN: 10000,
    MAX: 50000
  };

  var mapElement = document.querySelector('.map');
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var mapFiltersElement = mapElement.querySelector('.map__filters');
  var mapFeaturesElement = mapElement.querySelector('.map__features');
  var filterTypeElement = mapFiltersElement.elements['housing-type'];
  var filterPriceElement = mapFiltersElement.elements['housing-price'];
  var filterRoomsElement = mapFiltersElement.elements['housing-rooms'];
  var filterGuestsElement = mapFiltersElement.elements['housing-guests'];
  var filterFeatureElements = mapFiltersElement.elements['features'];
  var formElement = document.querySelector('.ad-form');
  var fieldsetElements = formElement.querySelectorAll('fieldset');
  var addressElement = formElement.querySelector('#address');
  var offersData;
  var timerId;
  var checkedFilterValues = [];


  function debounce(callback, data) {
    clearTimeout(timerId);
    timerId = setTimeout(function () {
      callback(data);
    }, DEBOUNCE_TIME);
  }

  function renderPins(data) {
    clearPins();
    var fragment = document.createDocumentFragment();
    var offersAmount = data.length > OFFERS_AMOUNT ? OFFERS_AMOUNT : data.length;
    for (var i = 0; i < offersAmount; i++) {
      fragment.appendChild(window.pin.create(data[i]));
    }
    mapPinsElement.appendChild(fragment);
  }

  function clearPins() {
    var mapPinElements = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    mapPinElements.forEach(function (it) {
      it.parentElement.removeChild(it);
    });
  }

  function getPinMainCoordinates() {
    var left = mapPinMainElement.offsetLeft + PIN_WIDTH / 2;
    var top = mapPinMainElement.offsetTop + PIN_HEIGHT;

    return Math.floor(left) + ', ' + Math.floor(top);
  }

  function activateSite() {
    mapElement.classList.remove('map--faded');
    formElement.classList.remove('ad-form--disabled');
    fieldsetElements.forEach(function (it) {
      it.disabled = false;
    });
    addressElement.value = getPinMainCoordinates();
    window.backend.load(onLoad, onError);
    window.map.isActive = true;
  }

  function checkPrice(offerValue, filterValue) {
    return filterValue === 'any' ||
      filterValue === 'low' && offerValue < Price.MIN ||
      filterValue === 'middle' && offerValue >= Price.MIN && offerValue < Price.MAX ||
      filterValue === 'high' && offerValue >= Price.MAX;
  }

  function checkField(offerValue, filterValue) {
    var transformed = parseInt(filterValue, 10);
    filterValue = isNaN(transformed) ? filterValue : transformed;

    return filterValue === 'any' || filterValue === offerValue;
  }

  function checkFeature(offerValues, filterValues) {
    return [].every.call(filterValues, function (it) {
      return offerValues.indexOf(it.value) !== -1;
    });
  }

  function onFeaturesChange() {
    checkedFilterValues = [].filter.call(filterFeatureElements, function (it) {
      return it.checked;
    });
  }

  function onFilterChange() {
    var offersFiltered = offersData.filter(function (it) {
      return checkField(it.offer.type, filterTypeElement.value) &&
        checkField(it.offer.rooms, filterRoomsElement.value) &&
        checkField(it.offer.guests, filterGuestsElement.value) &&
        checkPrice(it.offer.price, filterPriceElement.value) &&
        checkFeature(it.offer.features, checkedFilterValues);
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
    }, ERROR_TIME);
  }

  function onLoad(data) {
    offersData = data;
    renderPins(offersData);
  }

  function onPinMainMouseDown(evt) {
    var maxLeft = mapElement.offsetWidth - PIN_WIDTH / 2;

    var startX = evt.clientX;
    var startY = evt.clientY;

    function onMouseMove(evtMove) {
      var endX = evtMove.clientX;
      var endY = evtMove.clientY;

      var shiftLeft = endX - startX;
      var shiftTop = endY - startY;

      var newLeft = mapPinMainElement.offsetLeft + shiftLeft;
      var newTop = mapPinMainElement.offsetTop + shiftTop;

      if (newLeft < PinBound.MIN_LEFT) {
        newLeft = PinBound.MIN_LEFT;
      } else if (newLeft > maxLeft) {
        newLeft = maxLeft;
      }

      if (newTop < PinBound.MIN_TOP) {
        newTop = PinBound.MIN_TOP;
      } else if (newTop > PinBound.MAX_TOP) {
        newTop = PinBound.MAX_TOP;
      }

      mapPinMainElement.style.left = newLeft + 'px';
      mapPinMainElement.style.top = newTop + 'px';

      addressElement.value = getPinMainCoordinates();

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


  mapFeaturesElement.addEventListener('change', onFeaturesChange);
  mapFiltersElement.addEventListener('change', onFilterChange);
  mapPinMainElement.addEventListener('mousedown', onPinMainMouseDown);


  window.map = {
    getPinMainCoordinates: getPinMainCoordinates,
    clear: clearPins,
    onError: onError,
    isActive: false
  };

})();

