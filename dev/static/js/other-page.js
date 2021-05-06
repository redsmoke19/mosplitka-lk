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
  const personalEdit = () => {
    const seePassword = document.querySelector('.personal__change-button');
    if (seePassword) {
      const attr = seePassword.previousSibling;
      seePassword.addEventListener('click', () => {
        if (attr.getAttribute('type') === 'password') {
          attr.setAttribute('type', 'text');
        } else {
          attr.setAttribute('type', 'password');
        }
      });
    }

    const changeInputButtons = document.querySelectorAll(
      '._js-personal-change'
    );
    changeInputButtons.forEach(item => {
      item.addEventListener('click', () => {
        let parentItem = item.parentElement;
        let input = parentItem.querySelector('.personal__input');
        input.removeAttribute('readonly');
        input.focus();
      });
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
    }
  };
  const getHistoryImageSeeMore = () => {
    const photosWork = document.querySelectorAll('.photos-works');
    if (photosWork.length > 0) {
      photosWork.forEach(item => {
        const photosList = item.querySelector('.photos-works__list');
        const photoItems = item.querySelectorAll('.photos-works__item');
        const photosCount = item.parentElement.querySelector(
          '.photos-works__more-count'
        );
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
            });
          }
        });
      });
    }
  };
  const getCoordinationImagesSlider = () => {
    const historySliders = document.querySelectorAll(
      '.object-history-photos__images'
    );
    if (historySliders.length > 0) {
      const breakpointDesktop = window.matchMedia('(min-width: 768px)');
      let coordinationImagesSlider = [];

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
            if (coordinationImagesSlider.length > 0) {
              coordinationImagesSlider.forEach(item => {
                item.destroy(true, true);
              });
            }
          } else if (breakpointDesktop.matches === false) {
            enableSubMenu();
            console.log(coordinationImagesSlider.length);
          }
        }
      };

      const enableSubMenu = function () {
        for (let i = 0; i < historySliders.length; i++) {
          coordinationImagesSlider[i] = new Swiper(
            historySliders[i],
            {
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
                el: '.object-history-photos-pagination',
                type: 'bullets',
                bulletClass: 'coordination-pagination__bullet',
                bulletActiveClass: 'coordination-pagination__bullet--active',
              },
            }
          );
        }
      };

      breakpointDesktop.addListener(breakpointChecker);
      breakpointChecker();
    }
  };
  const gallery = () => {
    const lightGalleris = document.querySelectorAll('.lightgallery');
    if (lightGalleris.length > 0) {
      lightGalleris.forEach(item => {
        lightGallery(item, {
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
      });
    }
  };
  dynamicAdaptive();
  getPageVh();
  getFixedHeader();
  sandwichToggle();
  getPopup();
  personalEdit();
  getObjectProgressHeight();
  getResizePage();
  getHistoryImageSeeMore();
  getCoordinationImagesSlider();
  gallery();
})();
