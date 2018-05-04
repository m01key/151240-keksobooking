'use strict';

(function () {

  var TIMEOUT = 5000;
  var STATUS_SUCCESS_MIN = 200;
  var STATUS_SUCCESS_MAX = 308;

  function load(onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking/data';
    var xhr = new XMLHttpRequest();

    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status >= STATUS_SUCCESS_MIN && xhr.status <= STATUS_SUCCESS_MAX) {
        try {
          var dataOffers = JSON.parse(xhr.responseText);
          onLoad(dataOffers);
        } catch (e) {
          onError('Произошла ошибка получения данных ' + e.name + ': ' + e.message);
        }
      } else {
        onError('Произошла ошибка при загрузке объявлений: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Время ожидания отклика от сервера превысило допустимое значение: ' + (xhr.timeout / 1000) + ' секунд');
    });

    xhr.open('GET', URL);
    xhr.send();
  }


  function upload(data, onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking';
    var xhr = new XMLHttpRequest();

    xhr.timeout = TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status >= STATUS_SUCCESS_MIN && xhr.status <= STATUS_SUCCESS_MAX) {
        onLoad();
      } else {
        onError('Произошла ошибка при публикации объявления: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Время ожидания отклика от сервера превысило допустимое значение: ' + (xhr.timeout / 1000) + ' секунд');
    });

    xhr.open('POST', URL);
    xhr.send(data);
  }


  window.backend = {
    load: load,
    upload: upload
  };

})();

