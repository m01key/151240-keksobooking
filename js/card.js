'use strict';

(function () {

  var KEY_ESC = 27;

  var Photo = {
    WIDTH: 45,
    HEIGHT: 40
  };

  var offerTypesTranslated = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Лачуга'
  };

  var cardTemplateElement = document.querySelector('template').content.querySelector('.map__card');
  var mapFiltersElement = document.querySelector('.map__filters-container');


  function onCloseCardClick(evt) {
    var cardElement = evt.target.closest('.map__card');
    closeCard(cardElement);
  }

  function onEscKeyDown(evt) {
    if (evt.keyCode === KEY_ESC) {
      window.card.close();
    }
  }

  function createCard(offerData) {
    var cardElement = cardTemplateElement.cloneNode(true);
    var featureElement = cardElement.querySelector('.popup__features');
    var photoElement = cardElement.querySelector('.popup__photos');
    var closeCardElement = cardElement.querySelector('.popup__close');

    cardElement.querySelector('.popup__title').textContent = offerData.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = offerData.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = offerData.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = offerTypesTranslated[offerData.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
    cardElement.querySelector('.popup__description').textContent = offerData.offer.description;
    featureElement.textContent = '';
    offerData.offer.features.forEach(function (it) {
      var li = document.createElement('li');
      li.classList.add('popup__feature');
      li.classList.add('popup__feature--' + it);
      featureElement.appendChild(li);
    });
    photoElement.textContent = '';
    offerData.offer.photos.forEach(function (it) {
      var imgElement = document.createElement('img');
      imgElement.src = it;
      imgElement.alt = 'Фотография жилья';
      imgElement.width = Photo.WIDTH;
      imgElement.height = Photo.HEIGHT;
      imgElement.classList.add('popup__photo');
      photoElement.appendChild(imgElement);
    });

    cardElement.querySelector('.popup__avatar').src = offerData.author.avatar;
    closeCardElement.addEventListener('click', onCloseCardClick);

    return cardElement;
  }

  function showCard(offerData) {
    var cardElement = createCard(offerData);
    mapFiltersElement.parentElement.insertBefore(cardElement, mapFiltersElement);
    document.addEventListener('keydown', onEscKeyDown);
  }

  function closeCard() {
    var mapCardElement = document.querySelector('.map__card');
    if (mapCardElement) {
      mapCardElement.parentElement.removeChild(mapCardElement);
    }
    document.removeEventListener('keydown', onEscKeyDown);
  }


  window.card = {
    show: showCard,
    close: closeCard
  };

})();

