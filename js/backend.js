'use strict';

(function () {

  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';
  var TIMEOUT = 5000;

  var Status = {
    SUCCESS_MIN: 200,
    SUCCESS_MAX: 308
  };


  function addErrorListeners(xhr, onError) {
    xhr.timeout = TIMEOUT;

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Время ожидания отклика от сервера превысило допустимое значение: ' + (xhr.timeout / 1000) + ' секунд');
    });
  }


  function load(onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      if (xhr.status >= Status.SUCCESS_MIN && xhr.status <= Status.SUCCESS_MAX) {
        try {
          var dataOffers = JSON.parse(xhr.responseText);
          onLoad(dataOffers);
        } catch (err) {
          onError('Произошла ошибка получения данных ' + err.name + ': ' + err.message);
        }
      } else {
        onError('Произошла ошибка при загрузке объявлений: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    addErrorListeners(xhr, onError);

    xhr.open('GET', URL_LOAD);
    xhr.send();
  }


  function upload(data, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      if (xhr.status >= Status.SUCCESS_MIN && xhr.status <= Status.SUCCESS_MAX) {
        onLoad();
      } else {
        onError('Произошла ошибка при публикации объявления: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    addErrorListeners(xhr, onError);

    xhr.open('POST', URL_UPLOAD);
    xhr.send(data);
  }


  window.backend = {
    load: load,
    upload: upload
  };

})();

