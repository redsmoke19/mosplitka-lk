(function () {
  'use strict';
  let unlock = true;
  function bodyLock(delay) {
    const body = document.querySelector('body');
    if (body.classList.contains('_lock')) {
      bodyLockRemove(delay);
    } else {
      bodyLockAdd(delay);
    }
  }
  function bodyLockRemove(delay) {
    const body = document.querySelector('body');
    if (unlock) {
      const lockPadding = document.querySelectorAll('._lp');
      setTimeout(() => {
        for (let index = 0; index < lockPadding.length; index++) {
          const el = lockPadding[index];
          el.style.paddingRight = '0px';
        }
        body.style.paddingRight = '0px';
        body.classList.remove('_lock');
      }, delay);

      unlock = false;
      setTimeout(function () {
        unlock = true;
      }, delay);
    }
  }
  function bodyLockAdd(delay) {
    const body = document.querySelector('body');
    if (unlock) {
      const lockPadding = document.querySelectorAll('._lp');
      for (let index = 0; index < lockPadding.length; index++) {
        const el = lockPadding[index];
        el.style.paddingRight =
          window.innerWidth -
          document.querySelector('.wrapper').offsetWidth +
          'px';
      }
      body.style.paddingRight =
        window.innerWidth -
        document.querySelector('.wrapper').offsetWidth +
        'px';
      body.classList.add('_lock');

      unlock = false;
      setTimeout(function () {
        unlock = true;
      }, delay);
    }
  }
  const dynamicAdaptive = () => {
    function DynamicAdapt(type) {
      this.type = type;
    }

    DynamicAdapt.prototype.init = function () {
      const _this = this;
      // массив объектов
      this.оbjects = [];
      this.daClassname = '_dynamic_adapt_';
      // массив DOM-элементов
      this.nodes = document.querySelectorAll('[data-da]');

      // наполнение оbjects объктами
      for (let i = 0; i < this.nodes.length; i++) {
        const node = this.nodes[i];
        const data = node.dataset.da.trim();
        const dataArray = data.split(',');
        const оbject = {};
        оbject.element = node;
        оbject.parent = node.parentNode;
        оbject.destination = document.querySelector(dataArray[0].trim());
        оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
        оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.оbjects.push(оbject);
      }

      this.arraySort(this.оbjects);

      // массив уникальных медиа-запросов
      this.mediaQueries = Array.prototype.map.call(
        this.оbjects,
        function (item) {
          return (
            '(' +
            this.type +
            '-width: ' +
            item.breakpoint +
            'px),' +
            item.breakpoint
          );
        },
        this
      );
      this.mediaQueries = Array.prototype.filter.call(
        this.mediaQueries,
        function (item, index, self) {
          return Array.prototype.indexOf.call(self, item) === index;
        }
      );

      // навешивание слушателя на медиа-запрос
      // и вызов обработчика при первом запуске
      for (let i = 0; i < this.mediaQueries.length; i++) {
        const media = this.mediaQueries[i];
        const mediaSplit = String.prototype.split.call(media, ',');
        const matchMedia = window.matchMedia(mediaSplit[0]);
        const mediaBreakpoint = mediaSplit[1];

        // массив объектов с подходящим брейкпоинтом
        const оbjectsFilter = Array.prototype.filter.call(
          this.оbjects,
          function (item) {
            return item.breakpoint === mediaBreakpoint;
          }
        );
        matchMedia.addListener(function () {
          _this.mediaHandler(matchMedia, оbjectsFilter);
        });
        this.mediaHandler(matchMedia, оbjectsFilter);
      }
    };

    DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
      if (matchMedia.matches) {
        for (let i = 0; i < оbjects.length; i++) {
          const оbject = оbjects[i];
          оbject.index = this.indexInParent(оbject.parent, оbject.element);
          this.moveTo(оbject.place, оbject.element, оbject.destination);
        }
      } else {
        for (let i = 0; i < оbjects.length; i++) {
          const оbject = оbjects[i];
          if (оbject.element.classList.contains(this.daClassname)) {
            this.moveBack(оbject.parent, оbject.element, оbject.index);
          }
        }
      }
    };

    // Функция перемещения
    DynamicAdapt.prototype.moveTo = function (place, element, destination) {
      element.classList.add(this.daClassname);
      if (place === 'last' || place >= destination.children.length) {
        destination.insertAdjacentElement('beforeend', element);
        return;
      }
      if (place === 'first') {
        destination.insertAdjacentElement('afterbegin', element);
        return;
      }
      destination.children[place].insertAdjacentElement('beforebegin', element);
    };

    // Функция возврата
    DynamicAdapt.prototype.moveBack = function (parent, element, index) {
      element.classList.remove(this.daClassname);
      if (parent.children[index] !== undefined) {
        parent.children[index].insertAdjacentElement('beforebegin', element);
      } else {
        parent.insertAdjacentElement('beforeend', element);
      }
    };

    // Функция получения индекса внутри родителя
    DynamicAdapt.prototype.indexInParent = function (parent, element) {
      const array = Array.prototype.slice.call(parent.children);
      return Array.prototype.indexOf.call(array, element);
    };

    // Функция сортировки массива по breakpoint и place
    // по возрастанию для this.type = min
    // по убыванию для this.type = max
    DynamicAdapt.prototype.arraySort = function (arr) {
      if (this.type === 'min') {
        Array.prototype.sort.call(arr, function (a, b) {
          if (a.breakpoint === b.breakpoint) {
            if (a.place === b.place) {
              return 0;
            }

            if (a.place === 'first' || b.place === 'last') {
              return -1;
            }

            if (a.place === 'last' || b.place === 'first') {
              return 1;
            }

            return a.place - b.place;
          }

          return a.breakpoint - b.breakpoint;
        });
      } else {
        Array.prototype.sort.call(arr, function (a, b) {
          if (a.breakpoint === b.breakpoint) {
            if (a.place === b.place) {
              return 0;
            }

            if (a.place === 'first' || b.place === 'last') {
              return 1;
            }

            if (a.place === 'last' || b.place === 'first') {
              return -1;
            }

            return b.place - a.place;
          }

          return b.breakpoint - a.breakpoint;
        });
        // return;
      }
    };

    const da = new DynamicAdapt('min');
    da.init();
  };
  const getObjectSlider = () => {
    window.objectSlider = new Swiper('._js-object-slider', {
      direction: 'horizontal',
      grabCursor: false,
      preventClicks: true,
      preventClicksPropagation: true,
      slidesPerView: 1,
      spaceBetween: 15,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
      autoHeight: true,
      // allowTouchMove: false,
    });
    const sliderNextButton = document.querySelectorAll(
      '._js-slider-object--next'
    );
    sliderNextButton.forEach(item => {
      item.addEventListener('click', () => {
        window.objectSlider.slideNext(300);
      });
    });
  };
  const getCoordinationImagesSlider = () => {
    const coordSlider = document.querySelector('.coordination__images');
    if (coordSlider) {
      const breakpointDesktop = window.matchMedia('(min-width: 768px)');
      let coordinationImagesSlider;

      const breakpointChecker = function () {
        let resizeTimeout;
        if (!resizeTimeout) {
          resizeTimeout = setTimeout(function () {
            resizeTimeout = null;
            resizeHandlerDesktop();
          }, 100);
        }

        function resizeHandlerDesktop() {
          if (breakpointDesktop.matches === true) {
            if (coordinationImagesSlider !== undefined) {
              coordinationImagesSlider.destroy(true, true);
            }
          } else if (breakpointDesktop.matches === false) {
            enableSubMenu();
          }
        }
      };

      const enableSubMenu = function () {
        coordinationImagesSlider = new Swiper('.coordination__images', {
          direction: 'horizontal',
          grabCursor: false,
          preventClicks: true,
          preventClicksPropagation: true,
          slidesPerView: 1,
          spaceBetween: 15,
          slidesOffsetBefore: 0,
          slidesOffsetAfter: 0,
          autoHeight: true,
          pagination: {
            el: '.coordination-pagination',
            type: 'bullets',
            bulletClass: 'coordination-pagination__bullet',
            bulletActiveClass: 'coordination-pagination__bullet--active',
          },
        });
      };

      breakpointDesktop.addListener(breakpointChecker);
      breakpointChecker();
    }
  };
  getCoordinationImagesSlider();
  // getObjectSlider();
  // window.addEventListener('load', function () {
  //   window.objectSlider.update();
  // });
  const getPageVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  const getFixedHeader = () => {
    const header = document.querySelector('.header__wrapper');
    const headerPlaceholder = document.querySelector('.header-placeholder');
    document.addEventListener('scroll', e => {
      if (window.pageYOffset > 0) {
        header.style.position = 'fixed';
        headerPlaceholder.style.display = 'block';
      } else {
        header.style.position = 'relative';
        headerPlaceholder.style.display = 'none';
      }
    });
  };
  const sandwichToggle = function () {
    const iconMenu = document.querySelector('.sandwich');
    if (iconMenu != null) {
      const delay = 500;
      const menuBody = document.querySelector('.nav');
      iconMenu.addEventListener('click', function (e) {
        if (unlock) {
          bodyLock(delay);
          iconMenu.classList.toggle('_active');
          menuBody.classList.toggle('_active');
        }
      });
      menuBody.addEventListener('click', function (e) {
        if (menuBody.classList.contains('_active')) {
          if (!e.target.closest('.nav__container')) {
            bodyLock(delay);
            iconMenu.classList.remove('_active');
            menuBody.classList.remove('_active');
          }
        }
      });
    }
  };
  const getLoginTabs = () => {
    const tabsLinks = document.querySelectorAll('.login-tabs__link');
    const tabsContent = document.querySelectorAll('.login-tabs__content');
    let tabName;
    tabsLinks.forEach(item => {
      item.addEventListener('click', selectTabNav);
    });

    function selectTabNav() {
      tabsLinks.forEach(item => {
        item.classList.remove('_active');
      });
      this.classList.add('_active');
      tabName = this.getAttribute('data-tabsid');
      selectTabContent(tabName);
    }

    function selectTabContent(tab) {
      tabsContent.forEach(item => {
        const classList = item.classList;
        if (classList.contains(tab)) {
          classList.add('_active');
          // item.style.maxHeight = item.scrollHeight + 'px';
        } else {
          classList.remove('_active');
          // item.style.maxHeight = null;
        }
      });
    }
  };
  const getPopup = () => {
    const popupLink = document.querySelectorAll('._popup-link');
    const popups = document.querySelectorAll('.popup');
    for (let index = 0; index < popupLink.length; index++) {
      const el = popupLink[index];
      el.addEventListener('click', function (e) {
        if (unlock) {
          const item = el.getAttribute('href').replace('#', '');
          const video = el.getAttribute('data-video');
          popupOpen(item, video);
        }
        e.preventDefault();
      });
    }
    for (let index = 0; index < popups.length; index++) {
      const popup = popups[index];
      popup.addEventListener('click', function (e) {
        if (!e.target.closest('.popup__body')) {
          popupClose(e.target.closest('.popup'));
        }
      });
    }
    function popupOpen(item, video = '') {
      const activePopup = document.querySelectorAll('.popup._active');
      if (activePopup.length > 0) {
        popupClose('', false);
      }
      const curentPopup = document.querySelector('.popup_' + item);
      if (curentPopup && unlock) {
        if (video !== '' && video != null) {
          const popupVideo = document.querySelector('.popup_video');
          popupVideo.querySelector('.popup__video').innerHTML =
            '<iframe src="https://www.youtube.com/embed/' +
            video +
            '?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>';
        }
        if (!document.querySelector('.menu__body._active')) {
          bodyLockAdd(500);
        }
        curentPopup.classList.add('_active');
        history.pushState('', '', '#' + item);
      }
    }
    function popupClose(item, bodyUnlock = true) {
      if (unlock) {
        if (!item) {
          for (let index = 0; index < popups.length; index++) {
            const popup = popups[index];
            const video = popup.querySelector('.popup__video');
            if (video) {
              video.innerHTML = '';
            }
            popup.classList.remove('_active');
          }
        } else {
          const video = item.querySelector('.popup__video');
          if (video) {
            video.innerHTML = '';
          }
          item.classList.remove('_active');
        }
        if (!document.querySelector('.menu__body._active') && bodyUnlock) {
          bodyLockRemove(500);
        }
        history.pushState('', '', window.location.href.split('#')[0]);
      }
    }
    const popupCloseIcon = document.querySelectorAll(
      '.popup__close,._popup-close'
    );
    if (popupCloseIcon) {
      for (let index = 0; index < popupCloseIcon.length; index++) {
        const el = popupCloseIcon[index];
        el.addEventListener('click', function () {
          popupClose(el.closest('.popup'));
        });
      }
    }
    document.addEventListener('keydown', function (e) {
      if (e.code === 'Escape') {
        popupClose();
      }
    });
  };
  const getSelects = () => {
    const selectItems = document.querySelectorAll('.js-select');
    if (selectItems.length > 0) {
      selectItems.forEach(item => {
        new Choices(item, {
          searchEnabled: false,
          itemSelectText: '',
          shouldSort: false,
        });
      });
    }

    const typeOfWork = document.querySelector('#objectTypeOfWork');
    if (typeOfWork) {
      const hiddenElement = document.querySelector('._js-objectType');
      if (typeOfWork.value !== '') {
        hiddenElement.classList.add('_active');
      }
      console.log(typeOfWork.getAttribute('selected'));
      const typeOfWorkSelect = new Choices(typeOfWork, {
        searchEnabled: false,
        itemSelectText: '',
        shouldSort: false,
      });
      typeOfWork.addEventListener(
        'addItem',
        function (event) {
          if (hiddenElement) {
            console.log(typeOfWork.value === '');
            hiddenElement.classList.add('_active');
            // window.objectSlider.update();
          }
        },
        false
      );
    }
  };
  const getUploadFiles = () => {
    const btiFile = document.querySelector('._js-bti-file');
    Dropzone.autoDiscover = false;
    if (btiFile) {
      const BtiUpload = new Dropzone(btiFile, {
        url: 'http://httpbin.org/anything',
      });
      BtiUpload.on('addedfile', file => {
        btiFile.classList.add('_file-load');
        // window.objectSlider.update();
      });
    }
    const estimateOfferPassport = document.querySelector('._js-estimate-offer');
    if (estimateOfferPassport) {
      const estimateOffer = new Dropzone(estimateOfferPassport, {
        url: 'http://httpbin.org/anything',
      });
      estimateOffer.on('addedfile', file => {
        // window.objectSlider.update();
      });
    }
  };
  const getPopupMap = () => {
    const map = document.querySelector('#map');

    if (map) {
      ymaps.ready(function () {
        const map = new ymaps.Map('map', {
          center: [55.76, 37.64],
          zoom: 10,
          controls: [],
        });
        const MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
          '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
        );
        const myPlacemark = new ymaps.Placemark(
          map.getCenter(),
          {
            hintContent: 'Офис Intergator.Digital',
          },
          {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: './static/images/content/map_marker.svg',
            // Размеры метки.
            iconImageSize: [32, 32],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-5, -38],
          }
        );
        map.geoObjects.add(myPlacemark);
      });
    }
  };
  const getDatePicker = () => {
    const objectDateSize = document.querySelector('#objectDateSize');
    const customDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const customMonth = [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ];

    if (objectDateSize) {
      const objectDateSizeCalendar = datepicker(objectDateSize, {
        formatter: (input, date, instance) => {
          input.value = 'c ' + date.toLocaleDateString();
        },
        disabledDates: [
          new Date(2021, 3, 5),
          new Date(2021, 3, 8),
          new Date(2021, 3, 10),
          new Date(2021, 3, 11),
          new Date(2021, 3, 19),
        ],
        alwaysShow: true,
        showAllDates: true,
        startDay: 1,
        customDays: customDays,
        customMonths: customMonth,
        overlayButton: 'Выбрать',
        overlayPlaceholder: 'Введите год',
        onSelect: (instance, date) => {
          const hiddenBlock = document.querySelector('._js-chose-date');
          if (date !== undefined) {
            hiddenBlock.classList.add('_active');
            // window.objectSlider.update();
          } else {
            hiddenBlock.classList.remove('_active');
            // window.objectSlider.update();
          }
        },
      });
    }
  };
  const getInputValueToOtherInput = () => {
    const inputAddressOfWork = document.querySelector('#objectAddressOfWork');
    const objectAddressOfWorkConfirm = document.querySelector(
      '#objectAddressOfWorkConfirm'
    );
    if (inputAddressOfWork) {
      inputAddressOfWork.addEventListener('blur', () => {
        objectAddressOfWorkConfirm.value = inputAddressOfWork.value;
      });
    }
  };
  const getRemoveAttribute = () => {
    const changeInputObjectButton = document.querySelector('._js-change-input-address-button');
    const changeInputObjectInput = document.querySelector('._js-change-input-address-input');
    function removettribute(item, target, attr) {
      item.addEventListener('click', () => {
        target.removeAttribute(attr);
        target.focus();
      });
    }
    if (changeInputObjectButton) {
      removettribute(changeInputObjectButton, changeInputObjectInput, 'readonly');
    }
  };
  const getShowHiddenTextarea = () => {
    const stageTableItems = document.querySelectorAll('.stage-table__sub-item');
    const showButtons = document.querySelectorAll(
      '.stage-table__change-button'
    );

    const getEditEstimate = function (listItem, beforeNode) {
      const textarea = listItem.querySelector('.stage-table__textarea');
      const element = document.createElement('p');
      const elementDeleteButton = document.createElement('button');
      element.classList.add('stage-table__text-added');
      elementDeleteButton.classList.add('stage-table__text-delete');
      element.textContent = textarea.value;
      element.append(elementDeleteButton);
      beforeNode.before(element);
    };

    const getRemoveEditorEstimate = function (listItem) {
      const removeButton = listItem.querySelector('.stage-table__text-delete');
      removeButton.addEventListener('click', () => {
        removeButton.parentElement.remove();
        // window.objectSlider.update();
      });
    };

    showButtons.forEach((item, i) => {
      item.addEventListener('click', () => {
        const hiddenElement = stageTableItems[i].querySelector('._hidden');
        hiddenElement.classList.toggle('_active');
        // window.objectSlider.update();
      });
    });

    stageTableItems.forEach((item, i) => {
      const addedButton = item.querySelector('.stage-table__button-add');
      const hiddenElement = item.querySelector('._hidden, ._active');
      if (addedButton) {
        addedButton.addEventListener('click', () => {
          const addElement = item.querySelector('.stage-table__text-added');
          const textarea = item.querySelector('.stage-table__textarea');
          if (!textarea.value) return;
          if (addElement) {
            addElement.remove();
            getEditEstimate(item, showButtons[i]);
          } else {
            getEditEstimate(item, showButtons[i]);
          }
          getRemoveEditorEstimate(item);
          hiddenElement.classList.remove('_active');
          // window.objectSlider.update();
        });
      }
    });
  };
  const getObjectProgressHeight = () => {
    const objectProgressList = document.querySelectorAll(
      '.stage-progress-work__list'
    );
    if (objectProgressList.length > 0) {
      for (let i = 0; i < objectProgressList.length; i++) {
        const objectProgressItems = objectProgressList[i].querySelectorAll(
          '.stage-progress-work__item'
        );
        let height = 0;
        for (let j = 0; j < objectProgressItems.length - 1; j++) {
          height += objectProgressItems[j].offsetHeight;
        }
        objectProgressList[i].style.setProperty('--height', `${height}px`);
      }
    }
  };
  const getResizePage = () => {
    window.addEventListener('resize', resizeThrottler, false);

    let resizeTimeout;

    function resizeThrottler() {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(function () {
          resizeTimeout = null;
          actualResizeHandler();
        }, 100);
      }
    }

    function actualResizeHandler() {
      getPageVh();
      getObjectProgressHeight();
      // window.objectSlider.update();
    }
  };
  const getCoordinationImageSeeMore = () => {
    const photosWork = document.querySelectorAll('.photos-works');
    if (photosWork.length > 0) {
      photosWork.forEach(item => {
        const photosList = item.querySelector('.photos-works__list');
        const photoItems = item.querySelectorAll('.photos-works__item');
        const photosCount = item.parentElement.querySelector('.photos-works__more-count');
        const seeMoreButtons = item.querySelectorAll('._js-see-more-photos');
        photosCount.textContent = `+${photoItems.length - 4}`;
        seeMoreButtons.forEach(item => {
          if (photoItems.length < 6) {
            item.style.display = 'none';
          } else {
            item.addEventListener('click', () => {
              photosList.style.height = photosList.scrollHeight + 'px';
              seeMoreButtons.forEach(item => {
                item.remove();
              });
              // window.objectSlider.update();
            });
          }
        });
      });
    }
  };
  const gallery = () => {
    lightGallery(document.querySelector('.lightgallery'), {
      thumbnail: true,
      hideBarsDelay: 0,
      thumbMargin: 10,
      width: '600px',
      height: '600px',
      mode: 'lg-fade',
      addClass: 'photos-works__gallery',
      counter: false,
      download: false,
      startClass: '',
      enableDrag: false,
      speed: 500,
      thumbWidth: 64,
      thumbContHeight: 104,
      zoom: false,
    });
  };
  dynamicAdaptive();
  getPageVh();
  getFixedHeader();
  sandwichToggle();
  getLoginTabs();
  getPopup();
  getResizePage();
  getSelects();
  getUploadFiles();
  getPopupMap();
  getDatePicker();
  getRemoveAttribute();
  getInputValueToOtherInput();
  // getShowHiddenTextarea();
  getObjectProgressHeight();
  getCoordinationImageSeeMore();
  gallery();
})();
