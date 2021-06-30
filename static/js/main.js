"use strict";!function(){var l=!0;function t(e){(document.querySelector("body").classList.contains("_lock")?s:d)(e)}function s(e){var t,o=document.querySelector("body");l&&(t=document.querySelectorAll("._lp"),setTimeout(function(){for(var e=0;e<t.length;e++)t[e].style.paddingRight="0px";o.style.paddingRight="0px",o.classList.remove("_lock")},e),l=!1,setTimeout(function(){l=!0},e))}function d(e){var t=document.querySelector("body");if(l){for(var o=document.querySelectorAll("._lp"),n=0;n<o.length;n++)o[n].style.paddingRight=window.innerWidth-document.querySelector(".wrapper").offsetWidth+"px";t.style.paddingRight=window.innerWidth-document.querySelector(".wrapper").offsetWidth+"px",t.classList.add("_lock"),l=!1,setTimeout(function(){l=!0},e)}}var o,n,e,r;document.querySelector(".coordination__images")&&(o=window.matchMedia("(min-width: 768px)"),e=function(){var e;e=e||setTimeout(function(){!(e=null)===o.matches?void 0!==n&&n.destroy(!0,!0):!1===o.matches&&r()},100)},r=function(){n=new Swiper(".coordination__images",{direction:"horizontal",grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slidesPerView:1,spaceBetween:15,slidesOffsetBefore:0,slidesOffsetAfter:0,autoHeight:!0,pagination:{el:".coordination-pagination",type:"bullets",bulletClass:"coordination-pagination__bullet",bulletActiveClass:"coordination-pagination__bullet--active"}})},o.addListener(e),e());function i(){var e=.01*window.innerHeight;document.documentElement.style.setProperty("--vh","".concat(e,"px"))}function a(){var e=document.querySelectorAll(".stage-progress-work__list");if(0<e.length)for(var t=0;t<e.length;t++){for(var o=e[t].querySelectorAll(".stage-progress-work__item"),n=0,r=0;r<o.length-1;r++)n+=o[r].offsetHeight;e[t].style.setProperty("--height","".concat(n,"px"))}}var c,u,p,m,f,h,y,v,g,_,b,S,w,q,k,L;function A(e){this.type=e}function E(){var t;h.forEach(function(e){e.classList.remove("_active")}),this.classList.add("_active"),f=this.getAttribute("data-tabsid"),t=f,y.forEach(function(e){e=e.classList;e.contains(t)?e.add("_active"):e.remove("_active")})}A.prototype.init=function(){var r=this,i=this;this.оbjects=[],this.daClassname="_dynamic_adapt_",this.nodes=document.querySelectorAll("[data-da]");for(var e=0;e<this.nodes.length;e++){var t=this.nodes[e],o=t.dataset.da.trim().split(","),n={};n.element=t,n.parent=t.parentNode,n.destination=document.querySelector(o[0].trim()),n.breakpoint=o[1]?o[1].trim():"767",n.place=o[2]?o[2].trim():"last",n.index=this.indexInParent(n.parent,n.element),this.оbjects.push(n)}this.arraySort(this.оbjects),this.mediaQueries=Array.prototype.map.call(this.оbjects,function(e){return"("+this.type+"-width: "+e.breakpoint+"px),"+e.breakpoint},this),this.mediaQueries=Array.prototype.filter.call(this.mediaQueries,function(e,t,o){return Array.prototype.indexOf.call(o,e)===t});for(var a=0;a<this.mediaQueries.length;a++)!function(e){var e=r.mediaQueries[e],e=String.prototype.split.call(e,","),t=window.matchMedia(e[0]),o=e[1],n=Array.prototype.filter.call(r.оbjects,function(e){return e.breakpoint===o});t.addListener(function(){i.mediaHandler(t,n)}),r.mediaHandler(t,n)}(a)},A.prototype.mediaHandler=function(e,t){if(e.matches)for(var o=0;o<t.length;o++){var n=t[o];n.index=this.indexInParent(n.parent,n.element),this.moveTo(n.place,n.element,n.destination)}else for(var r=0;r<t.length;r++){var i=t[r];i.element.classList.contains(this.daClassname)&&this.moveBack(i.parent,i.element,i.index)}},A.prototype.moveTo=function(e,t,o){t.classList.add(this.daClassname),"last"===e||e>=o.children.length?o.insertAdjacentElement("beforeend",t):"first"!==e?o.children[e].insertAdjacentElement("beforebegin",t):o.insertAdjacentElement("afterbegin",t)},A.prototype.moveBack=function(e,t,o){t.classList.remove(this.daClassname),void 0!==e.children[o]?e.children[o].insertAdjacentElement("beforebegin",t):e.insertAdjacentElement("beforeend",t)},A.prototype.indexInParent=function(e,t){e=Array.prototype.slice.call(e.children);return Array.prototype.indexOf.call(e,t)},A.prototype.arraySort=function(e){"min"===this.type?Array.prototype.sort.call(e,function(e,t){return e.breakpoint===t.breakpoint?e.place===t.place?0:"first"===e.place||"last"===t.place?-1:"last"===e.place||"first"===t.place?1:e.place-t.place:e.breakpoint-t.breakpoint}):Array.prototype.sort.call(e,function(e,t){return e.breakpoint===t.breakpoint?e.place===t.place?0:"first"===e.place||"last"===t.place?1:"last"===e.place||"first"===t.place?-1:t.place-e.place:t.breakpoint-e.breakpoint})},new A("min").init(),i(),c=document.querySelector(".header__wrapper"),u=document.querySelector(".header-placeholder"),document.addEventListener("scroll",function(e){0<window.pageYOffset?(c.style.position="fixed",u.style.display="block"):(c.style.position="relative",u.style.display="none")}),null!=(m=document.querySelector(".sandwich"))&&(p=document.querySelector(".nav"),m.addEventListener("click",function(e){l&&(t(500),m.classList.toggle("_active"),p.classList.toggle("_active"))}),p.addEventListener("click",function(e){p.classList.contains("_active")&&(e.target.closest(".nav__container")||(t(500),m.classList.remove("_active"),p.classList.remove("_active")))})),h=document.querySelectorAll(".login-tabs__link"),y=document.querySelectorAll(".login-tabs__content"),h.forEach(function(e){e.addEventListener("click",E)}),function(){for(var o=document.querySelectorAll("._popup-link"),a=document.querySelectorAll(".popup"),e=function(e){var t=o[e];t.addEventListener("click",function(e){l&&function(e){var t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"";0<document.querySelectorAll(".popup._active").length&&r("",!1);var o=document.querySelector(".popup_"+e);o&&l&&(""!==t&&null!=t&&(document.querySelector(".popup_video").querySelector(".popup__video").innerHTML='<iframe src="https://www.youtube.com/embed/'+t+'?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>'),document.querySelector(".menu__body._active")||d(500),o.classList.add("_active"),history.pushState("","","#"+e))}(t.getAttribute("href").replace("#",""),t.getAttribute("data-video")),e.preventDefault()})},t=0;t<o.length;t++)e(t);for(var n=0;n<a.length;n++)a[n].addEventListener("click",function(e){e.target.closest(".popup__body")||r(e.target.closest(".popup"))});function r(e,t){var o=!(1<arguments.length&&void 0!==t)||t;if(l){if(e){t=e.querySelector(".popup__video");t&&(t.innerHTML=""),e.classList.remove("_active")}else for(var n=0;n<a.length;n++){var r=a[n],i=r.querySelector(".popup__video");i&&(i.innerHTML=""),r.classList.remove("_active")}!document.querySelector(".menu__body._active")&&o&&s(500),history.pushState("","",window.location.href.split("#")[0])}}var i=document.querySelectorAll(".popup__close,._popup-close");if(i)for(var c=0;c<i.length;c++)!function(e){var t=i[e];t.addEventListener("click",function(){r(t.closest(".popup"))})}(c);document.addEventListener("keydown",function(e){"Escape"===e.code&&r()})}(),window.addEventListener("resize",function(){v=v||setTimeout(function(){v=null,i(),a()},100)},!1),function(){var e=document.querySelectorAll(".js-select");0<e.length&&e.forEach(function(e){new Choices(e,{searchEnabled:!1,itemSelectText:"",shouldSort:!1})});var t,o=document.querySelector("#objectTypeOfWork");o&&(t=document.querySelector("._js-objectType"),""!==o.value&&t.classList.add("_active"),console.log(o.getAttribute("selected")),new Choices(o,{searchEnabled:!1,itemSelectText:"",shouldSort:!1}),o.addEventListener("addItem",function(e){t&&(console.log(""===o.value),t.classList.add("_active"))},!1))}(),function(){var t=document.querySelector("._js-bti-file");Dropzone.autoDiscover=!1,t&&new Dropzone(t,{url:"http://httpbin.org/anything"}).on("addedfile",function(e){t.classList.add("_file-load")});var e=document.querySelector("._js-estimate-offer");e&&new Dropzone(e,{url:"http://httpbin.org/anything"}).on("addedfile",function(e){})}(),document.querySelector("#map")&&ymaps.ready(function(){var e=new ymaps.Map("map",{center:[55.76,37.64],zoom:10,controls:[]}),t=(ymaps.templateLayoutFactory.createClass('<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'),new ymaps.Placemark(e.getCenter(),{hintContent:"Офис Intergator.Digital"},{iconLayout:"default#image",iconImageHref:"./static/images/content/map_marker.svg",iconImageSize:[32,32],iconImageOffset:[-5,-38]}));e.geoObjects.add(t)}),(g=document.querySelector("#objectDateSize"))&&datepicker(g,{formatter:function(e,t,o){e.value="c "+t.toLocaleDateString()},disabledDates:[new Date(2021,3,5),new Date(2021,3,8),new Date(2021,3,10),new Date(2021,3,11),new Date(2021,3,19)],alwaysShow:!0,showAllDates:!0,startDay:1,customDays:["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],customMonths:["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],overlayButton:"Выбрать",overlayPlaceholder:"Введите год",onSelect:function(e,t){var o=document.querySelector("._js-chose-date");void 0!==t?o.classList.add("_active"):o.classList.remove("_active")}}),S=document.querySelector("._js-change-input-address-button"),w=document.querySelector("._js-change-input-address-input"),S&&(_=w,b="readonly",S.addEventListener("click",function(){_.removeAttribute(b),_.focus()})),q=document.querySelector("#objectAddressOfWork"),k=document.querySelector("#objectAddressOfWorkConfirm"),q&&q.addEventListener("blur",function(){k.value=q.value}),a(),0<(L=document.querySelectorAll(".photos-works")).length&&L.forEach(function(e){var t=e.querySelector(".photos-works__list"),o=e.querySelectorAll(".photos-works__item"),n=e.parentElement.querySelector(".photos-works__more-count"),r=e.querySelectorAll("._js-see-more-photos");n.textContent="+".concat(o.length-4),r.forEach(function(e){o.length<6?e.style.display="none":e.addEventListener("click",function(){t.style.height=t.scrollHeight+"px",r.forEach(function(e){e.remove()})})})}),lightGallery(document.querySelector(".lightgallery"),{thumbnail:!0,hideBarsDelay:0,thumbMargin:10,width:"600px",height:"600px",mode:"lg-fade",addClass:"photos-works__gallery",counter:!1,download:!1,startClass:"",enableDrag:!1,speed:500,thumbWidth:64,thumbContHeight:104,zoom:!1})}();