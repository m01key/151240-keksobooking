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

var OFFER_TYPES_TRANSLATED = {
  palace: 'Дворец',
  flat: 'Дом',
  house: 'Квартира',
  bungalo: 'Лачуга'
};

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

var PIN_MIN_Y = 150;

var PIN_MAX_Y = 500;

var PIN_MIN_X = 300;

var PIN_MAX_X = 900;


// ПЕРЕМЕННЫЕ
// пути
var cardTemplateElement = document.querySelector('template').content.querySelector('.map__card');
var pinTemplateElement = document.querySelector('template').content.querySelector('.map__pin');
var mapElement = document.querySelector('.map');
var mapFiltersElement = mapElement.querySelector('.map__filters-container');
var mapPinsElement = mapElement.querySelector('.map__pins');
var mapPinMainElement = mapElement.querySelector('.map__pin--main');
var formElement = document.querySelector('.ad-form');
var fieldsetElements = formElement.querySelectorAll('fieldset');
var addressElement = formElement.querySelector('#address');
var roomsElement = formElement.querySelector('#room_number');
var guestsElement = formElement.querySelector('#capacity');
var timeinElement = formElement.querySelector('#timein');
var timeoutElement = formElement.querySelector('#timeout');
var typeElement = formElement.querySelector('#type');
var priceElement = formElement.querySelector('#price');
var pinMainLeft = mapPinMainElement.offsetLeft;
var pinMainTop = mapPinMainElement.offsetTop;

// ФУНКЦИИ
// получает рандомный элемент из массива
function getRandElem(arr) {
  var randomIndex = Math.random() * arr.length;
  randomIndex = Math.floor(randomIndex);

  return arr[randomIndex];
}

// получает рандомное целое число от мин до макс включительно
function getRandInt(min, max) {
  var rand = Math.random() * (max - min + 1) + min;

  return Math.floor(rand);
}

// сортирует рандомно массив
function shakeArr(arr) {
  arr.sort(function () {
    return Math.random() - 0.5;
  });

  return arr;
}

// получает гостей для комнат
function getGuests(num) {
  return getRandInt(1, num);
}

// генерирует массив удобств
function getFeatures() {
  shakeArr(OFFER_FEATURES);

  var newArr = [];
  var newArrLength = getRandInt(0, OFFER_FEATURES.length);
  for (var i = 0; i < newArrLength; i++) {
    newArr[i] = OFFER_FEATURES[i];
  }

  return newArr;
}

// генерирует один объект данных
function createData(i) {
  var locationX = getRandInt(PIN_MIN_X, PIN_MAX_X);
  var locationY = getRandInt(PIN_MIN_Y, PIN_MAX_Y);
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

}

// генерирует массив объектов данных
function createDataArray() {
  var cards = [];

  for (var i = 0; i < DATA_AMOUNT; i++) {
    cards[i] = createData(i);
  }

  return cards;
}

// создает метку
function createPin(data) {
  var pinElement = pinTemplateElement.cloneNode(true);
  var pinImgElement = pinElement.querySelector('img');

  pinElement.style.left = (data.location.x - PIN_WIDTH / 2) + 'px';
  pinElement.style.top = (data.location.y - PIN_HEIGHT) + 'px';
  pinImgElement.src = data.author.avatar;
  pinImgElement.alt = data.offer.title;
  pinElement.addEventListener('click', onPinClick);
  pinElement.addEventListener('click', function () {
    showCard(data);
  });

  return pinElement;
}

// отображает метки
function showPins(data) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < data.length; i++) {
    fragment.appendChild(createPin(data[i]));
  }

  mapPinsElement.appendChild(fragment);
}

// создает карточку
function createCard(offerData) {
  var cardElement = cardTemplateElement.cloneNode(true);
  var featureElement = cardElement.querySelector('.popup__features');
  var photoElement = cardElement.querySelector('.popup__photos');

  cardElement.querySelector('.popup__title').textContent = offerData.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = offerData.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = offerData.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = OFFER_TYPES_TRANSLATED[offerData.offer.type];
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
}

// отображает карточку
function showCard(offerData) {
  var cardElement = createCard(offerData);
  var popupCrossElement = cardElement.querySelector('.popup__close');

  popupCrossElement.addEventListener('click', onCrossClick);

  mapFiltersElement.parentElement.insertBefore(cardElement, mapFiltersElement);
}

