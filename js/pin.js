'use strict';

(function () {

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var pinTemplateElement = document.querySelector('template').content.querySelector('.map__pin');


  function createPin(data) {
    var pinElement = pinTemplateElement.cloneNode(true);
    var pinImgElement = pinElement.querySelector('img');

    pinElement.style.left = (data.location.x - PIN_WIDTH / 2) + 'px';
    pinElement.style.top = (data.location.y - PIN_HEIGHT) + 'px';
    pinImgElement.src = data.author.avatar;
    pinImgElement.alt = data.offer.title;
    pinImgElement.addEventListener('click', function () {
      var mapCardElement = document.querySelector('.map__card');
      if (mapCardElement) {
        window.card.close(mapCardElement);
      }
      window.card.show(data);
    });

    return pinElement;
  }


  window.pin = {
    create: createPin
  };

})();

