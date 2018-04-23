'use strict';

(function () {

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var pinTemplateElement = document.querySelector('template').content.querySelector('.map__pin');
  var mapPinsElement = document.querySelector('.map__pins');


  function onPinClick() {
    var mapCardElement = document.querySelector('.map__card');
    if (mapCardElement) {
      window.card.close(mapCardElement);
    }
  }

  function createPin(data) {
    var pinElement = pinTemplateElement.cloneNode(true);
    var pinImgElement = pinElement.querySelector('img');

    pinElement.style.left = (data.location.x - PIN_WIDTH / 2) + 'px';
    pinElement.style.top = (data.location.y - PIN_HEIGHT) + 'px';
    pinImgElement.src = data.author.avatar;
    pinImgElement.alt = data.offer.title;
    pinElement.addEventListener('click', onPinClick);
    pinElement.addEventListener('click', function () {
      window.card.show(data);
    });

    return pinElement;
  }

  function showPins(data) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      fragment.appendChild(createPin(data[i]));
    }
    mapPinsElement.appendChild(fragment);
  }


  window.pin = {
    show: showPins
  };

})();

