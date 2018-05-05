'use strict';

(function () {

  var NOTIFICATION_TIME = 3000;
  var FILE_TYPE = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'];

  var PriceMin = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var Photo = {
    WIDTH: 70,
    HEIGHT: 70
  };

  var notification = document.querySelector('.success');
  var mapElement = document.querySelector('.map');
  var mapFiltersElement = mapElement.querySelector('.map__filters');
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');
  var formElement = document.querySelector('.ad-form');

  var avatarChooserElement = formElement.querySelector('.ad-form-header__input');
  var avatarPreviewElement = formElement.querySelector('.ad-form-header__preview img');
  var avatarDropZone = formElement.querySelector('.ad-form-header__drop-zone');
  var avatarSource = avatarPreviewElement.src;

  var photoChooserElement = formElement.querySelector('.ad-form__input');
  var photoPreviewElement = formElement.querySelector('.ad-form__photo');
  var photoContainerElement = formElement.querySelector('.ad-form__photo-container');
  var photoDropZone = formElement.querySelector('.ad-form__drop-zone');

  var guestsElement = formElement.querySelector('#capacity');
  var timeinElement = formElement.querySelector('#timein');
  var timeoutElement = formElement.querySelector('#timeout');
  var typeElement = formElement.querySelector('#type');
  var priceElement = formElement.querySelector('#price');
  var fieldsetElements = formElement.querySelectorAll('fieldset');
  var addressElement = formElement.querySelector('#address');
  var resetButtonElement = formElement.querySelector('.ad-form__reset');
  var roomsElement = formElement.querySelector('#room_number');

  var pinMainLeft = mapPinMainElement.offsetLeft;
  var pinMainTop = mapPinMainElement.offsetTop;


  function disableForm() {
    fieldsetElements.forEach(function (it) {
      it.disabled = true;
    });
    formElement.reset();
    addressElement.value = window.map.getCoordsPinMain();
  }

  function deactivateSite() {
    mapElement.classList.add('map--faded');
    formElement.classList.add('ad-form--disabled');
    mapPinMainElement.style.left = pinMainLeft + 'px';
    mapPinMainElement.style.top = pinMainTop + 'px';

    avatarPreviewElement.src = avatarSource;
    var photoPreviewElements = formElement.querySelectorAll('.ad-form__photo');
    photoPreviewElements.forEach(function (it, i, arr) {
      if (i !== arr.length - 1) {
        it.parentElement.removeChild(it);
      }
    });

    window.card.close();
    window.map.clearPins();
    mapFiltersElement.reset();
    disableForm();

    window.map.isActive = false;
  }

  function checkValidity() {
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


  function onGuestsChange() {
    checkValidity();
  }

  function onRoomsChange() {
    checkValidity();
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
        priceElement.min = PriceMin.BUNGALO;
        priceElement.placeholder = PriceMin.BUNGALO;
        break;
      case 'flat':
        priceElement.min = PriceMin.FLAT;
        priceElement.placeholder = PriceMin.FLAT;
        break;
      case 'house':
        priceElement.min = PriceMin.HOUSE;
        priceElement.placeholder = PriceMin.HOUSE;
        break;
      default:
        priceElement.min = PriceMin.PALACE;
        priceElement.placeholder = PriceMin.PALACE;
    }
  }

  function onFormSubmit(e) {
    e.preventDefault();

    var formData = new FormData(formElement);
    window.backend.upload(formData, onUpload, window.map.onError);
    window.map.isActive = false;
  }

  function onFormReset(e) {
    e.preventDefault();

    deactivateSite();
  }

  function onUpload() {
    deactivateSite();
    notification.classList.remove('hidden');

    setTimeout(function () {
      notification.classList.add('hidden');
    }, NOTIFICATION_TIME);
  }


  function checkFileValidity(file) {
    if (!file) {
      return false;
    }
    return FILE_TYPE.some(function (it) {
      return it === file.type;
    });
  }

  function showAvatar(file) {
    if (checkFileValidity(file)) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreviewElement.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  }

  function addPhoto(file) {
    if (checkFileValidity(file)) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var photoElement = document.createElement('img');
        photoElement.src = reader.result;
        photoElement.width = Photo.WIDTH;
        photoElement.height = Photo.HEIGHT;
        var photoWrapElement = document.createElement('div');
        photoWrapElement.classList.add('ad-form__photo');
        photoWrapElement.appendChild(photoElement);
        photoContainerElement.insertBefore(photoWrapElement, photoPreviewElement);
      });

      reader.readAsDataURL(file);
    }
  }


  function onAvatarChange() {
    var file = avatarChooserElement.files[0];
    showAvatar(file);
  }

  function onAvatarDragenter() {
    avatarDropZone.style.border = 'dashed 1px brown';
  }

  function onAvatarDragleave() {
    avatarDropZone.style.border = '';
  }

  function onAvatarDragover(e) {
    e.preventDefault();
  }

  function onAvatarDrop(e) {
    e.preventDefault();
    avatarDropZone.style.border = '';

    var dragData = e.dataTransfer;
    var file = dragData.files[0];

    showAvatar(file);
  }

  function onPhotoChange() {
    var file = photoChooserElement.files[0];
    addPhoto(file);
  }

  function onPhotoDragenter() {
    photoDropZone.style.border = 'dashed 1px brown';
  }

  function onPhotoDragleave() {
    photoDropZone.style.border = '';
  }

  function onPhotoDragover(e) {
    e.preventDefault();
  }

  function onPhotoDrop(e) {
    e.preventDefault();
    photoDropZone.style.border = '';

    var dragData = e.dataTransfer;
    var file = dragData.files[0];

    addPhoto(file);
  }


  photoChooserElement.addEventListener('change', onPhotoChange);
  photoDropZone.addEventListener('dragenter', onPhotoDragenter);
  photoDropZone.addEventListener('dragleave', onPhotoDragleave);
  photoDropZone.addEventListener('dragover', onPhotoDragover);
  photoDropZone.addEventListener('drop', onPhotoDrop);

  avatarChooserElement.addEventListener('change', onAvatarChange);
  avatarDropZone.addEventListener('dragenter', onAvatarDragenter);
  avatarDropZone.addEventListener('dragleave', onAvatarDragleave);
  avatarDropZone.addEventListener('dragover', onAvatarDragover);
  avatarDropZone.addEventListener('drop', onAvatarDrop);

  guestsElement.addEventListener('change', onGuestsChange);
  roomsElement.addEventListener('change', onRoomsChange);
  timeinElement.addEventListener('change', onTimeinChange);
  timeoutElement.addEventListener('change', onTimeoutChange);
  typeElement.addEventListener('change', onTypeChange);

  formElement.addEventListener('submit', onFormSubmit);
  resetButtonElement.addEventListener('click', onFormReset);


  disableForm();

})();

