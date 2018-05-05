'use strict';

(function () {

  var Price = {
    MIN: 10000,
    MAX: 50000
  };

  var PIN_MAIN_SIZE = 65;
  var PIN_MIN_Y = 150;
  var PIN_MAX_Y = 500;
  var DEBOUNCE_TIME = 500;
  var OFFERS_AMOUNT = 5;
  var ERROR_TIME = 3000;

  var mapElement = document.querySelector('.map');
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var mapFiltersElement = mapElement.querySelector('.map__filters');
  var filterTypeElement = mapFiltersElement.elements['housing-type'];
  var filterPriceElement = mapFiltersElement.elements['housing-price'];
  var filterRoomsElement = mapFiltersElement.elements['housing-rooms'];
  var filterGuestsElement = mapFiltersElement.elements['housing-guests'];
  var filterFeatures = mapFiltersElement.elements['features'];
  var formElement = document.querySelector('.ad-form');
  var fieldsetElements = formElement.querySelectorAll('fieldset');
  var addressElement = formElement.querySelector('#address');
  var offersData;
  var timerId;


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
    mapPinElements.forEach(function (elem) {
      elem.parentElement.removeChild(elem);
    });
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
    fieldsetElements.forEach(function (elem) {
      elem.disabled = false;
    });
    addressElement.value = getCoordsPinMain();
    window.backend.load(onLoadSuccess, onError);
    window.map.isActive = true;
  }

  function checkPrice(offerVal, filterVal) {
    return filterVal === 'any' ||
      filterVal === 'low' && offerVal < Price.MIN ||
      filterVal === 'middle' && offerVal >= Price.MIN && offerVal < Price.MAX ||
      filterVal === 'high' && offerVal >= Price.MAX;
  }

  function checkField(offerVal, filterVal) {
    var transformed = parseInt(filterVal, 10);
    filterVal = isNaN(transformed) ? filterVal : transformed;

    return filterVal === 'any' || filterVal === offerVal;
  }

  function checkFeature(offerValArr, filterValArr) {
    var filterCheckedArr = [].filter.call(filterValArr, function (elem) {
      return elem.checked;
    });
    for (var i = 0; i < filterCheckedArr.length; i++) {
      if (offerValArr.indexOf(filterCheckedArr[i].value) === -1) {
        return false;
      }
    }
    return true;
  }

  function onFilterChange() {
    var offersFiltered = offersData.filter(function (elem) {
      return checkField(elem.offer.type, filterTypeElement.value) &&
        checkField(elem.offer.rooms, filterRoomsElement.value) &&
        checkField(elem.offer.guests, filterGuestsElement.value) &&
        checkPrice(elem.offer.price, filterPriceElement.value) &&
        checkFeature(elem.offer.features, filterFeatures);
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


  mapFiltersElement.addEventListener('change', onFilterChange);
  mapPinMainElement.addEventListener('mousedown', onPinMainMouseDown);


  window.map = {
    getCoordsPinMain: getCoordsPinMain,
    clearPins: clearPins,
    onError: onError,
    isActive: false
  };

})();

