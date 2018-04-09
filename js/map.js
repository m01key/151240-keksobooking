'use strict';

document.querySelector('.map').classList.remove('map--faded');

var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

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

// получаем рандомный элемент из массива
var getRandElem = function (arr) {
  var randomIndex = Math.random() * arr.length;
  randomIndex = Math.floor(randomIndex);

  return arr[randomIndex];
};

// получаем рандомное целое число от мин до макс включительно
var getRandInt = function (min, max) {
  var rand = Math.random() * (max - min + 1) + min;

  return Math.floor(rand);
};

// рандомно сортируем массив
var shakeArr = function (arr) {
  arr.sort(function () {
    return Math.random() - 0.5;
  });

  return arr;
};

// получаем гостей для комнат
var getGuests = function (num) {
  // if (num === 100) return 'не для гостей';
  return getRandInt(1, num);
};

// генерируем массив удобств
var getFeatures = function () {
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
      return translatedTypes[i];
    }
  }
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
      'photos': shakeArr(OFFER_URL_PHOTOS),
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
var createPin = function (obj) {
  var pin = pinTemplate.cloneNode(true);
  var pinImg = pin.querySelector('img');
  pin.style.left = (obj.location.x - pinImg.width / 2) + 'px';
  pin.style.top = (obj.location.y - pinImg.height) + 'px';
  pinImg.src = obj.author.avatar;
  pinImg.alt = obj.offer.title;

  return pin;
};

// вставляет метки
var insertPins = function (arr) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(createPin(arr[i]));
  }

  document.querySelector('.map__pins').appendChild(fragment);
};

// создает карточку
var createCard = function (obj) {
  var card = cardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = obj.offer.title;
  card.querySelector('.popup__text--address').textContent = obj.offer.address;
  card.querySelector('.popup__text--price').textContent = obj.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = translateType(obj.offer.type);
  card.querySelector('.popup__text--capacity').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;
  card.querySelector('.popup__features').textContent = '';
  for (var i = 0; i < obj.offer.features.length; i++) {
    card.querySelector('.popup__features').insertAdjacentHTML('beforeEnd', '<li class="popup__feature popup__feature--' + obj.offer.features[i] + '"></li>');
  }
  card.querySelector('.popup__description').textContent = obj.offer.description;
  var photoRemoved = card.querySelector('.popup__photos').removeChild(card.querySelector('.popup__photo'));
  for (var k = 0; k < obj.offer.photos.length; k++) {
    var photoClone = photoRemoved.cloneNode();
    photoClone.src = obj.offer.photos[k];
    card.querySelector('.popup__photos').appendChild(photoClone);
  }
  card.querySelector('.popup__avatar').src = obj.author.avatar;

  return card;
};

//  вставляет карточку
var insertCard = function (arr) {
  var card = createCard(arr[0]);

  document.querySelector('.map__filters-container').parentElement.insertBefore(card, document.querySelector('.map__filters-container'));
};


var data = createDataArray();
insertPins(data);
insertCard(data);


