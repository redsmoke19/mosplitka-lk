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
  const getPageVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  const getResizePage = () => {
    window.addEventListener('resize', () => {
      getPageVh();
    });
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
  const getActionPopupLink = () => {};

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
        // history.pushState('', '', '#' + item);
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
        // history.pushState('', '', window.location.href.split('#')[0]);
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
    selectItems.forEach(item => {
      new Choices(item, {
        searchEnabled: false,
        itemSelectText: '',
        shouldSort: false,
      });
    });

    const typeOfWork = document.querySelector('#objectTypeOfWork');
    const typeOfWorkSelect = new Choices(typeOfWork, {
      searchEnabled: false,
      itemSelectText: '',
      shouldSort: false,
    });
    typeOfWork.addEventListener(
      'addItem',
      function (event) {
        const hiddenElement = document.querySelector('.object-stage__hidden');
        if (hiddenElement) {
          hiddenElement.classList.add('_active');
        }
      },
      false
    );
  };
  const getUploadFiles = () => {
    Dropzone.autoDiscover = false;
    const btiFile = document.querySelector('._js-bti-file');
    const BtiUpload = new Dropzone(btiFile, {
      url: 'http://httpbin.org/anything',
    });
    BtiUpload.on('addedfile', file => {
      btiFile.classList.add('_file-load');
    });
  };
  const getPopupMap = () => {
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
  };
  const getDatePicker = () => {
    const objectDateSize = document.querySelector(
      '#objectDateSize'
    );
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
          // new Date(2099, 0, 6),
          // new Date(2099, 0, 7),
        ],
        alwaysShow: true,
        showAllDates: true,
        startDay: 1,
        customDays: customDays,
        customMonths: customMonth,
        overlayButton: 'Выбрать',
        overlayPlaceholder: 'Введите год',
        dateSelected: new Date(),
      });
    }
  };
  dynamicAdaptive();
  getPageVh();
  getFixedHeader();
  sandwichToggle();
  getActionPopupLink();
  getLoginTabs();
  getPopup();
  getResizePage();
  getSelects();
  getUploadFiles();
  getPopupMap();
  getDatePicker();
})();