// обработчик закрытия на крестик
var onCrossClick = function (e) {
  var cardElement = e.target.closest('.map__card');
  closeCard(cardElement);
};

// обработчик закрытия на метку
function onPinClick() {
  var mapCardElement = mapElement.querySelector('.map__card');
  if (mapCardElement) {
    closeCard(mapCardElement);
  }
}

// закрывает карту
function closeCard(card) {
  card.parentElement.removeChild(card);
}

// получает координаты главной метки (ее центр или кончик)
function getCoordsPinMain(center) {
  var shift = center === 'center' ? 2 : 1;

  var left = parseInt(mapPinMainElement.offsetLeft, 10) + PIN_MAIN_SIZE / 2;
  var top = parseInt(mapPinMainElement.offsetTop, 10) + PIN_MAIN_SIZE / shift;

  return left + ', ' + top;
}

// активирует сайт
function activateSite() {
  mapElement.classList.remove('map--faded');
  formElement.classList.remove('ad-form--disabled');
  for (var i = 0; i < fieldsetElements.length; i++) {
    fieldsetElements[i].disabled = false;
  }
  addressElement.value = getCoordsPinMain();
}

function deactivate() {
  mapElement.classList.add('map--faded');
  formElement.classList.add('ad-form--disabled');
  for (var i = 0; i < fieldsetElements.length; i++) {
    fieldsetElements[i].disabled = true;
  }
  addressElement.value = getCoordsPinMain();
}

function checkValiditation() {
  var roomsValue = roomsElement.value;
  var guestsValue = guestsElement.value;
  var errorMessage = '';

  if (roomsValue === '100' && guestsValue !== '0') {
    errorMessage = 'необходимо выбрать "не для гостей"';
  } else if (roomsValue !== '100' && guestsValue === '0') {
    errorMessage = 'необходимо выбрать как минимум 1 гостя, но не более ' + roomsValue + ' гостей';
  } else if (roomsValue < guestsValue) {
    errorMessage = 'необходимо выбрать не более ' + roomsValue + ' гостей';
  }

  guestsElement.setCustomValidity(errorMessage);
}

function changeTime(target, value) {
  target.value = value;
}

function onResetClick() {
  mapPinMainElement.style.left = pinMainLeft + 'px';
  mapPinMainElement.style.top = pinMainTop + 'px';
  var pins = mapPinsElement.querySelectorAll('.map__pin');
  var card = mapElement.querySelector('.map__card');

  if (card) {
    closeCard(card);
  }

  for (var i = 1; i < pins.length; i++) {
    mapPinsElement.removeChild(pins[i]);
  }

  setTimeout(function () {
    deactivate();
  }, 0);
}

function onPinMainMove(e) {
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
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function onPinMainMouseUp() {
  activateSite();
  showPins(offersData);
}

function onElementChange() {
  checkValiditation();
}

function onTimeinChange() {
  changeTime(timeoutElement, timeinElement.value);
}

function onTimeoutChange() {
  changeTime(timeinElement, timeoutElement.value);
}

function onTypeChange() {
  switch (typeElement.value) {
    case 'bungalo':
      priceElement.min = 0;
      priceElement.placeholder = 0;
      break;
    case 'flat':
      priceElement.min = 1000;
      priceElement.placeholder = 1000;
      break;
    case 'house':
      priceElement.min = 5000;
      priceElement.placeholder = 5000;
      break;
    default:
      priceElement.min = 10000;
      priceElement.placeholder = 10000;
  }
}

// СОБЫТИЯ
var offersData = createDataArray();

formElement.addEventListener('reset', onResetClick);

mapPinMainElement.addEventListener('mousedown', onPinMainMove);

mapPinMainElement.addEventListener('mouseup', onPinMainMouseUp);

guestsElement.addEventListener('change', onElementChange);

roomsElement.addEventListener('change', onElementChange);

timeinElement.addEventListener('change', onTimeinChange);

timeoutElement.addEventListener('change', onTimeoutChange);

typeElement.addEventListener('change', onTypeChange);


// ВЫПОЛНЕНИЕ
for (var j = 0; j < fieldsetElements.length; j++) {
  fieldsetElements[j].disabled = true;
}

addressElement.value = getCoordsPinMain('center');

