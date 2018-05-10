'use strict';

(function () {

  var NOTIFICATION_TIME = 3000;
  var FILE_TYPE = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'];

  var Photo = {
    WIDTH: 60,
    HEIGHT: 60
  };

  var PriceMin = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var notification = document.querySelector('.success');
  var mapElement = document.querySelector('.map');
  var mapFiltersElement = mapElement.querySelector('.map__filters');
  var mapPinMainElement = mapElement.querySelector('.map__pin--main');
  var formElement = document.querySelector('.ad-form');

  var avatarChooserElement = formElement.querySelector('.ad-form-header__input');
  var avatarPreviewElement = formElement.querySelector('.ad-form-header__preview img');
  var avatarDropZoneElement = formElement.querySelector('.ad-form-header__drop-zone');
  var avatarSource = avatarPreviewElement.src;

  var photoChooserElement = formElement.querySelector('.ad-form__input');
  var photoPreviewElement = formElement.querySelector('.ad-form__photo');
  var photoContainerElement = formElement.querySelector('.ad-form__photo-container');
  var photoDropZoneElement = formElement.querySelector('.ad-form__drop-zone');

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

  var dragElement;


  function disableForm() {
    fieldsetElements.forEach(function (it) {
      it.disabled = true;
    });
    formElement.reset();
    priceElement.min = PriceMin.FLAT;
    priceElement.placeholder = PriceMin.FLAT;
    addressElement.value = window.map.getPinMainCoordinates();
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
    window.map.clear();
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
    var housingType = typeElement.value.toUpperCase();
    priceElement.min = PriceMin[housingType];
    priceElement.placeholder = PriceMin[housingType];
  }

  function onFormSubmit(evt) {
    evt.preventDefault();

    var formData = new FormData(formElement);
    window.backend.upload(formData, onUpload, window.map.onError);
    window.map.isActive = false;
  }

  function onFormReset(evt) {
    evt.preventDefault();

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
        photoElement.draggable = true;
        var photoWrapElement = document.createElement('div');
        photoWrapElement.classList.add('ad-form__photo', 'ad-form__photo--dropzone');
        photoWrapElement.style = 'padding: 5px';
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
    avatarDropZoneElement.style.border = 'dashed 1px brown';
  }

  function onAvatarDragleave() {
    avatarDropZoneElement.style.border = '';
  }

  function onAvatarDragover(evt) {
    evt.preventDefault();
  }

  function onAvatarDrop(evt) {
    evt.preventDefault();
    avatarDropZoneElement.style.border = '';

    var dragData = evt.dataTransfer;
    var file = dragData.files[0];

    showAvatar(file);
  }

  function onPhotoChange() {
    var file = photoChooserElement.files[0];
    addPhoto(file);
  }

  function onPhotoDragenter() {
    photoDropZoneElement.style.border = 'dashed 1px brown';
  }

  function onPhotoDragleave() {
    photoDropZoneElement.style.border = '';
  }

  function onPhotoDragover(evt) {
    evt.preventDefault();
  }

  function onPhotoDrop(evt) {
    evt.preventDefault();
    photoDropZoneElement.style.border = '';

    var dragData = evt.dataTransfer;
    var file = dragData.files[0];

    addPhoto(file);
  }

  function onPhotoItemDragstart(evt) {
    dragElement = evt.target.parentElement;
    dragElement.style.outline = 'brown dashed 1px';
    dragElement.style.opacity = '0.5';
    evt.dataTransfer.effectAllowed = 'move';

    photoContainerElement.addEventListener('dragover', onPhotoItemDragover);
    photoContainerElement.addEventListener('dragend', onPhotoItemDragend);
  }

  function onPhotoItemDragover(evt) {
    evt.preventDefault();
    var target = evt.target.closest('.ad-form__photo--dropzone');

    if (target && target !== dragElement) {
      var bounds = target.getBoundingClientRect();
      var side = (evt.clientX - bounds.left) / (bounds.right - bounds.left);
      var nextElement = side > 0.5 ? target.nextSibling : target;

      target.parentElement.insertBefore(dragElement, nextElement);
    }
  }

  function onPhotoItemDragend(evt) {
    evt.preventDefault();
    dragElement.style.outline = '';
    dragElement.style.opacity = '';

    photoContainerElement.removeEventListener('dragover', onPhotoItemDragover);
    photoContainerElement.removeEventListener('dragend', onPhotoItemDragend);
  }


  photoChooserElement.addEventListener('change', onPhotoChange);
  photoDropZoneElement.addEventListener('dragenter', onPhotoDragenter);
  photoDropZoneElement.addEventListener('dragleave', onPhotoDragleave);
  photoDropZoneElement.addEventListener('dragover', onPhotoDragover);
  photoDropZoneElement.addEventListener('drop', onPhotoDrop);
  photoContainerElement.addEventListener('dragstart', onPhotoItemDragstart);

  avatarChooserElement.addEventListener('change', onAvatarChange);
  avatarDropZoneElement.addEventListener('dragenter', onAvatarDragenter);
  avatarDropZoneElement.addEventListener('dragleave', onAvatarDragleave);
  avatarDropZoneElement.addEventListener('dragover', onAvatarDragover);
  avatarDropZoneElement.addEventListener('drop', onAvatarDrop);

  guestsElement.addEventListener('change', onGuestsChange);
  roomsElement.addEventListener('change', onRoomsChange);
  timeinElement.addEventListener('change', onTimeinChange);
  timeoutElement.addEventListener('change', onTimeoutChange);
  typeElement.addEventListener('change', onTypeChange);

  formElement.addEventListener('submit', onFormSubmit);
  resetButtonElement.addEventListener('click', onFormReset);


  disableForm();

})();

