'use strict';

(function () {

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

  var PIN_MIN_Y = 150;
  var PIN_MAX_Y = 500;
  var PIN_MIN_X = 300;
  var PIN_MAX_X = 900;


  function getRandElem(arr) {
    var randomIndex = Math.random() * arr.length;
    randomIndex = Math.floor(randomIndex);

    return arr[randomIndex];
  }

  function getRandInt(min, max) {
    var rand = Math.random() * (max - min + 1) + min;

    return Math.floor(rand);
  }

  function shuffleArray(arr) {
    arr.sort(function () {
      return Math.random() - 0.5;
    });

    return arr;
  }

  function getGuests(num) {
    return getRandInt(1, num);
  }

  function getFeatures() {
    shuffleArray(OFFER_FEATURES);
    var newArr = [];
    var newArrLength = getRandInt(0, OFFER_FEATURES.length);
    for (var i = 0; i < newArrLength; i++) {
      newArr[i] = OFFER_FEATURES[i];
    }

    return newArr;
  }

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

  function createDataArray() {
    var cards = [];
    for (var i = 0; i < DATA_AMOUNT; i++) {
      cards[i] = createData(i);
    }

    return cards;
  }


  window.data = {
    offers: createDataArray()
  };

})();

