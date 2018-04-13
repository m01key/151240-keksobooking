'use strict';

// document.querySelector('.map').classList.remove('map--faded');

var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var map = document.querySelector('.map');
var mapFilters = map.querySelector('.map__filters-container');
var mapPins = map.querySelector('.map__pins');
var mapPinMain = map.querySelector('.map__pin--main');
var form = document.querySelector('.ad-form');
var fieldsets = form.querySelectorAll('fieldset');
var address = form.querySelector('#address');

for (var i = 0; i < fieldsets.length; i++) {
  fieldsets[i].disabled = true;
}

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
  // if (num === 100) return 'не для гостей';
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

// закрывает карту
var closeCard = function (card) {
  card.parentElement.removeChild(card);
};

// создает метку
var createPin = function (data) {
  var pin = pinTemplate.cloneNode(true);
  var pinImg = pin.querySelector('img');

  pin.style.left = (data.location.x - PIN_WIDTH / 2) + 'px';
  pin.style.top = (data.location.y - PIN_HEIGHT) + 'px';
  pinImg.src = data.author.avatar;
  pinImg.alt = data.offer.title;

  pin.addEventListener('click', function () {
    var mapCard = map.querySelector('.map__card');
    if (mapCard) {
      closeCard(mapCard);
    }
    showCard(data);
  });

  return pin;
};

// отображает метки
var showPins = function (data) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < data.length; i++) {
    fragment.appendChild(createPin(data[i]));
  }

  mapPins.appendChild(fragment);
};

// создает карточку
var createCard = function (offerData) {
  var card = cardTemplate.cloneNode(true);
  var features = card.querySelector('.popup__features');
  var photos = card.querySelector('.popup__photos');

  card.querySelector('.popup__title').textContent = offerData.offer.title;
  card.querySelector('.popup__text--address').textContent = offerData.offer.address;
  card.querySelector('.popup__text--price').textContent = offerData.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = translateType(offerData.offer.type);
  card.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' комнаты для ' + offerData.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
  card.querySelector('.popup__description').textContent = offerData.offer.description;
  features.textContent = '';
  for (var i = 0; i < offerData.offer.features.length; i++) {
    var li = document.createElement('li');
    li.classList.add('popup__feature');
    li.classList.add('popup__feature--' + offerData.offer.features[i]);
    features.appendChild(li);
  }
  photos.textContent = '';
  for (var k = 0; k < offerData.offer.photos.length; k++) {
    var img = document.createElement('img');
    img.src = offerData.offer.photos[k];
    img.alt = 'Фотография жилья';
    img.width = '45';
    img.height = '40';
    img.classList.add('popup__photo');
    photos.appendChild(img);
  }
  card.querySelector('.popup__avatar').src = offerData.author.avatar;

  return card;
};

// отображает карточку
var showCard = function (offerData) {
  var card = createCard(offerData);
  var popupCross = card.querySelector('.popup__close');

  popupCross.addEventListener('click', function () {
    closeCard(card);
  });

  mapFilters.parentElement.insertBefore(card, mapFilters);
};


var data = createDataArray();
// showPins(data);
// showCard(data);

// получает координаты главной метки (ее центр или кончик)
var getCoordsPinMain = function (center) {
  center = center === 'center' ? 2 : 1;

  var left = parseInt(mapPinMain.style.left) + PIN_MAIN_SIZE / 2;
  var right = parseInt(mapPinMain.style.top) + PIN_MAIN_SIZE / center;

  return left + ', ' + right;
};

// активирует сайт
var activateSite = function () {
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = false;
  }
  address.value = getCoordsPinMain();
}

address.value = getCoordsPinMain('center');

mapPinMain.addEventListener('mouseup', function () {
  activateSite();
  showPins(data);
});







