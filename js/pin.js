'use strict';

(function () {

  var KEY_ENTER = 13;

  var Pin = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var pinTemplateElement = document.querySelector('template').content.querySelector('.map__pin');


  function createPin(data) {
    var pinElement = pinTemplateElement.cloneNode(true);
    var pinImgElement = pinElement.querySelector('img');

    pinElement.style.left = (data.location.x - Pin.WIDTH / 2) + 'px';
    pinElement.style.top = (data.location.y - Pin.HEIGHT) + 'px';
    pinImgElement.src = data.author.avatar;
    pinImgElement.alt = data.offer.title;
    pinElement.addEventListener('click', function () {
      window.card.close();
      window.card.show(data);
    });
    pinElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === KEY_ENTER) {
        window.card.close();
        window.card.show(data);
      }
    });

    return pinElement;
  }


  window.pin = {
    create: createPin
  };

})();

