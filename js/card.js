'use strict';

(function () {

  var engToRus = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Лачуга'
  };

  var cardTemplateElement = document.querySelector('template').content.querySelector('.map__card');
  var mapFiltersElement = document.querySelector('.map__filters-container');


  function onCardCrossClick(e) {
    var cardElement = e.target.closest('.map__card');
    closeCard(cardElement);
  }

  function createCard(offerData) {
    var cardElement = cardTemplateElement.cloneNode(true);
    var featureElement = cardElement.querySelector('.popup__features');
    var photoElement = cardElement.querySelector('.popup__photos');
    var cardCrossElement = cardElement.querySelector('.popup__close');

    cardElement.querySelector('.popup__title').textContent = offerData.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = offerData.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = offerData.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = engToRus[offerData.offer.type];
    cardElement.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
    cardElement.querySelector('.popup__description').textContent = offerData.offer.description;
    featureElement.textContent = '';
    for (var i = 0; i < offerData.offer.features.length; i++) {
      var li = document.createElement('li');
      li.classList.add('popup__feature');
      li.classList.add('popup__feature--' + offerData.offer.features[i]);
      featureElement.appendChild(li);
    }
    photoElement.textContent = '';
    for (var k = 0; k < offerData.offer.photos.length; k++) {
      var imgElement = document.createElement('img');
      imgElement.src = offerData.offer.photos[k];
      imgElement.alt = 'Фотография жилья';
      imgElement.width = 45;
      imgElement.height = 40;
      imgElement.classList.add('popup__photo');
      photoElement.appendChild(imgElement);
    }
    cardElement.querySelector('.popup__avatar').src = offerData.author.avatar;
    cardCrossElement.addEventListener('click', onCardCrossClick);

    return cardElement;
  }

  function showCard(offerData) {
    var cardElement = createCard(offerData);
    mapFiltersElement.parentElement.insertBefore(cardElement, mapFiltersElement);
  }

  function closeCard() {
    var mapCardElement = document.querySelector('.map__card');
    if (mapCardElement) {
      mapCardElement.parentElement.removeChild(mapCardElement);
    }
  }


  window.card = {
    show: showCard,
    close: closeCard
  };

})();

