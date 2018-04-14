'use strict';

// КОНСТАНТЫ
var OFFER_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var OFFER_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var OFFER_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var OFFER_URL_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var OFFER_TIME = [
  '12:00',
  '13:00',
  '14:00'
];

var DATA_AMOUNT = 8;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var PIN_MAIN_SIZE = 65;


// ПЕРЕМЕННЫЕ (пути)
var cardTemplateElement = document.querySelector('template').content.querySelector('.map__card');
var pinTemplateElement = document.querySelector('template').content.querySelector('.map__pin');
var mapElement = document.querySelector('.map');
var mapFiltersElement = mapElement.querySelector('.map__filters-container');
var mapPinsElement = mapElement.querySelector('.map__pins');
var mapPinMainElement = mapElement.querySelector('.map__pin--main');
var formElement = document.querySelector('.ad-form');
var fieldsetElements = formElement.querySelectorAll('fieldset');
var addressElement = formElement.querySelector('#address');


// ФУНКЦИИ
// получает рандомный элемент из массива
var getRandElem = function (arr) {
  var randomIndex = Math.random() * arr.length;
  randomIndex = Math.floor(randomIndex);

  return arr[randomIndex];
};

// получает рандомное целое число от мин до макс включительно
var getRandInt = function (min, max) {
  var rand = Math.random() * (max - min + 1) + min;

  return Math.floor(rand);
};

// сортирует рандомно массив
var shakeArr = function (arr) {
  arr.sort(function () {
    return Math.random() - 0.5;
  });

  return arr;
};

// получает гостей для комнат
var getGuests = function (num) {
  return getRandInt(1, num);
};

// генерирует массив удобств
var getFeatures = function () {
  shakeArr(OFFER_FEATURES);

  var newArr = [];
  var newArrLength = getRandInt(0, OFFER_FEATURES.length);
  for (var i = 0; i < newArrLength; i++) {
    newArr[i] = OFFER_FEATURES[i];
  }

  return newArr;
};

// переводит тип жилья на русский
var translateType = function (type) {
  var translatedTypes = ['Дворец', 'Дом', 'Квартира', 'Лачуга'];

  for (var i = 0; i < OFFER_TYPES.length; i++) {
    if (OFFER_TYPES[i] === type) {
      var translatedType = translatedTypes[i];
      break;
    }
  }

  return translatedType;
};

// генерирует один объект данных
var createData = function (i) {
  var locationX = getRandInt(300, 900);
  var locationY = getRandInt(150, 500);
  var rooms = getRandInt(1, 5);
  var guests = getGuests(rooms);
  var checkin = getRandElem(OFFER_TIME);

  return {
    'author': {
      'avatar': 'img/avatars/user0' + (i + 1) + '.png'
    },
    'offer': {
      'title': OFFER_TITLES[i],
      'address': locationX + ', ' + locationY,
      'price': getRandInt(1000, 1000000),
      'type': getRandElem(OFFER_TYPES),
      'rooms': rooms,
      'guests': guests,
      'checkin': checkin,
      'checkout': checkin,
      'features': getFeatures(),
      'description': '',
      'photos': OFFER_URL_PHOTOS,
    },
    'location': {
      'x': locationX,
      'y': locationY
    }
  };

};

// генерирует массив объектов данных
var createDataArray = function () {
  var cards = [];

  for (var i = 0; i < DATA_AMOUNT; i++) {
    cards[i] = createData(i);
  }

  return cards;
};

// создает метку
var createPinElement = function (data) {
  var pinElement = pinTemplateElement.cloneNode(true);
  var pinImgElement = pinElement.querySelector('img');

  pinElement.style.left = (data.location.x - PIN_WIDTH / 2) + 'px';
  pinElement.style.top = (data.location.y - PIN_HEIGHT) + 'px';
  pinImgElement.src = data.author.avatar;
  pinImgElement.alt = data.offer.title;
  pinElement.addEventListener('click', onPinClick);
  pinElement.addEventListener('click', function () {
    showCardElement(data);
  });

  return pinElement;
};

// отображает метки
var showPinElements = function (data) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < data.length; i++) {
    fragment.appendChild(createPinElement(data[i]));
  }

  mapPinsElement.appendChild(fragment);
};

// создает карточку
var createCardElement = function (offerData) {
  var cardElement = cardTemplateElement.cloneNode(true);
  var featureElement = cardElement.querySelector('.popup__features');
  var photoElement = cardElement.querySelector('.popup__photos');

  cardElement.querySelector('.popup__title').textContent = offerData.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = offerData.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = offerData.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = translateType(offerData.offer.type);
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

  return cardElement;
};

// отображает карточку
var showCardElement = function (offerData) {
  var cardElement = createCardElement(offerData);
  var popupCrossElement = cardElement.querySelector('.popup__close');

  popupCrossElement.addEventListener('click', onCrossClick);

  mapFiltersElement.parentElement.insertBefore(cardElement, mapFiltersElement);
};

// обработчик закрытия на крестик
var onCrossClick = function (e) {
  var cardElement = e.target.closest('.map__card');
  closeCardElement(cardElement);
};

// обработчик закрытия на метку
var onPinClick = function () {
  var mapCardElement = mapElement.querySelector('.map__card');
  if (mapCardElement) {
    closeCardElement(mapCardElement);
  }
};

// закрывает карту
var closeCardElement = function (card) {
  card.parentElement.removeChild(card);
  card.removeEventListener('click', onCrossClick);
  card.removeEventListener('click', onPinClick);
};

// получает координаты главной метки (ее центр или кончик)
var getCoordsPinMain = function (center) {
  var shift = center === 'center' ? 2 : 1;

  var left = parseInt(mapPinMainElement.offsetLeft, 10) + PIN_MAIN_SIZE / 2;
  var top = parseInt(mapPinMainElement.offsetTop, 10) + PIN_MAIN_SIZE / shift;

  return left + ', ' + top;
};

// активирует сайт
var activateSite = function () {
  mapElement.classList.remove('map--faded');
  formElement.classList.remove('ad-form--disabled');
  for (var i = 0; i < fieldsetElements.length; i++) {
    fieldsetElements[i].disabled = false;
  }
  addressElement.value = getCoordsPinMain();
};


// СОБЫТИЯ
var data = createDataArray();

mapPinMainElement.addEventListener('mouseup', function () {
  activateSite();
  showPinElements(data);
});


// ВЫПОЛНЕНИЕ
for (var j = 0; j < fieldsetElements.length; j++) {
  fieldsetElements[j].disabled = true;
}

addressElement.value = getCoordsPinMain('center');


