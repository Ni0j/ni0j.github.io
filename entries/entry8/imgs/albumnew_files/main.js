var VICTOR = VICTOR || {};

window.location.getDir = function(n) {
  return this.origin + this.pathname.replace(new RegExp("(?:\\\/+[^\\\/]*){0," + ((n || 0) + 1) + "}$"), "/");
};

// ======================================================================================
// ユーザーエージェント判定用
// ======================================================================================
VICTOR.UA = {
  CONSTS: {
    BREAK_POINT: 768
  },
  init: function() {
    this.setParams();
  },
  setParams: function() {
    this.ua = navigator.userAgent.toLowerCase();
    this.$window = $(window);
  },
  getDevice: function() {
    if(this.ua.indexOf('iphone') > -1 || this.ua.indexOf('ipod') > -1 || this.ua.indexOf('android') > -1 && this.ua.indexOf('mobile') > -1){
      return 'sp';
    }else if(this.ua.indexOf('ipad') > -1 || this.ua.indexOf('andorid') > -1){
      return 'tab';
    }else{
      return 'pc';
    }
  },
  isPC: function() {
    return this.getDevice() === 'pc';
  },
  isSP: function() {
    return this.getDevice() === 'sp';
  },
  isTAB: function() {
    return this.getDevice() === 'tab';
  },
  isIOS: function() {
    return (this.ua.indexOf('iphone') > -1) || (this.ua.indexOf('ipad') > -1);
  },
  isAndroid: function() {
    return this.ua.indexOf('android') > -1;
  },
  isTouchDevice: function() {
    return window.ontouchstart !== void(0);
  },
  isSP: function() {
    return this.$window.width() < this.CONSTS.BREAK_POINT;
  }
};

// ======================================================================================
// ヘッダーメニュー
// ヘッダーの検索・ハンバーガーメニューを操作するオブジェクト
// ======================================================================================
VICTOR.HEADER = {
  CONSTS: {
    HEIGHT: 60,
    HEADER_HIDE_PIXEL : 500,
    HEADER_SHOW_DELAY : 0,
    HEADER_HIDE_DELAY : 300
  },
  CLASS: {
    IS_ACTIVE: 'is-active'
  },
  init: function() {
    if(!this.setParams()) return;
    this.prepare();
    this.bindEvents();
  },
  setParams: function() {
    this.$header = $('.jsc-header-page');
    if(this.$header.length === 0) return false;

    this.$window = $(window);
    this.$htmlBody = $('html, body');
    this.$navLinks = this.$header.find('.jsc-nav-header').find('a');
    this.$scrollTop = this.$window.scrollTop();

    this.$overlay = $('.jsc-header-overlay');
    this.$searchReact = this.$header.find('.jsc-search-react');
    this.$menuReact = this.$header.find('.jsc-menu-react');
    this.$searchTrigger = this.$header.find('.jsc-search-trigger');
    this.$menuTrigger = this.$header.find('.jsc-menu-trigger');
    this.$breadcrumbList = $('.m-list-breadcrumb').find('a');

    this.scrollFlag = false;
    return true;
  },
  prepare: function() {
    this.setActiveNav();
  },
  setActiveNav: function() {
    var path = location.pathname;
    if (this.$breadcrumbList.length > 1 && this.$breadcrumbList.eq(1).attr('href').indexOf('/-/Genre/') > -1 ) {
      this.$header.find('a[href="/-/Genre/"]').addClass(this.CLASS.IS_ACTIVE);
    } else if($('.jsc-menu-artist').length != 0) {
      this.$header.find('a[href="/-/Artistlist/"]').addClass(this.CLASS.IS_ACTIVE);
    } else {
      for(var i = 0, len = this.$navLinks.length; i < len; i++) {
        if(path.indexOf(this.$navLinks.eq(i).attr('href')) > -1) {
          this.$navLinks.eq(i).addClass(this.CLASS.IS_ACTIVE);
          break;
        }
      }
    }
  },
  bindEvents: function() {
    var myself  = this;
    this.$window.on('resize', function() {
      myself.resizeEvent();
    });
    this.$window.on('scroll', function(e) {
      myself.scrollEvent();
    });
    this.$searchTrigger.on('click', function(e) {
      e.preventDefault();
      myself.toggleSearch();
    });
    this.$menuTrigger.on('click', function(e) {
      e.preventDefault();
      myself.toggleMenu();
    });
    this.$overlay.on('click', function() {
      myself.close();
    });
    this.$lastMenuItem = this.$menuReact.children().last();

    var start = 0;
    var end = 0;
    this.$menuReact.on('touchstart.menuscroll', function(e) {
      start = e.originalEvent.changedTouches[0].pageY;
      end = e.originalEvent.changedTouches[0].pageY;
    });
    this.$menuReact.on('touchmove.menuscroll', function(e) {
      end = e.originalEvent.changedTouches[0].pageY;
      var itemPosY = myself.$lastMenuItem.position().top + myself.$lastMenuItem.height();

      if(myself.$menuReact.height() >= itemPosY) {
        if(end - start < 0) {
          e.preventDefault();
        } else {
          e.stopPropagation();
        }
      } else {
        e.stopPropagation();
      }
    });
  },
  scrollEvent: function() {
    if(!VICTOR.UA.isSP()) return;
    var scrollTop = this.$window.scrollTop();
    this.toggleHeader(scrollTop);
  },
  resizeEvent: function() {
    if(!VICTOR.UA.isSP()) return;
    var scrollTop = this.$window.scrollTop();
    this.toggleHeader(scrollTop);
  },
  toggleHeader: function(scrollTop) {
    var myself = this;
    if(scrollTop < this.CONSTS.HEIGHT) {
      if(myself.scrollFlag) return;
      myself.scrollFlag = true;
      setTimeout(function() {
        myself.$header.addClass(myself.CLASS.IS_ACTIVE);
        myself.scrollFlag = false;
      }, myself.CONSTS.HEADER_SHOW_DELAY)
    } else if (this.scrollTop >= scrollTop) {
        if(myself.scrollFlag) return;
        myself.scrollFlag = true;
        setTimeout(function(){
          myself.$header.addClass(myself.CLASS.IS_ACTIVE);
          myself.scrollFlag = false;
        }, myself.CONSTS.HEADER_SHOW_DELAY);
    } else {
      if(!this.$searchTrigger.hasClass(this.CLASS.IS_ACTIVE) && !this.$menuTrigger.hasClass(this.CLASS.IS_ACTIVE)) {
        if(myself.scrollFlag) return;
        if(scrollTop < myself.CONSTS.HEADER_HIDE_PIXEL) return;
        myself.scrollFlag = true;
          myself.$header.removeClass(myself.CLASS.IS_ACTIVE);
          if(myself.$window.scrollTop() < myself.CONSTS.HEIGHT) {
            myself.$header.addClass(myself.CLASS.IS_ACTIVE);
          }
          myself.scrollFlag = false;
      }
    }
    this.scrollTop = scrollTop;
  },
  toggleSearch: function() {
    if(this.$menuReact.hasClass(this.CLASS.IS_ACTIVE)) this.$menuReact.removeClass(this.CLASS.IS_ACTIVE);
    if(this.$menuTrigger.hasClass(this.CLASS.IS_ACTIVE)) this.$menuTrigger.removeClass(this.CLASS.IS_ACTIVE);
    this.$searchReact.toggleClass(this.CLASS.IS_ACTIVE);
    this.$searchTrigger.toggleClass(this.CLASS.IS_ACTIVE);
    this.overlay();
    this.noscroll();
  },
  toggleMenu: function() {
    if(this.$searchReact.hasClass(this.CLASS.IS_ACTIVE)) this.$searchReact.removeClass(this.CLASS.IS_ACTIVE);
    if(this.$searchTrigger.hasClass(this.CLASS.IS_ACTIVE)) this.$searchTrigger.removeClass(this.CLASS.IS_ACTIVE);
    this.$menuReact.toggleClass(this.CLASS.IS_ACTIVE);
    this.$menuTrigger.toggleClass(this.CLASS.IS_ACTIVE);
    if(this.$menuReact.hasClass(this.CLASS.IS_ACTIVE)) {
      this.$menuReact.height(this.$window.outerHeight() - this.$header.height());
    }
    this.overlay();
    this.noscroll();
  },
  overlay: function() {
    if((this.$searchReact.hasClass(this.CLASS.IS_ACTIVE) || this.$menuTrigger.hasClass(this.CLASS.IS_ACTIVE))) {
      this.$overlay.addClass(this.CLASS.IS_ACTIVE);
      this.$htmlBody.addClass(this.CLASS.IS_ACTIVE);
    } else {
      this.$overlay.removeClass(this.CLASS.IS_ACTIVE);
      this.$htmlBody.removeClass(this.CLASS.IS_ACTIVE);
    }
  },
  close: function() {
    this.$searchReact.removeClass(this.CLASS.IS_ACTIVE);
    this.$searchTrigger.removeClass(this.CLASS.IS_ACTIVE);
    this.$menuReact.removeClass(this.CLASS.IS_ACTIVE);
    this.$menuTrigger.removeClass(this.CLASS.IS_ACTIVE);
    this.$overlay.removeClass(this.CLASS.IS_ACTIVE);
    this.$menuReact.scrollTop(0);
    this.noscroll();
  },
  noscroll: function() {
    if(this.$menuReact.hasClass(this.CLASS.IS_ACTIVE) || this.$searchReact.hasClass(this.CLASS.IS_ACTIVE)) {
      this.$window.on('touchmove.noScroll', function(e) {
        e.preventDefault();
      });
    } else {
      this.$window.off('touchmove.noScroll');
    }
  }
};

// ======================================================================================
// ブラーイメージ
// 対象の画像をブラーにするオブジェクト
// ======================================================================================
VICTOR.BLUR_IMAGE = {
  init: function() {
    if(!this.setParams()) return;
    this.prepare();
    this.bindEvents();
  },
  setParams: function() {
    this.$blurImages = $('.jsc-blur-image');
    if(this.$blurImages.length === 0) return false;
    this.$window = $(window);
    this.uidContainer = [];

    return true;
  },
  prepare: function() {
    this.setBlurImage();
  },
  bindEvents: function() {
    this.$window.on('resize', $.proxy(this.resizeImage()));
  },
  resizeImage: function() {

  },
  setBlurImage: function() {
    var blurImageService = new VICTOR.BLUR_IMAGE.CONSTRUCTOR();

    for(var i = 0, len = this.$blurImages.length; i < len; i++) {
      var $img = this.$blurImages.eq(i).find('img');
      if($img.length !== 0) {
        blurImageService.prependBlurImage(this.$blurImages.eq(i).find('img').attr('src'), this.$blurImages.eq(i));
      } else {
        blurImageService.prependBlurImage(this.$blurImages.eq(i).find('span').css('background-image').replace('url("', '').replace('")', ''), this.$blurImages.eq(i));
      }
    }
  },
  checkUid: function(uid) {
    for(var i = 0, len = this.uidContainer.length; i < len; i++) {
      if(this.uidContainer[i].indexOf(uid) > -1) return true;
    }

    return false;
  },
  createUid: function(prefix) {
    var uid = prefix + Math.random();
    return uid;
  }
};

VICTOR.BLUR_IMAGE.CONSTRUCTOR = function() {
  this.init();
  return this;
};

VICTOR.BLUR_IMAGE.CONSTRUCTOR.prototype = {
  CONSTS: {
    BLUR_LEVEL: 5
  },
  init: function () {
    this.setParams();
  },
  setParams: function () {

  },
  prependBlurImage: function (imageSrc, $target) {
    var myself = this;
    var d = new $.Deferred;
    var img = new Image();
    img.onload = function() {
      var bid = VICTOR.BLUR_IMAGE.createUid('bid-');
      var dom = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ' + img.width + ' ' + img.height + '" class="m-blur-image" preserveAspectRatio="none">' +
        '<filter id="' + bid + '"><feGaussianBlur color-interpolation-filters="sRGB" in="SourceGraphic" stdDeviation="' + myself.CONSTS.BLUR_LEVEL + '"></feGaussianBlur></filter>' +
        '<image x="0" y="0" width="' + img.width +  '" height="' + img.height + '" externalResourcesRequired="true" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + imageSrc + '" style="filter:url(#' + bid + ')" preserveAspectRatio="none"></image>' +
        '</svg>';

      $target.prepend($(dom));
      d.resolve(dom);
    };
    img.onerror = function() {
      d.reject()
    };
    img.src = imageSrc;
  },
  createUid: function () {

  }
};


// ======================================================================================
// カルーセル（トップ ファーストビュー）
// 背景画像・サムネイルクリック・youtube動画展開も兼ねたカルーセルオブジェクト
// ======================================================================================
VICTOR.CAROUSEL_HOME_PC = {
  init: function () {
    if (!this.setParams()) return;
    this.instantiate();
  },
  setParams: function () {
    this.$carousels = $('.jsc-carousel-home');
    if (this.$carousels.length === 0) return false;
    return true;
  },
  instantiate: function() {
    for(var i = 0, len = this.$carousels.length; i < len; i++) {
      new VICTOR.CAROUSEL_HOME_PC.CONSTRUCTOR(this.$carousels.eq(i));
    }
  }
};

VICTOR.CAROUSEL_HOME_PC.CONSTRUCTOR = function($carousel) {
  this.$carousel = $carousel;
  this.init();
};

VICTOR.CAROUSEL_HOME_PC.CONSTRUCTOR.prototype = {
  CLASS: {
    IS_ACTIVE: 'is-active',
    IS_TRANSITION: 'is-transition'
  },
  CONSTS: {
    INIT_INDEX: 0,
    INSERT_ITEM: 2,
    INTERVAL_TIME: 5000
  },
  init: function() {
    this.setParams();
    this.prepare();
    this.bindEvents();
  },
  setParams: function() {
    this.$bgContainer = this.$carousel.find('.jsc-ch-bg-container');
    this.$list = this.$carousel.find('.jsc-ch-list');
    this.$items = this.$list.find('li');
    this.$images = this.$items.find('img');
    this.$indicator = this.$carousel.find('.jsc-ch-indicator');
    this.$prevBtn = this.$carousel.find('.jsc-ch-prev-btn');
    this.$nextBtn = this.$carousel.find('.jsc-ch-next-btn');
    this.$loadingLayer = this.$carousel.find('.jsc-loading-layer');
    this.$window = $(window);

    this.isAnimate = false;
    this.isIndex = this.CONSTS.INIT_INDEX;
    this.maxIndex = this.$items.length - 1;
    this.insertItem = this.CONSTS.INSERT_ITEM;

    this.intervalTimer = null;
    this.selectThumbnail = null;
    return true;
  },
  prepare: function() {
    this.setupBgImage();
    this.setupCarousel();
    this.setupIndicator();
    this.setActive(this.CONSTS.INIT_INDEX);
    this.positioningItem(this.isIndex, false);
    this.isAnimate = false;

    this.postExecute();
    this.setIntervalTimer();
  },
  postExecute: function() {
    if(this.$loadingLayer.length != 0) {
      var myself = this;
      setTimeout(function() {
        myself.$loadingLayer.removeClass('is-active');
      }, 2000);
    }
  },
  bindEvents: function() {
    var myself = this;
    this.$items.find('a').on('click', function(e) {
      if(!$(this).attr('data-yt-src')) return;
      e.preventDefault();
      myself.displayMovie($(this));
    });
    this.$prevBtn.on('click', function(e) {
      e.preventDefault();
      myself.clearIntervalTimer();
      if(myself.selectThumbnail != null) myself.destroyMovie();
      myself.moveCarousel(myself.isIndex - 1);
      myself.setIntervalTimer();
    });

    this.$nextBtn.on('click', function(e) {
      e.preventDefault();
      myself.clearIntervalTimer();
      if(myself.selectThumbnail != null) myself.destroyMovie();
      myself.moveCarousel(myself.isIndex + 1);
      myself.setIntervalTimer();
    });

    this.$indicator.find('a').on('click', function(e) {
      e.preventDefault();
      if($(this).parent().hasClass('is-active')) return;
      myself.clearIntervalTimer();
      if(myself.selectThumbnail != null) myself.destroyMovie();
      myself.moveCarousel(myself.$indicator.find('a').index($(this)));
      myself.setIntervalTimer();
    });

    this.$window.on('resize', $.proxy(this.resizeEvent, this));
  },
  setIntervalTimer: function() {
    if(this.intervalTimer != null) return;
    var myself = this;
    this.intervalTimer = setInterval(function() {
      myself.moveCarousel(myself.isIndex + 1);
    }, this.CONSTS.INTERVAL_TIME);
  },
  clearIntervalTimer: function() {
    clearInterval(this.intervalTimer);
    this.intervalTimer = null;
  },
  setupBgImage: function() {
    if(this.$carousel.hasClass('no-bg')) return;
    var blurImageService = new VICTOR.BLUR_IMAGE.CONSTRUCTOR();
    for(var i = 0, len = this.$images.length; i < len; i++) {
      this.$bgContainer.append($('<li class="jsc-bg' + i + '"></li>'));
      blurImageService.prependBlurImage(this.$images.eq(i).attr('src'), this.$bgContainer.find('.jsc-bg' + i));
    }
  },
  setupCarousel: function() {
    for(var i = 0, len = this.insertItem; i < len; i++) {
      var $firstItem = this.$items.eq(i).clone(true);
      var $lastItem = this.$items.eq(this.maxIndex - i).clone(true);
      $firstItem.removeClass(this.CLASS.IS_ACTIVE);
      $lastItem.removeClass(this.CLASS.IS_ACTIVE);
      this.$list.prepend($lastItem);
      this.$list.append($firstItem);
    }
    this.$items = this.$list.find('li');
  },
  setupIndicator: function() {
    var dom = '';
    for(var i = 0, len = this.$images.length; i < len; i++) {
      dom += '<li><a href="javascript: void(0)"></a></li>';
    }
    this.$indicator.append($(dom));
  },
  resizeEvent: function() {
    this.clearIntervalTimer();
    this.positioningItem(this.isIndex, false);
    this.setIntervalTimer();
  },
  setActive: function(activeIndex) {
    if(!this.$carousel.hasClass('no-bg')) {
      var $bgs = this.$bgContainer.find('li');
      $bgs.removeClass(this.CLASS.IS_ACTIVE);
      $bgs.eq(activeIndex).addClass(this.CLASS.IS_ACTIVE);
    }
    var $indicators = this.$indicator.find('li');
    var $items = this.$items;
    $indicators.removeClass(this.CLASS.IS_ACTIVE);
    $indicators.eq(activeIndex).addClass(this.CLASS.IS_ACTIVE);
    $items.removeClass(this.CLASS.IS_ACTIVE);
    $items.eq(activeIndex + this.insertItem).addClass(this.CLASS.IS_ACTIVE);
  },
  moveCarousel: function(nextIndex, callback) {
    if(this.isAnimate) return;
    this.setActive(this.calcIndex(nextIndex));
    this.positioningItem(nextIndex, true, callback);
    this.isIndex = this.calcIndex(nextIndex);
  },
  positioningItem: function(nextIndex, isAnimation, callback) {
    if(isAnimation) this.isAnimate = true;
    var carouselWidth = this.$carousel.outerWidth();
    var itemWidth= this.$list.find('li').eq(0).outerWidth();
    var left = (carouselWidth / 2 - itemWidth / 2) - itemWidth * (nextIndex + this.insertItem);
    if(isAnimation) {
      var myself = this;
      this.$list.addClass(this.CLASS.IS_TRANSITION);
      this.$list.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
        if(e.originalEvent.propertyName.indexOf('transform') < 0) return;
        myself.$list.removeClass(myself.CLASS.IS_TRANSITION);
        if(nextIndex > myself.maxIndex || nextIndex < 0) {
          var left = (carouselWidth / 2 - itemWidth / 2) - itemWidth * (myself.calcIndex(nextIndex) + myself.insertItem);
          myself.$list.css({transform: 'translate3d(' + left + 'px, 0, 0)'});
        }
        myself.isAnimate = false;
        $(this).off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
        if(callback != void(0)) callback();
      });
    }
    this.$list.css({transform: 'translate3d(' + left + 'px, 0, 0)'});
  },
  calcIndex: function(nextIndex) {
    if(nextIndex <= -1) {
      return this.maxIndex + nextIndex + 1;
    } else if(this.maxIndex < nextIndex) {
      return nextIndex - this.maxIndex - 1;
    } else {
      return nextIndex;
    }
  },
  displayMovie: function($target) {
    if(this.selectThumbnail != null) return;
    this.clearIntervalTimer();
    var myself = this;
    var targetIndex = this.$items.find('a').index($target) - this.insertItem;
    this.selectThumbnail = this.$items.eq(this.calcIndex(targetIndex) + this.insertItem).find('a');
    var setMovie = function() {
      setTimeout( function() {
        var videoId = myself.selectThumbnail.attr('data-yt-src');
        if(videoId.indexOf('https://youtu.be/') > -1) videoId = videoId.replace('https://youtu.be/', '');
        if(videoId.indexOf('https://www.youtube.com/watch?v=') > -1) videoId = videoId.replace('https://www.youtube.com/watch?v=', '');
        if(videoId.indexOf('https://www.youtube.com/embed/') > -1) videoId = videoId.replace('https://www.youtube.com/embed/', '');
        if(videoId.indexOf('&autoplay=1') > -1) videoId = videoId.replace('&autoplay=1', '');
        if(videoId.indexOf('?autoplay=1') > -1) videoId = videoId.replace('?autoplay=1', '');
        VICTOR.YT_PLAYER_MANAGER.createYoutubePlayer(myself.selectThumbnail, videoId, {
          ended: function() {
            myself.destroyMovie();
          }
        });
        myself.selectThumbnail.addClass('is-video');
        myself.$list.addClass('is-video');
      }, 0);
    };
    if(this.isIndex != this.calcIndex(targetIndex)) {
      this.moveCarousel(targetIndex, $.proxy(setMovie, this));
    } else {
      setMovie();
    }
  },
  destroyMovie: function() {
    this.selectThumbnail.removeClass('is-video');
    this.$list.removeClass('is-video');
    VICTOR.YT_PLAYER_MANAGER.destroyYtPlayer();
    this.selectThumbnail = null;
    this.setIntervalTimer();
  }
};

// ======================================================================================
// カルーセル（ノーマル）
// 通常のカルーセルオブジェクト
// ======================================================================================
VICTOR.CAROUSEL_NORMAL = {
  init: function() {
    if(!this.setParams()) return;
    this.instantiate();
  },
  setParams: function() {
    this.$carousels = $('.jsc-carousel-normal');
    if(this.$carousels.length === 0) return false;
    return true;
  },
  instantiate: function() {
    for(var i = 0, len = this.$carousels.length; i < len; i++) {
      new VICTOR.CAROUSEL_NORMAL.CONSTRUCTOR(this.$carousels.eq(i));
    }
  }
};

VICTOR.CAROUSEL_NORMAL.CONSTRUCTOR = function($carousel, width) {
  this.$carousel = $carousel;
  this.carouselWidth = width;
  this.init();
};

VICTOR.CAROUSEL_NORMAL.CONSTRUCTOR.prototype = {
  CLASS: {
    IS_ACTIVE: 'is-active',
    IS_TRANSITION: 'is-transition'
  },
  CONSTS: {
    INSERT_ITEM: 2,
    INIT_INDEX: 0,
    FLICK_THRESHOLD: 100,
    INTERVAL_TIME: 3000
  },
  init: function() {
    this.setParams();
    this.prepare();
    this.bindEvents();
  },
  setParams: function() {
    this.$prevBtn = this.$carousel.find('.jsc-cn-prev-btn');
    this.$nextBtn = this.$carousel.find('.jsc-cn-next-btn');
    this.$indicator = this.$carousel.find('.jsc-cn-indicator');
    this.$list = this.$carousel.find('.jsc-cn-list');
    this.$items = this.$list.find('li');
    this.$window = $(window);

    this.itemCount = this.$items.length;
    this.event = {
      click: VICTOR.UA.isTouchDevice() ? 'touchstart' : 'click'
    };

    this.intervalTimer = null;
    this.isAnimate = false;
    this.isFlick = false;
    this.isIndex = this.CONSTS.INIT_INDEX;
    this.maxIndex = this.$items.length - 1;
    this.insertItem = this.CONSTS.INSERT_ITEM;
    this.flickStartPosX = 0;
    this.flickEndPosX = 0;
  },
  prepare: function() {
    this.setupCarousel();
    this.setupIndicator();
    this.setActive(this.CONSTS.INIT_INDEX);
    this.positioningItem(this.isIndex, false);
    this.setIntervalTimer();
  },
  bindEvents: function() {
    var myself = this;
    this.$prevBtn.on(this.event.click, function(e) {
      e.preventDefault();
      myself.clearIntervalTimer();
      myself.$prevBtn.addClass('is-tap');
      setTimeout(function(){
        myself.$prevBtn.removeClass('is-tap');
      }, 250);
      myself.moveCarousel(myself.isIndex - 1, $.proxy(myself.setIntervalTimer, myself));
    });
    this.$nextBtn.on(this.event.click, function(e) {
      e.preventDefault();
      myself.clearIntervalTimer();
      myself.$nextBtn.addClass('is-tap');
      setTimeout(function(){
        myself.$nextBtn.removeClass('is-tap');
      }, 250);
      myself.moveCarousel(myself.isIndex + 1, $.proxy(myself.setIntervalTimer, myself));
    });
    this.$indicator.find('a').on('click', function(e) {
      e.preventDefault();
      myself.clearIntervalTimer();
      myself.moveCarousel(myself.$indicator.find('a').index($(this)), $.proxy(myself.setIntervalTimer, myself));
    });
    this.$list.find('a').on('click', function(e) {
      if($(this).attr('data-yt-src') != void(0)) {
        e.preventDefault();
        window.open('https://www.youtube.com/watch?v=' + $(this).attr('data-yt-src'), '_blank');
      }
    });
    this.$window.on('resize', $.proxy(this.resizeEvent, this));

    if(VICTOR.UA.isTouchDevice()) {
      this.$list.on('touchstart', $.proxy(this.flickStart, this));
      this.$list.on('touchmove', $.proxy(this.flickMove, this));
      this.$list.on('touchend', $.proxy(this.flickEnd, this));
    }
  },
  setupCarousel: function() {
    for(var i = 0, len = this.insertItem; i < len; i++) {
      var $firstItem = this.$items.eq(i).clone(true);
      var $lastItem = this.$items.eq(this.maxIndex - i).clone(true);
      $firstItem.removeClass(this.CLASS.IS_ACTIVE);
      $lastItem.removeClass(this.CLASS.IS_ACTIVE);
      this.$list.prepend($lastItem);
      this.$list.append($firstItem);
    }
    this.$items = this.$list.find('li');

    var itemWidth = this.$list.attr('data-item-width');
    var padWidth = this.$list.attr('data-item-pad');
    if(itemWidth != void(0)) {
      this.$items.width(itemWidth);
    } else if(padWidth != void(0)) {
      this.$items.width((this.carouselWidth || this.$carousel.width()) - padWidth * 2);
    } else {
      this.$items.width(this.carouselWidth || this.$carousel.width());
    }
  },
  setupIndicator: function() {
    var dom = '';
    for(var i = 0, len = this.itemCount; i < len; i++) {
      dom += '<li><a href="javascript: void(0)"></a></li>';
    }
    this.$indicator.append($(dom));
  },
  resizeEvent: function() {
    this.clearIntervalTimer();
    this.carouselWidth = this.$carousel.width();
    var itemWidth = this.$list.attr('data-item-width');
    var padWidth = this.$list.attr('data-item-pad');
    if(itemWidth != void(0)) {
      this.$items.width(itemWidth);
    } else if(padWidth != void(0)) {
      this.$items.width((this.carouselWidth || this.$carousel.width()) - padWidth * 2);
    } else {
      this.$items.width(this.carouselWidth || this.$carousel.width());
    }
    this.positioningItem(this.isIndex, false);
    this.setIntervalTimer();
  },
  setIntervalTimer: function() {
    if(this.intervalTimer != null) return;
    var myself = this;
    this.intervalTimer = setInterval(function() {
      myself.moveCarousel(myself.isIndex + 1);
    }, this.CONSTS.INTERVAL_TIME);
  },
  clearIntervalTimer: function() {
    clearInterval(this.intervalTimer);
    this.intervalTimer = null;
  },
  setActive: function(activeIndex) {
    var $indicators = this.$indicator.find('li');
    var $items = this.$items;
    $indicators.removeClass(this.CLASS.IS_ACTIVE);
    $indicators.eq(activeIndex).addClass(this.CLASS.IS_ACTIVE);
    $items.removeClass(this.CLASS.IS_ACTIVE);
    $items.eq(activeIndex + this.insertItem).addClass(this.CLASS.IS_ACTIVE);
  },
  moveCarousel: function(nextIndex, callback) {
    if(this.isAnimate) return;
    this.setActive(this.calcIndex(nextIndex));
    this.positioningItem(nextIndex, true, callback);
    this.isIndex = this.calcIndex(nextIndex);
  },
  positioningItem: function(nextIndex, isAnimation, callback) {
    if(isAnimation) this.isAnimate = true;
    var carouselWidth = this.carouselWidth || this.$carousel.outerWidth();
    var itemWidth= this.$list.find('li').eq(0).outerWidth();
    var left = (carouselWidth / 2 - itemWidth / 2) - itemWidth * (nextIndex + this.insertItem);
    if(isAnimation) {
      var myself = this;
      this.$list.addClass(this.CLASS.IS_TRANSITION);
      this.$list.on('webkitTransitionEnd mozTransitionEnd transitionend', function(e) {
        if(e.originalEvent.propertyName.indexOf('transform') < 0) return;
        myself.$list.removeClass(myself.CLASS.IS_TRANSITION);
        if(nextIndex > myself.maxIndex || nextIndex < 0) {
          var left = (carouselWidth / 2 - itemWidth / 2) - itemWidth * (myself.calcIndex(nextIndex) + myself.insertItem);
          myself.$list.css({transform: 'translate(' + left + 'px,0)'});
        }
        myself.isAnimate = false;
        $(this).off('webkitTransitionEnd mozTransitionEnd transitionend');
        if(callback) callback();
      });
    }

    this.$list.css({transform: 'translate(' + left + 'px,0)'});
    if(!isAnimation && callback != void(0)) callback();
  },
  calcIndex: function(nextIndex) {
    if(nextIndex <= -1) {
      return this.maxIndex + nextIndex + 1;
    } else if(this.maxIndex < nextIndex) {
      return nextIndex - this.maxIndex - 1;
    } else {
      return nextIndex;
    }
  },
  flickStart: function(e) {
    if(this.isFlick || this.isAnimate) {
      if(this.isAnimate) e.preventDefault();
      return;
    }
    this.isFlick = true;
    this.clearIntervalTimer();
    this.flickStartPosX = e.originalEvent.changedTouches[0].pageX;
    this.flickStartPosY = e.originalEvent.changedTouches[0].pageY;
    this.flickEndPosX = e.originalEvent.changedTouches[0].pageX;
    var carouselWidth = this.$carousel.outerWidth();
    var itemWidth= this.$list.find('li').eq(0).outerWidth();
    this.flickPositionX = (carouselWidth / 2 - itemWidth / 2) - itemWidth * (this.isIndex + this.insertItem);
  },
  flickMove: function(e) {
    if(!this.isFlick || this.isAnimate) {
      if(this.isAnimate) e.preventDefault();
      return;
    }

    var moveRate =  Math.abs((this.flickStartPosX - e.changedTouches[0].pageX) / (this.flickStartPosY - e.changedTouches[0].pageY));
    if(moveRate > Math.tan(15 * Math.PI/180)) {
      e.preventDefault();
    }

    this.flickEndPosX = e.originalEvent.changedTouches[0].pageX;
    this.$list.css({transform: 'translate(' + Math.round(this.flickPositionX + (this.flickEndPosX - this.flickStartPosX)) + 'px, 0)'});
  },
  flickEnd: function() {
    if(!this.isFlick) return;
    if(Math.abs(this.flickEndPosX - this.flickStartPosX) > this.CONSTS.FLICK_THRESHOLD) {
      var direction = this.flickEndPosX - this.flickStartPosX > 0 ? 1 : -1;
      this.moveCarousel(this.isIndex - direction, $.proxy(this.resetFlick, this));
    } else if(Math.abs(this.flickEndPosX - this.flickStartPosX) <= 10) {
      this.resetFlick();
    }else {
      this.moveCarousel(this.isIndex, $.proxy(this.resetFlick, this));
    }
  },
  resetFlick: function() {
    this.setIntervalTimer();
    this.flickStartPosX = 0;
    this.flickEndPosX = 0;
    this.flickPositionX = 0;
    this.isFlick = false;
  }
};


VICTOR.CAROUSEL_SP = {
  init: function() {
    if(!this.setParams()) return;
    this.instantiate();
  },
  setParams: function() {
    this.$carousels = $('.jsc-carousel-sp');
    if(this.$carousels.length === 0) return false;
    return true;
  },
  instantiate: function() {
    for(var i = 0, len = this.$carousels.length; i < len; i++) {
      new VICTOR.CAROUSEL_SP.CONSTRUCTOR(this.$carousels.eq(i));
    }
  }
};

VICTOR.CAROUSEL_SP.CONSTRUCTOR = function($carousel) {
  this.$carousel = $carousel;
  this.init();
};

VICTOR.CAROUSEL_SP.CONSTRUCTOR.prototype = {
  CLASS: {
    IS_ACTIVE: 'is-active',
    IS_TRANSITION: 'is-transition'
  },
  CONSTS: {
    INSERT_ITEM: 2,
    INIT_INDEX: 0,
    FLICK_THRESHOLD: 100,
    INTERVAL_TIME: 3000
  },
  init: function() {
    this.setParams();
    this.prepare();
    this.$window.on('resize', $.proxy(this.resizeEvent, this));
  },
  setParams: function() {
    this.$prevBtn = this.$carousel.find('.jsc-cn-prev-btn');
    this.$nextBtn = this.$carousel.find('.jsc-cn-next-btn');
    this.$indicator = this.$carousel.find('.jsc-cn-indicator');
    this.$list = this.$carousel.find('.jsc-cn-list');
    this.$items = this.$list.find('li');
    this.$window = $(window);

    this.itemCount = this.$items.length;
    this.event = {
      click: VICTOR.UA.isTouchDevice() ? 'touchstart' : 'click'
    };

    this.intervalTimer = null;
    this.isAnimate = false;
    this.isFlick = false;
    this.maxIndex = this.$items.length - 1;
    this.insertItem = this.CONSTS.INSERT_ITEM;
    this.flickStartPosX = 0;
    this.flickEndPosX = 0;
    this.isSP = VICTOR.UA.isSP();
  },
  prepare: function() {
    if(!this.isSP) return;
    this.isIndex = this.CONSTS.INIT_INDEX;
    this.setupCarousel();
    this.setupIndicator();
    this.setActive(this.CONSTS.INIT_INDEX);
    this.positioningItem(this.isIndex, false);
    this.setIntervalTimer();
    this.bindEvents();
  },
  bindEvents: function() {
    var myself = this;
    this.$prevBtn.on(this.event.click, function(e) {
      e.preventDefault();
      myself.clearIntervalTimer();
      myself.moveCarousel(myself.isIndex - 1, $.proxy(myself.setIntervalTimer, myself));
    });
    this.$nextBtn.on(this.event.click, function(e) {
      e.preventDefault();
      myself.clearIntervalTimer();
      myself.moveCarousel(myself.isIndex + 1, $.proxy(myself.setIntervalTimer, myself));
    });
    this.$indicator.find('a').on('click', function(e) {
      e.preventDefault();
      myself.clearIntervalTimer();
      myself.moveCarousel(myself.$indicator.find('a').index($(this)), $.proxy(myself.setIntervalTimer, myself));
    });

    if(VICTOR.UA.isTouchDevice()) {
      this.$list.on('touchstart', $.proxy(this.flickStart, this));
      this.$list.on('touchmove', $.proxy(this.flickMove, this));
      this.$list.on('touchend', $.proxy(this.flickEnd, this));
    }
  },
  unbindEvents: function() {
    this.$list.off('touchstart');
    this.$list.off('touchmove');
    this.$list.off('touchend');
    this.$prevBtn.off(this.event.click);
    this.$nextBtn.off(this.event.click);
  },
  setupCarousel: function() {
    for(var i = 0, len = this.insertItem; i < len; i++) {
      var $firstItem = this.$items.eq(i).clone(true);
      var $lastItem = this.$items.eq(this.maxIndex - i).clone(true);
      $firstItem.removeClass(this.CLASS.IS_ACTIVE);
      $lastItem.removeClass(this.CLASS.IS_ACTIVE);
      this.$list.prepend($lastItem);
      this.$list.append($firstItem);
    }
    this.$items = this.$list.find('li');

    var itemWidth = this.$carousel.attr('data-item-width');
    var itemPad = this.$carousel.attr('data-item-pad') || 0;
    if(itemWidth != void(0)) {
      this.$items.css({width: itemWidth});
    } else {
      this.$items.width(this.$carousel.width() - itemPad * 2);
    }
  },
  disabledCarousel: function() {
    this.clearIntervalTimer();
    this.unbindEvents();
    for(var i = this.$items.length - 1, len = this.$items.length - 1 - this.insertItem; i > len; i--) this.$items.eq(i).remove();
    for(var i = this.insertItem - 1; len = 0, i >= len; i--) this.$items.eq(i).remove();
    this.$indicator.empty();
    this.$items.attr('style', '');
    this.$list.attr('style', '');
  },
  setupIndicator: function() {
    var dom = '';
    for(var i = 0, len = this.itemCount; i < len; i++) {
      dom += '<li><a href="javascript: void(0)"></a></li>';
    }
    this.$indicator.append($(dom));
  },
  resizeEvent: function() {
    if(this.isChangeBreak()) {
      this.isSP = VICTOR.UA.isSP();
      this.isSP ? this.prepare() : this.disabledCarousel();
    } else if(this.isSP) {
      this.clearIntervalTimer();
      this.$items.width(this.$carousel.width());
      this.positioningItem(this.isIndex, false);
      this.setIntervalTimer();
    }
  },
  isChangeBreak: function() {
    return this.isSP !== VICTOR.UA.isSP();
  },
  setIntervalTimer: function() {
    if(this.intervalTimer != null) return;
    var myself = this;
    this.intervalTimer = setInterval(function() {
      myself.moveCarousel(myself.isIndex + 1);
    }, this.CONSTS.INTERVAL_TIME);
  },
  clearIntervalTimer: function() {
    clearInterval(this.intervalTimer);
    this.intervalTimer = null;
  },
  setActive: function(activeIndex) {
    var $indicators = this.$indicator.find('li');
    var $items = this.$items;
    $indicators.removeClass(this.CLASS.IS_ACTIVE);
    $indicators.eq(activeIndex).addClass(this.CLASS.IS_ACTIVE);
    $items.removeClass(this.CLASS.IS_ACTIVE);
    $items.eq(activeIndex + this.insertItem).addClass(this.CLASS.IS_ACTIVE);
  },
  moveCarousel: function(nextIndex, callback) {
    if(this.isAnimate) return;
    this.setActive(this.calcIndex(nextIndex));
    this.positioningItem(nextIndex, true, callback);
    this.isIndex = this.calcIndex(nextIndex);
  },
  positioningItem: function(nextIndex, isAnimation, callback) {
    if(isAnimation) this.isAnimate = true;
    var carouselWidth = this.$carousel.outerWidth();
    var itemWidth= this.$list.find('li').eq(0).outerWidth();
    var left = (carouselWidth / 2 - itemWidth / 2) - itemWidth * (nextIndex + this.insertItem);
    if(isAnimation) {
      var myself = this;
      this.$list.addClass(this.CLASS.IS_TRANSITION);
      this.$list.on('webkitTransitionEnd mozTransitionEnd transitionend', function(e) {
        if(e.originalEvent.propertyName.indexOf('transform') < 0) return;
        myself.$list.removeClass(myself.CLASS.IS_TRANSITION);
        if(nextIndex > myself.maxIndex || nextIndex < 0) {
          var left = (carouselWidth / 2 - itemWidth / 2) - itemWidth * (myself.calcIndex(nextIndex) + myself.insertItem);
          myself.$list.css({transform: 'translate(' + left + 'px,0)'});
        }
        myself.isAnimate = false;
        $(this).off('webkitTransitionEnd mozTransitionEnd transitionend');
        if(callback) callback();
      });
    }

    this.$list.css({transform: 'translate(' + left + 'px,0)'});
    if(!isAnimation && callback != void(0)) callback();
  },
  calcIndex: function(nextIndex) {
    if(nextIndex <= -1) {
      return this.maxIndex + nextIndex + 1;
    } else if(this.maxIndex < nextIndex) {
      return nextIndex - this.maxIndex - 1;
    } else {
      return nextIndex;
    }
  },
  flickStart: function(e) {
    if(this.isFlick || this.isAnimate) return;
    this.isFlick = true;
    this.clearIntervalTimer();
    this.flickStartPosX = e.originalEvent.changedTouches[0].pageX;
    this.flickStartPosY = e.originalEvent.changedTouches[0].pageY;
    this.flickEndPosX = e.originalEvent.changedTouches[0].pageX;
    var carouselWidth = this.$carousel.outerWidth();
    var itemWidth= this.$list.find('li').eq(0).outerWidth();
    this.flickPositionX = (carouselWidth / 2 - itemWidth / 2) - itemWidth * (this.isIndex + this.insertItem);
  },
  flickMove: function(e) {
    if(!this.isFlick || this.isAnimate) return;

    this.flickEndPosX = e.originalEvent.changedTouches[0].pageX;
    this.$list.css({transform: 'translate(' + Math.round(this.flickPositionX + (this.flickEndPosX - this.flickStartPosX)) + 'px, 0)'});
  },
  flickEnd: function() {
    if(!this.isFlick) return;
    if(Math.abs(this.flickEndPosX - this.flickStartPosX) > this.CONSTS.FLICK_THRESHOLD) {
      var direction = this.flickEndPosX - this.flickStartPosX > 0 ? 1 : -1;
      this.moveCarousel(this.isIndex - direction, $.proxy(this.resetFlick, this));
    } else if(Math.abs(this.flickEndPosX - this.flickStartPosX) <= 10) {
      this.resetFlick();
    }else {
      this.moveCarousel(this.isIndex, $.proxy(this.resetFlick, this));
    }
  },
  resetFlick: function() {
    this.setIntervalTimer();
    this.flickStartPosX = 0;
    this.flickEndPosX = 0;
    this.flickPositionX = 0;
    this.isFlick = false;
  }
};

// ======================================================================================
// カルーセル（ビデオ）（レスポンシブ）
// ビデオのカルーセルオブジェクト
// ======================================================================================
VICTOR.CAROUSEL_VIDEO = {
  init: function() {
    if(!this.setParams()) return;
    this.instantiate();
  },
  setParams: function() {
    this.$carousels = $('.jsc-carousel-video');
    if(this.$carousels.length === 0) return false;
    return true;
  },
  instantiate: function() {
    for(var i = 0, len = this.$carousels.length; i < len; i++) {
      new VICTOR.CAROUSEL_VIDEO.CONSTRUCTOR(this.$carousels.eq(i));
    }
  }
};

VICTOR.CAROUSEL_VIDEO.CONSTRUCTOR = function($carousel) {
  this.$carousel = $carousel;
  this.init();
};

VICTOR.CAROUSEL_VIDEO.CONSTRUCTOR.prototype = {
  CLASS: {
    IS_ACTIVE: 'is-active',
    IS_TRANSITION: 'is-transition'
  },
  CONSTS: {
    INSERT_ITEM: 2,
    INIT_INDEX: 0,
    FLICK_THRESHOLD: 100,
    INTERVAL_TIME: 3000,
    SHOWING: {
      pc: 2,
      sp: 1
    }
  },
  init: function() {
    this.setParams();
    this.prepare();
    this.bindEvents();
  },
  setParams: function() {
    this.$prevBtn = this.$carousel.find('.jsc-cv-prev-btn');
    this.$nextBtn = this.$carousel.find('.jsc-cv-next-btn');
    this.$indicator = this.$carousel.find('.jsc-cv-indicator');
    this.$list = this.$carousel.find('.jsc-cv-list');
    this.$items = this.$list.find('li');
    this.$window = $(window);

    this.event = {
      click: VICTOR.UA.isTouchDevice() ? 'touchstart' : 'click'
    };

    this.isAnimate = false;
    this.isFlick = false;
    this.isIndex = this.CONSTS.INIT_INDEX;
    this.maxIndex = this.$items.length - 1;
    this.itemLength = this.$items.length;
    this.insertItem = this.CONSTS.INSERT_ITEM;
    this.flickStartPosX = 0;
    this.flickEndPosX = 0;
  },
  prepare: function() {
    this.setupCarousel();
    this.setupIndicator();
    this.setActive(this.CONSTS.INIT_INDEX);
    this.positioningItem(this.isIndex, false);
  },
  bindEvents: function() {
    var myself = this;
    this.$prevBtn.on(this.event.click, function(e) {
      e.preventDefault();
      myself.moveCarousel(myself.isIndex - 1);
    });
    this.$nextBtn.on(this.event.click, function(e) {
      e.preventDefault();
      myself.moveCarousel(myself.isIndex + 1);
    });
    this.$indicator.find('a').on('click', function(e) {
      e.preventDefault();
      myself.moveCarousel(myself.$indicator.find('a').index($(this)));
    });
    this.$window.on('resize', $.proxy(this.resizeEvent, this));

    if(VICTOR.UA.isTouchDevice() && !VICTOR.UA.isTAB()) {
      this.$carousel.on('touchstart', $.proxy(this.flickStart, this));
      this.$carousel.on('touchmove', $.proxy(this.flickMove, this));
      this.$carousel.on('touchend', $.proxy(this.flickEnd, this));
    }
  },
  setupCarousel: function() {
    for(var i = 0, len = this.insertItem; i < len; i++) {
      var $firstItem = this.$items.eq(i).clone(true);
      var $lastItem = this.$items.eq(this.maxIndex - i).clone(true);
      $firstItem.removeClass(this.CLASS.IS_ACTIVE);
      $lastItem.removeClass(this.CLASS.IS_ACTIVE);
      this.$list.prepend($lastItem);
      this.$list.append($firstItem);
    }
    this.$items = this.$list.find('li');
    var itemWidth = this.$list.attr('data-item-width');
    if(itemWidth != void(0)) {
      this.$items.width(itemWidth);
    } else {
      this.$items.width(VICTOR.UA.isSP() ? this.$carousel.width() / this.CONSTS.SHOWING.sp : this.$carousel.width() / this.CONSTS.SHOWING.pc);
    }
  },
  setupIndicator: function() {
    var dom = '';
    var len = this.itemLength;
    for(var i = 0; i < len; i++) {
      dom += '<li><a href="javascript: void(0);"></a></li>';
    }
    this.$indicator.append($(dom));
  },
  resizeEvent: function() {
    var itemWidth = this.$list.attr('data-item-width');
    if(itemWidth != void(0)) {
      this.$items.width(itemWidth);
    } else {
      this.$items.width(VICTOR.UA.isSP() ? this.$carousel.width() / this.CONSTS.SHOWING.sp : this.$carousel.width() / this.CONSTS.SHOWING.pc);
    }
    this.positioningItem(this.isIndex, false);
  },
  setActive: function(activeIndex) {
    var $indicators = this.$indicator.find('li');
    var $items = this.$items;
    $indicators.removeClass(this.CLASS.IS_ACTIVE);
    $indicators.eq(activeIndex).addClass(this.CLASS.IS_ACTIVE);
    $items.removeClass(this.CLASS.IS_ACTIVE);
    $items.eq(activeIndex + this.insertItem).addClass(this.CLASS.IS_ACTIVE);
  },
  moveCarousel: function(nextIndex, callback) {
    if(this.isAnimate) return;
    this.setActive(this.calcIndex(nextIndex));
    this.positioningItem(nextIndex, true, callback);
    this.isIndex = this.calcIndex(nextIndex);
  },
  positioningItem: function(nextIndex, isAnimation, callback) {
    if(isAnimation) this.isAnimate = true;
    var itemWidth= this.$list.find('li').eq(0).outerWidth();
    var left = - itemWidth * (nextIndex + this.insertItem);
    if(isAnimation) {
      var myself = this;
      this.$list.addClass(this.CLASS.IS_TRANSITION);
      this.$list.on('webkitTransitionEnd MozTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd transitionEnd transitionend', function(e) {
        if(e.originalEvent.propertyName.indexOf('transform') < 0) return;
        myself.$list.removeClass(myself.CLASS.IS_TRANSITION);
        if(nextIndex > myself.maxIndex || nextIndex < 0) {
          var left = - itemWidth * (myself.calcIndex(nextIndex) + myself.insertItem);
          myself.$list.css({transform: 'translate(' + left + 'px,0)'});
        }
        myself.isAnimate = false;
        $(this).off('webkitTransitionEnd MozTransitionEnd mozTransitionEnd msTransitionEnd oTransitionEnd transitionEnd transitionend');
        if(callback) callback();
      });
    }

    this.$list.css({transform: 'translate(' + left + 'px,0)'});
    if(!isAnimation && callback != void(0)) callback();
  },
  calcIndex: function(nextIndex) {
    if(nextIndex <= -1) {
      return this.maxIndex + nextIndex + 1;
    } else if(this.maxIndex < nextIndex) {
      return nextIndex - this.maxIndex - 1;
    } else {
      return nextIndex;
    }
  },
  flickStart: function(e) {
    if(this.isFlick || this.isAnimate) return;
    this.isFlick = true;
    this.flickStartPosX = e.originalEvent.changedTouches[0].pageX;
    this.flickEndPosX = e.originalEvent.changedTouches[0].pageX;
    var carouselWidth = this.$carousel.outerWidth();
    var itemWidth= this.$list.find('li').eq(0).outerWidth();
    this.flickPositionX = (carouselWidth / 2 - itemWidth / 2) - itemWidth * (this.isIndex + this.insertItem);
  },
  flickMove: function(e) {
    if(!this.isFlick || this.isAnimate) return;
    this.flickEndPosX = e.originalEvent.changedTouches[0].pageX;
    this.$list.css({transform: 'translate(' + Math.round(this.flickPositionX + (this.flickEndPosX - this.flickStartPosX)) + 'px, 0)'});
  },
  flickEnd: function() {
    if(!this.isFlick) return;
    if(Math.abs(this.flickEndPosX - this.flickStartPosX) > this.CONSTS.FLICK_THRESHOLD) {
      var direction = this.flickEndPosX - this.flickStartPosX > 0 ? 1 : -1;
      if(VICTOR.UA.isTAB()) direction * this.CONSTS.SHOWING.pc;
      this.moveCarousel(this.isIndex - direction, $.proxy(this.resetFlick, this));
    } else if(Math.abs(this.flickEndPosX - this.flickStartPosX) <= 10) {
      this.resetFlick();
    }else {
      this.moveCarousel(this.isIndex, $.proxy(this.resetFlick, this));
    }
  },
  resetFlick: function() {
    this.flickStartPosX = 0;
    this.flickEndPosX = 0;
    this.flickPositionX = 0;
    this.isFlick = false;
  }
};

// ======================================================================================
// アコーディオン
// FAQページ
// ======================================================================================
VICTOR.ACCORDION = {
  ANIMATION_SPEED: 250,
  ACTIVE_CLASS: 'is-active',

  init: function() {
    if(!this.setParams()) return;
    this.bindEvents();
  },
  setParams: function() {
    this.$triggers = $('.jsc-accordion dt');
    if(this.$triggers.length === 0) return false;

    return true;
  },
  bindEvents: function() {
    var myself = this;
    var str = location.href;
    var str = str.substr(str.indexOf('faq'), 5);

    this.$triggers.each(function(index) {
      var idStr = str + '-' + (index + 1);
      $(this).attr('id', idStr);
      if(sessionStorage.getItem(idStr)) myself.toggleAccordion($(this), 0);

      $(this).on('click', function() {
        myself.toggleAccordion($(this), myself.ANIMATION_SPEED);
      });
    });
  },
  toggleAccordion: function($trigger, animationSpeed) {
    if($trigger.next().css('display') == 'none') {
      $trigger.addClass(this.ACTIVE_CLASS);
      $trigger.next().slideDown(animationSpeed);
      sessionStorage.setItem($trigger.attr('id'), 'open');
    } else {
      $trigger.removeClass(this.ACTIVE_CLASS);
      $trigger.next().slideUp(animationSpeed);
      sessionStorage.removeItem($trigger.attr('id'));
    }
  },
};

// ======================================================================================
// モーダル
// 動画視聴などの際に表示するモーダルオブジェクト
// ======================================================================================
VICTOR.MODAL = {
  CONSTS: {
    ANIMATION_SPEED: 500
  },
  init: function() {
    if(!this.setParams()) return;
    this.bindEvents();
  },
  setParams: function() {
    this.$modalTrigger = $('.jsc-modal-trigger');
    this.$modal = $('.jsc-modal-react');
    if(this.$modal.length === 0 || this.$modalTrigger.length === 0) return false;
    this.$modalContent = this.$modal.find('.jsc-modal-content');
    this.$modalCloseBtn = $('.jsc-modal-close');

    return true;
  },
  bindEvents: function() {
    var myself = this;
    this.$modalTrigger.on('click', function(e) {
      e.preventDefault();
      myself.openModal($(this).attr('data-target-contents'));
    });

    this.$modalCloseBtn.on('click', function(e) {
      myself.closeModal();
    });
  },
  openModal: function(target) {
    var $content = $('[data-modal-content="' + target + '"]').clone(true);
    $content.removeClass('is-template');
    this.$modalContent.append($content);
    this.$modal.fadeIn(this.CONSTS.ANIMATION_SPEED);
  },
  closeModal: function() {
    var myself = this;
    this.$modal.fadeOut(this.CONSTS.ANIMATION_SPEED, function() {
      myself.$modalContent.empty();
    });
  }
};

// ======================================================================================
// モーダル
// 試聴モーダル
// ======================================================================================
VICTOR.MODAL_LISTNING = {
  CONSTS: {
    ANIMATION_SPEED: 500
  },
  init: function() {
    if(!this.setParams()) return;
    this.bindEvents();
  },
  setParams: function() {
    this.$modal = $('.jsc-modal-listening');
    if($(window).width() <= VICTOR.UA.CONSTS.BREAK_POINT) {
      this.$modal.remove();
      return false;
    }
    if(this.$modal.length === 0) return false;
    this.$modalContent = this.$modal.find('.jsc-modal-content');
    this.$modalCloseBtn = $('.jsc-modal-close');

    return true;
  },
  bindEvents: function() {
    var myself = this;
    this.$modalCloseBtn.on('click', function(e) {
      myself.closeModal();
    });
  },
  closeModal: function() {
    var myself = this;
    this.$modal.fadeOut(this.CONSTS.ANIMATION_SPEED, function() {
      myself.$modalContent.empty();
    });
  }
};

// ======================================================================================
// モーダルiframe
// 動画視聴などの際に表示するモーダルオブジェクト
// ======================================================================================
VICTOR.MODAL_IFRAME = {
  init: function() {
    if(!this.setParams()) return;
    this.setModal();
  },
  setParams: function() {
    this.$modal = $('.jsc-modal-iframe-trigger');
    if(this.$modal.length === 0) return false;
    this.$modalCloseBtn = $('.jsc-modal-iframe-close');
    return true;
  },
  setModal: function() {
    this.$modal.each(function() {
      new VICTOR.MODAL_IFRAME_CONSTRUCTOR($(this));
    });
  }
};


// ======================================================================================
// モーダル
// 動画視聴などの際に表示するモーダルオブジェクト
// ======================================================================================
VICTOR.MODAL_IFRAME_CONSTRUCTOR = function($trigger) {
  this.$modalTrigger = $trigger;
  this.init();
};

VICTOR.MODAL_IFRAME_CONSTRUCTOR.prototype = {
  CONSTS: {
    ANIMATION_SPEED: 500
  },
  init: function() {
    if(!this.setParams()) return;
    this.bindEvents();
  },
  setParams: function() {
    this.$modal = $('.jsc-modal-iframe-react');
    if(this.$modal.length === 0) return false;
    this.$modalCloseBtn = $('.jsc-modal-iframe-close');
    this.$modalContent = $('.jsc-modal-height');
    return true;
  },
  bindEvents: function() {
    var myself = this;
    this.$modalTrigger.on('click', function(e) {
      e.preventDefault();
      var href = $(this).attr('href');
      if(href != void(0) && href.indexOf('javascript') < 0) {
        location.href = href;
      } else {
        myself.openModal($(this).attr('data-href'));
      }
    });

    this.$modalCloseBtn.off('click');
    this.$modalCloseBtn.on('click', function(e) {
      myself.closeModal();
    });
  },
  openModal: function(href) {
    var myself = this;
    this.$modalContent.height(0);
    this.$modal.find('iframe').on("load", function () {
        var body = this.contentWindow.document.documentElement || this.contentWindow.document.body.parentNode || this.contentWindow.document.body;
        $(this).height(0).show().height(body.scrollHeight);
        myself.$modalContent.height(body.scrollHeight);
    }).attr("src", href);
    this.$modal.fadeIn(this.CONSTS.ANIMATION_SPEED);
  },
  closeModal: function() {
    var myself = this;
    this.$modal.fadeOut(this.CONSTS.ANIMATION_SPEED, function() {
      // myself.$modal.find('iframe').attr('src', '');
    });
  }
};

// ======================================================================================
// モーダルimage
// 画像をクリックした際に表示するモーダルオブジェクト
// ======================================================================================
VICTOR.MODAL_IMAGE = {
  init: function() {
    this.delegate();
    if(!this.setParams()) return;
    this.setModal();
  },
  delegate: function() {
    $('.l-content-page').find('a').css('-webkit-tap-highlight-color', 'initial');
    //modalのclass属性を見つけたら、Click時にイベントを仕込んでモーダル表示
    $('.l-content-page').on('click', '.jsc-modal-image-trigger', function(e) {
      e.preventDefault();
      if(VICTOR.UA.isSP()) return;
      new VICTOR.MODAL_IMAGE_CONSTRUCTOR($(this)).openModal($(this).find('img').attr('src'));
      $('.jsc-modal-image-trigger').off();
    });
  },
  setParams: function() {
    this.$modal = $('.jsc-modal-image-trigger');
    if(this.$modal.length === 0) return false;
    this.$modalCloseBtn = $('.jsc-modal-image-close');
    return true;
  },
  setModal: function() {
    this.$modal.each(function() {
      new VICTOR.MODAL_IMAGE_CONSTRUCTOR($(this));
    });
  }
};

// ======================================================================================
// モーダルhome 初回表示
// 初回表示時のみ表示されるモーダル
// ======================================================================================
VICTOR.MODAL_HOME = {
  CONSTS: {
    ANIMATION_SPEED: 500
  },
  init: function() {
    if(!this.setParams()) return;
    this.setModal();
    this.bindEvents();
  },
  setParams: function() {
    this.$modal = $('.jsc-modal-home');
    if(this.$modal.length === 0) return false;
    this.$modalCloseBtn = $('.jsc-modal-home-close');
    return true;
  },
  setModal: function() {
    if(sessionStorage.getItem('firstAccess')) return;
    sessionStorage.setItem('firstAccess', true);
    this.$modal.fadeIn(this.CONSTS.ANIMATION_SPEED);
  },
  bindEvents: function() {
    var myself = this;
    this.$modalCloseBtn.on('click', function(){
      myself.$modal.fadeOut(myself.CONSTS.ANIMATION_SPEED);
    })
  }
};

// ======================================================================================
// モーダル画像 コンストラクタ
// 動画視聴などの際に表示するモーダルオブジェクト
// ======================================================================================
VICTOR.MODAL_IMAGE_CONSTRUCTOR = function($trigger) {
  this.$modalTrigger = $trigger;
  this.init();
};

VICTOR.MODAL_IMAGE_CONSTRUCTOR.prototype = {
  CONSTS: {
    ANIMATION_SPEED: 500
  },
  init: function() {
    if(!this.setParams()) return;
    this.bindEvents();
  },
  setParams: function() {
    this.$modal = $('.jsc-modal-image-react');
    if(this.$modal.length === 0) return false;
    this.$modalCloseBtn = $('.jsc-modal-image-close');
    this.$modalContent = $('.jsc-modal-height');
    return true;
  },
  bindEvents: function() {
    var myself = this;
//    this.$modalTrigger.on('click', function(e) {
//      e.preventDefault();
//      if(VICTOR.UA.isSP()) return;
//      myself.openModal($(this).find('img').attr('src'));
//    });
//
    this.$modalCloseBtn.off('click');
    this.$modalCloseBtn.on('click', function(e) {
      myself.closeModal();
    });
  },
  openModal: function(src) {
    var myself = this;
    this.$modal.find('.jsc-modal-content').append($('<img src="' + src + '">'));
    this.$modal.fadeIn(this.CONSTS.ANIMATION_SPEED);
  },
  closeModal: function() {
    var myself = this;
    this.$modal.fadeOut(this.CONSTS.ANIMATION_SPEED, function() {
      myself.$modal.find('.jsc-modal-content').empty();
    });
  }
};

// ======================================================================================
// モーダル（youtube用）
// 動画視聴などの際に表示するモーダルオブジェクト
// ======================================================================================
VICTOR.MODAL_YT = {
  CONSTS: {
    ANIMATION_SPEED: 500
  },
  init: function() {
    if(!this.setParams()) return;
    this.bindEvents();
  },
  setParams: function() {
    this.$modalTrigger = $('.jsc-modal-yt-trigger');
    this.$modal = $('.jsc-modal-yt-react');
    if(this.$modal.length === 0) return false;

    this.$iframe = this.$modal.find('iframe');
    this.$modalCloseBtn = $('.jsc-modal-yt-close');

    this.isAnimate = false;
    return true;
  },
  bindEvents: function() {
    var myself = this;
    if(this.$modalTrigger.length != 0) {
      this.$modalTrigger.on('click', function(e) {
        e.preventDefault();
        if(myself.isAnimate) return;
        myself.isAnimate = true;
        myself.openModal($(this).attr('data-yt-src'));
      });
    }

    this.$modalCloseBtn.on('click', function() {
      myself.closeModal();
    });
  },
  openModal: function(src) {
    if(VICTOR.UA.isSP()) {
      window.open(src, '_blank');
      this.isAnimate = false;
    } else {
      if(src.indexOf('https://youtu.be') > -1) src = src.replace('https://youtu.be', 'https://www.youtube.com/embed');
      this.$iframe.attr('src', src);
      this.$modal.fadeIn(this.CONSTS.ANIMATION_SPEED);
    }
  },
  closeModal: function() {
    var myself = this;
    this.$modal.fadeOut(this.CONSTS.ANIMATION_SPEED, function() {
      myself.$iframe.attr('src', '');
      myself.isAnimate = false;
    });
  },
  externalModalTrigger: function($trigger) {
    var myself = this;
    $trigger.on('click', function(e) {
      e.preventDefault();
      if(myself.isAnimate) return;
      myself.isAnimate = true;
      myself.openModal($(this).attr('data-yt-src'));
    });
  }
};

// ======================================================================================
// スムーズスクロール
// ハッシュを用いて該当箇所にリンクでスクロールするオブジェクト
// ======================================================================================
VICTOR.SMOOTH_SCROLL = {
  CONSTS: {
    ANIMATION_SPEED: 500,
  },
  init: function() {
    if(!this.setParams()) return;
    // this.prepare();
    this.setActive();
    this.bindEvents();
  },
  setParams: function() {
    this.$scrollLinks = $('.jsc-smooth-scroll-link').find('a');
    if(this.$scrollLinks.length === 0) return false;
    this.$htmlBody = $('html, body');
    this.currentPath = location.pathname.replace('index.html', '');
    return true;
  },
  setActive: function() {
    if(!location.hash) return;

    var myself = this;
    this.$scrollLinks.each(function(){
      if($(this).attr('href').indexOf(location.hash) != -1) {
        myself.$scrollLinks.parent().removeClass('is-active');
        $(this).parent().addClass('is-active');
      }
    });
  },
  prepare: function() {
    this.smoothScroll(location.pathname);
  },
  bindEvents: function() {
    var myself = this;
    this.$scrollLinks.on('click', function(e) {
      e.preventDefault();
      myself.$scrollLinks.parent().removeClass('is-active');
      $(this).parent().addClass('is-active');
      myself.smoothScroll($(this).attr('href'));
    })
  },
  smoothScroll: function(href) {
    if(href === this.currentPath) return;
    var path = href.split('#')[0];
    if(this.currentPath !== path) {location.href = href; return;}

    var hash = href.split('#')[1];
    var top = $('#' +  hash).offset().top;

    this.$htmlBody.animate({scrollTop: top}, this.CONSTS.ANIMATION_SPEED);
  }
};

VICTOR.SMOOTH_SCROLL_SIMPLE = {
  CONSTS: {
    ANIMATION_SPEED: 500,
  },
  init: function() {
    if(!this.setParams()) return;
    this.bindEvents();
  },
  setParams: function() {
    this.$scrollLinks = $('.jsc-smooth-scroll-link-simple');
    if(this.$scrollLinks.length === 0) return;
    this.$htmlBody = $('html, body');
    return true;
  },
  bindEvents: function() {
    var myself = this;
    this.$scrollLinks.on('click', function(e) {
      e.preventDefault();
      myself.smoothScroll($(this).attr('href'));
    })
  },
  smoothScroll: function(href) {
    var top = $(href).offset().top;
    this.$htmlBody.animate({scrollTop: top}, this.CONSTS.ANIMATION_SPEED);
  }
};

// ======================================================================================
// スクロールトップ
// ページの一番上にスクロールするオブジェクト
// ======================================================================================
VICTOR.SCROLL_TOP = {
  CONSTS: {
    HIDE_OFFSET: 100,
    ANIMATION_SPEED: 500,
  },
  init: function() {
    if(!this.setParams()) return;
    this.prepare();
    this.bindEvents();
  },
  setParams: function() {
    this.$scrollTopButton = $('.jsc-scroll-top');
    this.$parent = this.$scrollTopButton.parent();
    if(this.$scrollTopButton.length === 0) return false;
    this.$scrollTop = this.$scrollTopButton.parent();
    this.$staticPos = $('.jsc-scroll-top-static');
    if(this.$staticPos.length === 0) this.$staticPos = $('.jsc-footer');
    this.$window = $(window);
    this.$htmlBody= $('html, body');
    this.$artistMenu = $('.m-menu-artist');

    this.offset = this.$staticPos.attr('data-offset') || 0;
    return true;
  },
  prepare: function() {
    this.toggleView(this.$window.scrollTop());
  },
  bindEvents: function() {
    this.$scrollTopButton.on('click', $.proxy(this.scrollTop, this));
    this.$window.on('scroll', $.proxy(this.scrollEvent, this));
    this.$window.on('resize', $.proxy(this.scrollEvent, this));
  },
  toggleView: function(scrollTop) {
    if(scrollTop > this.CONSTS.HIDE_OFFSET && !this.$parent.hasClass('is-view')) {
      this.$parent.addClass('is-view');
      this.$parent.fadeIn();
    } else if(scrollTop <= this.CONSTS.HIDE_OFFSET && this.$parent.hasClass('is-view')) {
      this.$parent.removeClass('is-view');
      this.$parent.fadeOut();
    }
  },
  scrollTop: function() {
    this.$htmlBody.animate({scrollTop: 0}, this.CONSTS.ANIMATION_SPEED);
  },
  scrollEvent: function() {
    var scrollTop = this.$window.scrollTop();
    var scrollBottom = scrollTop + this.$window.outerHeight();
    this.toggleView(scrollTop);
    var footerPosY = this.$staticPos.offset().top;

    if(footerPosY != 0 && $('.is-menu-artist').length) {
      footerPosY += this.$artistMenu.innerHeight();
    }

    if(footerPosY != 0 && scrollBottom >= footerPosY) {
      this.$scrollTop.addClass('is-static');
    } else {
      this.$scrollTop.removeClass('is-static');
    }
  }
};

// ======================================================================================
// シェアリンク
// 対象のページまたはdataに記載されているurlページをシェアするオブジェクト
// ======================================================================================
VICTOR.SHARE_LINK = {
  init: function() {
    if(!this.setParams()) return;
    this.instantiate();
  },
  setParams: function() {
    this.$shareLinks = $('.jsc-sns-share-link');
    if(this.$shareLinks.length === 0) return false;
    this.titleText = $("meta[property='og:title']").text().replace(" | ", '｜');
    this.targetURL = location.href;
    this.hash = $('body').attr('data-hash');
    this.pageShares = [];
    return true;
  },
  instantiate: function() {
    for(var i = 0, len = this.$shareLinks.length; i < len; i++) {
      this.pageShares.push(new VICTOR.SHARE_LINK.CONSTRUCTOR(this.$shareLinks.eq(i), this.titleText, this.targetURL, this.hash, this.$shareLinks.eq(i).attr('artistcd')));
    }
  },
  updateShareLink: function() {
    for(var i = 0, len = this.pageShares.length; i < len; i++) {
      this.pageShares[i].updateUrl(location.href);
    }
  }
};

VICTOR.SHARE_LINK.CONSTRUCTOR = function($links, text, targetUrl, hash, artistCd) {
  this.$links = $links;
  this.text = text;
  this.targetUrl = targetUrl;
  this.hash = hash;
  this.artistCd = artistCd;
  this.init();
};

VICTOR.SHARE_LINK.CONSTRUCTOR.prototype = {
  CONSTS: {
    URL: {
      LINE: 'https://line.me/R/msg/text/?',
      TWITTER: ' https://twitter.com/share?',
      FACEBOOK: 'https://www.facebook.com/sharer/sharer.php?u='
    },
    HASH: {
      LINE: '#',
      TWITTER: 'hashtags=',
      FACEBOOK: '&hashtag=%23'
    }
  },
  init: function() {
    this.setParams();
    this.bindEvents();
  },
  setParams: function() {
    if(this.hash) this.hash = this.hash.replace('#', '');
  },
  bindEvents: function() {
    var myself = this;
    this.$links.on('click', function(e) {
      e.preventDefault();
      myself.sharePage($(this));
    });
  },
  sharePage: function($target) {
    var target = $target.attr('data-target');
    if(!this.targetUrl.match(/http/)) {
      this.targetUrl = location.origin + this.targetUrl;
    }

    switch(target) {
      case 'line':
        var hashtext = this.hash ? this.CONSTS.HASH.LINE + this.hash.replace(/\s/g, ' ') : '';
        window.open(this.CONSTS.URL.LINE + encodeURIComponent(hashtext + this.text) + "%0D%0A" + encodeURIComponent(this.targetUrl), 'snsline', 'width=500,height=500');
        break;
      case 'twitter':
        var textWithHash = this.hash ? '#' + this.hash.replace(/\s/g, ' ') + ' ' + this.text : this.text;
        window.open(this.CONSTS.URL.TWITTER + "text=" + encodeURIComponent(textWithHash) + "%0a" + '&url=' + encodeURIComponent(this.targetUrl), 'snstwitter', 'width=500,height=500');
        break;
      case 'facebook':
        var hashtext = this.hash ? this.CONSTS.HASH.FACEBOOK + encodeURIComponent(this.hash) : '';
        window.open(this.CONSTS.URL.FACEBOOK + encodeURIComponent(this.targetUrl) + hashtext, 'snsfacebook', 'width=500,height=500');
        break;
      default:
        break;
    }

  },
  updateUrl: function(url) {
    this.targetUrl = url;
  }
};


// ======================================================================================
// ビデオリスト
// ビデオリストで最新のyoutubeリストを出すオブジェクト
// ======================================================================================
VICTOR.VIDEO_LIST = {
  CLASS: {
    TEMPLATE: 'is-template'
  },
  CONSTS: {
    VIEW_VIDEO_COUNT: 12,
    YOTUBE_URI: 'https://www.googleapis.com/youtube/v3/search',
    YOTUBE_OPTION: {
      hl: 'ja',
      part: 'snippet',
      channelId: 'UC4YT50DP7hbMsor8FmyEPMw',
      key: 'AIzaSyCFCOsZeXBWcu8uk9v_o-YArl-POiTq3XY',
      maxResults: 12,
      type: 'video',
      order: 'date'
    }
  },
  init: function () {
    if (!this.setParams()) return;
    this.prepare();
  },
  setParams: function () {
    this.$list = $('.jsc-list-video');
    if (this.$list.length === 0) return false;
    this.$template = this.$list.find('.jsc-lv-template').clone(true);
    this.$template.removeClass(this.CLASS.TEMPLATE);
    this.$template.removeClass('jsc-lv-template');
    this.$list.find('.jsc-lv-template').remove();
    return true;
  },
  prepare: function () {
    this.fetchYoutubeList($.proxy(this.createList, this));
  },
  fetchYoutubeList: function (successCallback, errorCallback) {
    $.ajax({
      url: this.CONSTS.YOTUBE_URI,
      type: 'GET',
      data: this.CONSTS.YOTUBE_OPTION,
      datatype: 'json',
    }).done(function (data) {
      if(successCallback != void(0)) successCallback(data);
    }).fail(function(error) {
      if(successCallback != void(0)) errorCallback(error);
    });
  },
  createList: function(data) {
    for(var i = 0, len = data.items.length; i < len; i++) {
      var $template = this.$template.clone(true);
      $template.find('[data-yt-src]').attr('data-yt-src', 'https://www.youtube.com/embed/' + data.items[i].id.videoId + '?autoplay=1');
      $template.find('.jsc-video-thumb').attr('src', data.items[i].snippet.thumbnails.medium.url);
      $template.find('.jsc-video-title').text(data.items[i].snippet.title);
      this.$list.append($template);
    }
  }
};


// ======================================================================================
// Brightcove Player Manager
// ページ単位で視聴オブジェクトを総括するオブジェクト
// ======================================================================================
VICTOR.BC_PLAYER_MANAGER = {
  init: function() {
    if(!this.setParams()) return;
    this.prepare();
  },
  setParams: function() {
    this.$players = $('.jsc-bcplayer');
    this.$timelinePlayers = $('.jsc-bcplayer-timeline');
    this.container = [];
    this.bcplayer = new VICTOR.BC_PLAYER();
    return true;
  },
  prepare: function() {
    if(this.$players.length !== 0) this.instantiate();
    if(this.$timelinePlayers.length !== 0) this.instantiateTimeline();
  },
  instantiate: function() {
    for(var i = 0, len = this.$players.length; i < len; i++) {
      var bc = new VICTOR.BC_PLAYER_CONTROLLER(this.$players.eq(i), this);
      if(bc.error == void(0)) this.container.push(bc);
    }
  },
  instantiateTimeline: function() {
    for(var i = 0, len = this.$timelinePlayers.length; i < len; i++) {
      var bc = new VICTOR.BC_PLAYER_TIMELINE_CONTROLLER(this.$timelinePlayers.eq(i), this);
      if(bc.error == void(0)) this.container.push(bc);
    }
  },
  endedOtherPlayer: function() {
    for(var i = 0, len = this.container.length; i < len; i++) {
      this.container[i].ended();
    }
  },
  externalCreatePlayer: function($player) {
    var bc = new VICTOR.BC_PLAYER_CONTROLLER($player, this);
    if(bc.error == void(0)) this.container.push(bc);
  },
  externalCreateTimelinePlayer: function($player) {
    var bc = new VICTOR.BC_PLAYER_TIMELINE_CONTROLLER($player, this);
    if(bc.error == void(0)) this.container.push(bc);
  }
};

VICTOR.BC_PLAYER_CONTROLLER = function($controller, manager) {
  this.$controller = $controller;
  this.manager = manager;
  return this.init() ? this : {error: true};
};

VICTOR.BC_PLAYER_CONTROLLER.prototype = {
  CLASS: {
    IS_PLAY: 'IS_PLAY',
    IS_PAUSE: 'IS_PAUSE'
  },
  init: function() {
    if(!this.setParams()) return false;
    this.prepare();
    this.bindEvents();

    return true;
  },
  setParams: function() {
    this.$playBtn = this.$controller.find('.jsc-bcplayer-button');
    if(this.$playBtn.length === 0) return false;
    this.$playSeek = this.$controller.find('.jsc-bcplayer-seek');
    this.dataId = this.$controller.attr('data-id');
    this.isPlay = false;
    this.initPlay = true;

    return true;
  },
  prepare: function() {
    this.initStrokeDasharray = this.$playSeek.css('stroke-dasharray').split(',')[1].replace('px', '') - 0;
    this.$playSeek.css({strokeDasharray: '0, ' + this.initStrokeDasharray + 'px'});
  },
  bindEvents: function() {
    var myself = this;
    this.$playBtn.on('click', $.proxy(this.togglePlay, this));
  },
  togglePlay: function() {
    if(this.$playBtn.hasClass('is-loading')) return;
    if(this.initPlay) {
      this.manager.endedOtherPlayer();
      this.manager.bcplayer.setPlayer(this.dataId, this.$playBtn);
      this.manager.bcplayer.bcplayer.on('ended', $.proxy(this.ended, this));
      this.initPlay = false;
      this.isPlay = true;
      this.$playBtn.addClass('is-play');
      this.startSeek();
    } else if(this.isPlay) {
      if(!this.manager.bcplayer.isLoaded) return;
      this.manager.bcplayer.bcplayer.pause();
      this.pauseSeek();
      this.isPlay = false;
    } else {
      if(!this.manager.bcplayer.isLoaded) return;
      this.$playBtn.addClass('is-play');
      this.manager.bcplayer.bcplayer.play();
      this.startSeek();
      this.isPlay = true;
    }
  },
  ended: function() {
    if(this.initPlay) return;
    if(this.isPlay) this.manager.bcplayer.bcplayer.pause();
    this.stopSeek();
    this.isPlay = false;
    this.initPlay = true;
  },
  startSeek: function() {
    var myself = this;
    this.manager.bcplayer.bcplayer.on("timeupdate", function() {
      var strokeDasharray = (myself.manager.bcplayer.bcplayer.currentTime() / myself.manager.bcplayer.bcplayer.duration() * myself.initStrokeDasharray);
      myself.$playSeek.css({strokeDasharray: strokeDasharray + 'px, ' + myself.initStrokeDasharray + 'px'});
    });
    this.$playBtn.addClass('is-active');
  },
  pauseSeek: function() {
    this.$playBtn.removeClass('is-play');
  },
  stopSeek: function() {
    this.$playBtn.removeClass('is-active');
    this.$playBtn.removeClass('is-play');
    this.$playBtn.removeClass('is-loading');
    this.$playSeek.css({strokeDasharray: '0, ' + this.initStrokeDasharray + 'px'});
  }
};

VICTOR.BC_PLAYER_TIMELINE_CONTROLLER = function($controller, manager) {
  this.$controller = $controller;
  this.manager = manager;
  return this.init() ? this : {error: true};
};

VICTOR.BC_PLAYER_TIMELINE_CONTROLLER.prototype = {
  CLASS: {
    IS_PLAY: 'IS_PLAY',
    IS_PAUSE: 'IS_PAUSE'
  },
  init: function() {
    if(!this.setParams()) return false;
    this.prepare();
    this.bindEvents();
    if(window === window.parent) {
      if(this.initLoad && this.onlyPC ? !VICTOR.UA.isSP() && !videojs.browser.IS_IOS : true) this.$playBtn.trigger('click');
    } else {
      if(this.initLoad) this.$playBtn.trigger('click');
    }

    return true;
  },
  setParams: function() {
    this.$playBtn = this.$controller.find('.jsc-bcplayer-button');
    if(this.$playBtn.length === 0) return false;
    this.$playSeek = this.$controller.find('.jsc-bcplayer-seek');
    this.$playSeekCurrent = this.$playSeek.find('.jsc-bcplayer-seek-current');
    this.$playSeekControl = this.$playSeek.find('.jsc-bcplayer-seek-control');
    this.$playTime = this.$controller.find('.jsc-bcplayer-time');
    this.$reverseTime = this.$controller.find('.jsc-bcplayer-reverse-time');
    this.$playDuration = this.$controller.find('.jsc-bcplayer-time-duration');
    this.$volumeOff = this.$controller.find('.jsc-bcplayer-volume-off');
    this.$volumeMax = this.$controller.find('.jsc-bcplayer-volume-max');
    this.$volumeSeek = this.$controller.find('.jsc-bcplayer-volume-seek');
    this.$volumeCurrent = this.$controller.find('.jsc-bcplayer-volume-current');
    this.$body = $('body');
    this.dataId = this.$controller.attr('data-id');
    this.initLoad = this.$controller.attr('data-preload') === 'true' || false;
    this.onlyPC = this.$controller.attr('data-only-pc') === 'true' || false;
    this.$endTrigger = this.$controller.attr('data-end-player-trigger') ? $('.' + this.$controller.attr('data-end-player-trigger')) : null;
    this.isPlay = false;
    this.initPlay = true;

    this.intervalTimer = null;

    this.isControllerDraggable = false;

    return true;
  },
  prepare: function() {
    this.$playSeekCurrent.css({width: '0'});
    this.$playTime.text('00:00');
    this.$playDuration.text('00:00');
  },
  bindEvents: function() {
    var myself = this;
    this.$playBtn.on('click', $.proxy(this.togglePlay, this));
    this.$playSeek.on('click', $.proxy(this.clickChangeTime, this));
    this.$reverseTime.on('click', function() {
      myself.setTime(0);
      myself.timeUpdate();
    });
    this.$playSeekControl.on('mousedown', $.proxy(this.startControlTime, this));
    this.$volumeOff.on('click', $.proxy(this.setVolume, this, 0));
    this.$volumeMax.on('click', $.proxy(this.setVolume, this, 1));
    this.$volumeSeek.on('click', $.proxy(this.clickChangeVolume, this));
    this.$volumeCurrent.on('mousedown', $.proxy(this.startControlVolume, this));
    if(this.$endTrigger != null) this.$endTrigger.on('click', $.proxy(this.ended, this));
  },
  togglePlay: function() {
    var myself = this;
    if(!this.initLoad) return;
    if(this.initPlay) {
      this.manager.endedOtherPlayer();
      this.manager.bcplayer.setPlayer(this.dataId, this.$playBtn);
      this.manager.bcplayer.bcplayer.on('ended', $.proxy(this.ended, this));
      this.manager.bcplayer.bcplayer.on('play', function() {
        myself.isPlay = true;
        myself.$playBtn.addClass('is-play');
      });

      this.manager.bcplayer.bcplayer.on('pause', function() {
        myself.isPlay = false;
        myself.$playBtn.removeClass('is-play');
      });
      this.initPlay = false;
      this.startSeek();
    } else if(this.isPlay) {
      if(!this.manager.bcplayer.isLoaded) return;
      this.manager.bcplayer.bcplayer.pause();
      this.pauseSeek();
    } else {
      if(!this.manager.bcplayer.isLoaded) return;
      this.manager.bcplayer.bcplayer.play();
      this.startSeek();
    }
  },
  ended: function() {
    var myself = this;
    if(this.initPlay) return;
    if(this.isPlay) this.manager.bcplayer.bcplayer.pause();
    this.manager.bcplayer.bcplayer.on('loadeddata', function() {
      myself.manager.bcplayer.bcplayer.pause();
    });
    this.stopSeek();
    this.$playTime.text('00:00');
    this.isPlay = false;
  },
  startSeek: function() {
    clearInterval(this.intervalTimer);
    this.intervalTimer = setInterval($.proxy(this.timeUpdate, this), 1000 / 60);
    this.$playBtn.addClass('is-active');

  },
  pauseSeek: function() {
    clearInterval(this.intervalTimer);
    this.$playBtn.removeClass('is-play');
  },
  stopSeek: function() {
    clearInterval(this.intervalTimer);
    this.$playBtn.removeClass('is-active');
    this.$playBtn.removeClass('is-play');
    this.$playBtn.removeClass('is-loading');
    this.$playSeekControl.css({left: '-8px'});
    this.$playSeekCurrent.css({width: '0'});
  },
  calcTime: function(time) {
    var minutes = Math.floor(Math.round(time) / 60);
    var seconds =  time == 0 ? Math.round(time) % 60 - 1 : Math.round(time) % 60;
    if(seconds < 0) seconds = 0;

    minutes = (minutes + '').length > 1 ? minutes : '0' + minutes;
    seconds = (seconds + '').length > 1 ? seconds : '0' + seconds;
    return minutes + ':' + seconds;
  },
  setTime: function(persent) {
    var duration = this.manager.bcplayer.bcplayer.duration();
    this.manager.bcplayer.bcplayer.currentTime(duration * persent);

  },
  timeUpdate: function() {
    var duration = this.manager.bcplayer.bcplayer.duration();
    var currentTime = this.manager.bcplayer.bcplayer.currentTime();
    var controlWidth = this.$playSeekControl.width();
    var seekWidth = (currentTime / duration * 100);
    this.$playSeekCurrent.css({width: seekWidth + '%'});
    this.$playSeekControl.css({left: seekWidth / 100 * this.$playSeek.width() - controlWidth / 2 });
    if(duration != 0) this.$playTime.text(this.calcTime(currentTime));
    if(duration != 0 && !isNaN(duration) && this.$playDuration.text() === '00:00') this.$playDuration.text(this.calcTime(duration));
  },
  clickChangeTime: function(e) {
    e.preventDefault();
    e.stopPropagation();
    if(this.isControllerDraggable) return;
    this.setTime(e.originalEvent.offsetX / this.$playSeek.width());
    this.timeUpdate();
  },
  setVolume: function(persent) {
    if(videojs.browser.IS_IOS) return;
    this.$volumeCurrent.css({left: this.$volumeSeek.width() * persent});
    this.manager.bcplayer.bcplayer.volume(persent);
  },
  clickChangeVolume: function(e) {
    e.preventDefault();
    e.stopPropagation();
    if(videojs.browser.IS_IOS) return;
    if(this.isControllerDraggable) return;
    this.setVolume(e.originalEvent.offsetX / this.$volumeSeek.width());
  },
  startControlTime: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.isControllerDraggable = true;
    this.$body.on('mouseup.controltime', $.proxy(this.endControlTime, this));
    this.$body.on('mousemove.controltime', $.proxy(this.moveControlTime, this));
    clearInterval(this.intervalTimer);
    this.startControlTimePosX = e.originalEvent.pageX;
    this.startControlTimeLeft = parseFloat(this.$playSeekControl.css('left').replace('px', ''));
  },
  moveControlTime: function(e) {
    e.preventDefault();
    e.stopPropagation();
    var diff = e.originalEvent.pageX - this.startControlTimePosX;
    var seekWidth = this.$playSeek.width();
    var controlWidth = this.$playSeekControl.width();

    if(this.startControlTimeLeft + diff < -controlWidth / 2) {
      this.$playSeekControl.css({left: - controlWidth / 2});
      this.$playSeekCurrent.css({width: 0});
    } else if(this.startControlTimeLeft + diff > seekWidth - controlWidth / 2) {
      this.$playSeekControl.css({left: seekWidth - controlWidth / 2});
      this.$playSeekCurrent.css({width: seekWidth});
    } else {
      this.$playSeekControl.css({left: this.startControlTimeLeft + diff});
      this.$playSeekCurrent.css({width: this.startControlTimeLeft + diff});
    }
  },
  endControlTime: function(e) {
    e.preventDefault();
    e.stopPropagation();
    var diff = e.originalEvent.pageX - this.startControlTimePosX;
    this.$body.off('mouseup.controltime');
    this.$body.off('mousemove.controltime');
    clearInterval(this.intervalTimer);

    var seekWidth = this.$playSeek.width();
    var controlWidth = this.$playSeekControl.width();

    if(this.startControlTimeLeft + diff < -controlWidth / 2) {
      this.$playSeekControl.css({left: -controlWidth / 2});
      this.$playSeekCurrent.css({width: 0});
      this.setTime(0);
    } else if(this.startControlTimeLeft + diff > seekWidth - controlWidth / 2) {
      this.$playSeekControl.css({left: seekWidth - controlWidth / 2});
      this.$playSeekCurrent.css({width: seekWidth});
      this.setTime(seekWidth / seekWidth);
    } else {
      this.$playSeekControl.css({left: this.startControlTimeLeft + diff});
      this.$playSeekCurrent.css({width: this.startControlTimeLeft + diff});
      this.setTime((this.startControlTimeLeft + diff) / seekWidth);
    }

    var myself = this;
    setTimeout(function() {
      myself.isControllerDraggable = false;
    }, 0);

    this.intervalTimer = setInterval($.proxy(this.timeUpdate, this), 1000 / 60);
  },
  startControlVolume: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.isControllerDraggable = true;
    this.$body.on('mouseup.controlvolume', $.proxy(this.endControlVolume, this));
    this.$body.on('mousemove.controlvolume', $.proxy(this.moveControlVolume, this));
    this.startControlVolumePosX = e.originalEvent.pageX;
    this.startControlVolumeLeft = (this.$volumeCurrent.css('left').replace('px', '') - 0);
  },
  moveControlVolume: function(e) {
    e.preventDefault();
    e.stopPropagation();
    var diff = e.originalEvent.pageX - this.startControlVolumePosX;
    var seekWidth = this.$volumeSeek.width();
    var controlWidth = this.$volumeCurrent.width();

    if(this.startControlVolumeLeft + diff < controlWidth / 2) {
      this.$volumeCurrent.css({left: -controlWidth / 2});
      this.setVolume(0);
    } else if(this.startControlVolumeLeft + diff > seekWidth - controlWidth / 2) {
      this.$volumeCurrent.css({left: seekWidth - controlWidth / 2});
      this.setVolume(1);
    } else {
      this.$volumeCurrent.css({ left: this.startControlVolumeLeft + diff});
      this.setVolume((this.startControlVolumeLeft + diff) / seekWidth);
    }
  },
  endControlVolume: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.$body.off('mouseup.controlvolume');
    this.$body.off('mousemove.controlvolume');
    var diff = e.originalEvent.pageX - this.startControlVolumePosX;

    var seekWidth = this.$volumeSeek.width();
    var controlWidth = this.$volumeCurrent.width();

    if(this.startControlVolumeLeft + diff < -controlWidth / 2) {
      this.$volumeCurrent.css({left: -controlWidth / 2});
      this.setVolume(0);
    } else if(this.startControlVolumeLeft + diff > seekWidth - controlWidth / 2) {
      this.$volumeCurrent.css({left: seekWidth - controlWidth / 2});
      this.setVolume(1);
    } else {
      this.$volumeCurrent.css({ left: this.startControlVolumeLeft + diff});
      this.setVolume((this.startControlVolumeLeft + diff) / seekWidth);
    }

    var myself = this;
    setTimeout(function() {
      myself.isControllerDraggable = false;
    }, 0);
  }

};

VICTOR.BC_PLAYER = function() {
  this.init();
};

VICTOR.BC_PLAYER.prototype = {
  init: function() {
    this.setParams();
  },
  setParams: function() {
    this.$videoContainer = $('#jsi-bcplayer-video-container');
    this.bcplayer = null;
    this.isPlay = false;
    this.isLoaded = false;
  },
  setPlayer: function(dataId, $btn) {
    var myself = this;

    this.isLoaded = false;
    $btn.addClass('is-loading');

    if(this.bcplayer == null) {
      var video = $('<video id=\"jsi-bcplayer\" data-video-id=\"ref:' + dataId + '\" data-account=\"4802324448001\" data-player=\"uxJxUyVD9\" data-embed=\"default\" class=\"video-js\" webkit-playsinline playsinline autoplay></video>');
      this.$videoContainer.append(video);

      bc('jsi-bcplayer');

      this.bcplayer = videojs('jsi-bcplayer');
      setTimeout(function(){
        myself.bcplayer.play();
      },100);

      this.bcplayer.on('play', function() { myself.isPlay = true; });
      this.bcplayer.on('pause', function() { myself.isPlay = false; });
      this.bcplayer.on('ended', function() { myself.isPlay = false; });
    }

    this.bcplayer.catalog.getVideo('ref:' + dataId, function (error, video) {
      if (video != null) {
        myself.bcplayer.volume(0.5);
        myself.bcplayer.on('loadeddata', function() {
          $btn.removeClass('is-loading');
          myself.bcplayer.play();
        });
        myself.bcplayer.catalog.load(video);
      }
      myself.isLoaded = true;
    });
  },
  play: function() {
    this.bcplayer.play();
  },
  pause: function() {
    this.bcplayer.pause();
  },
  getTimeRaito: function() {
    return this.bcplayer.currentTime() / this.bcplayer.duration() * 100;
  }
};


// ======================================================================================
// youtubeのiframeを制御するオブジェクト
// ======================================================================================
VICTOR.YT_PLAYER_MANAGER = {
  ID: {
    YT_PLAYER: 'jsi-yt-player'
  },
  init: function() {
    if(!this.setParams()) return;
    this.prepare();
  },
  setParams: function() {
    this.script = null;
    this.$playerContainer = $('<div id="jsi-yt-player"></div>');
    if(this.$playerContainer.length === 0) return false;
    return true;
  },
  prepare: function() {
    this.setLibraryScript();
  },
  setLibraryScript: function() {
    if(this.script != null) return;

    $.youtubeReady = function(callback){
      var EVENT_READY = "youtubeready";

      if(window.YT && window.YT.Player){
        return callback();
      }
      $(window).on(EVENT_READY, callback);
      window.onYouTubeIframeAPIReady = function(){
        $(this).trigger(EVENT_READY);
        window.onYouTubeIframeAPIReady = void 0;
      };
      $("<script>", {src: "https://www.youtube.com/iframe_api"}).appendTo("body");
    };
  },
  createYoutubePlayer: function($target, videoId, hundle) {
    var myself = this;
    this.player == null;
    var $alreadyContainer = $('#' + this.ID.YT_PLAYER);
    if($alreadyContainer.length != 0) $alreadyContainer.remove();
    $target.append(this.$playerContainer.clone(false));

    this.player = $.youtubeReady(function() {
      new YT.Player(myself.ID.YT_PLAYER, {
        videoId: videoId,
        width: $target.width(),
        height: $target.height(),
        playerVars: {
          autoplay: 1,
          autohide: 0,
          controls: 1,
          modestbranding: 1
        },
        events: {
          onReady: $.proxy(myself.onPlayerReady, myself),
          onStateChange: function (e) {
            myself.hundleState(e, hundle);
          }
        }
      });
    });
  },
  destroyYtPlayer: function() {
    this.player == null;
    var $alreadyContainer = $('#' + this.ID.YT_PLAYER);
    if($alreadyContainer.length != 0) $alreadyContainer.remove();
  },
  onPlayerReady: function(e) {
  },
  hundleState: function(e, hundle) {
    if(hundle == void(0)) return;

    if(hundle.ended != void(0)) {
      if(e.data === YT.PlayerState.ENDED) {
        hundle.ended();
      }
    }
  }
};

// ======================================================================================
// メニューアーティスト(SPのみ)
// アーティスト配下のメニューのアクティブの項目までスライドさせるオブジェクト
// ======================================================================================
VICTOR.MENU_ARTIST = {
  init: function() {
    if(!this.setParams()) return;
    this.prepare();
  },
  setParams: function() {
    this.$menuArtist = $('.jsc-menu-artist');
    if(this.$menuArtist.length === 0) return false;
    this.$window = $(window);
    return true;
  },
  prepare: function() {
    if(VICTOR.UA.isSP()) this.scrollToActive();
  },
  scrollToActive: function() {
    this.$menuArtist.scrollLeft(this.$menuArtist.find('.is-active').position().left);
  }
};

VICTOR.MENU_SCROLL = {
  init: function() {
    if(!this.setParams()) return;
    this.prepare();
  },
  setParams: function() {
    this.$menu = $('.jsc-menu-scroll');
    if(this.$menu.length === 0) return false;
    this.$window = $(window);
    return true;
  },
  prepare: function() {
    if(VICTOR.UA.isSP()) this.scrollToActive();
  },
  scrollToActive: function() {
    this.$menu.scrollLeft(this.$menu.find('.is-active').position().left);
  }
};


// ======================================================================================
// Facebook page plugin制御
// Facebook page pluginのリサイズを対応させるためのオブジェクト
// ======================================================================================
VICTOR.FACEBOOK_PAGE_RESIZER = {
  CONSTS: {
    TIMEOUT: 500
  },
  init: function() {
    if(!this.setParmas()) return;
    this.prepare();
    this.bindEvents();
  },
  setParmas: function() {
    this.$fbPage = $('.jsc-fb-page');
    if(this.$fbPage.length === 0) return false;
    this.$window = $(window);
    this.nowWidth = 0;
    this.timer = null;
    return true;
  },
  prepare: function() {
    this.iframeTemplate = this.$fbPage.find('iframe').clone(true);
  },
  bindEvents: function() {
    this.$window.on('resize', $.proxy(this.resizeEvent, this));
  },
  resizeEvent: function() {
    var width = this.$fbPage.width();
    if(width == void(0) || this.nowWidth >= 500 || this.nowWidth == width || !window.FB || !window.FB.XFBML) return;
    clearTimeout(this.timer);
    var myself = this;
    this.timer = setTimeout(function() {
      myself.$fbPage.html(myself.$fbPage.html());
      window.FB.XFBML.parse();
    }, this.CONSTS.TIMEOUT);
  }
};


// ======================================================================================
// Data Fetch用 APIリスト
// ======================================================================================
VICTOR.BASE_API = {
  BASE_URL: '/assets/scripts/_data/',
  getApi: function(type, category, subcategory) {
    var api = this.BASE_URL + type + '-' + category + (subcategory ? '-' + subcategory : '') + '.json';
    return api;
  }
};

// ======================================================================================
// FEEDリスト作成オブジェクト
// ======================================================================================
// <div class="jsc-data-feed" data-type="global" data-category="media" data-init-subcategory="all" data-scroll-fetch="true">
//  <ul class="jsc-df-subcategory">
//    <li><a href="javascript: void(0)" data-subcategory="all">all</a></li>
//    <li><a href="javascript: void(0)" data-subcategory="tv">tv</a></li>
//  </ul>
//  <ul class="jsc-df-list" data-view-count="5">
//    <li class="jsc-df-template is-template"></li>
//  </ul>
// </div>
VICTOR.FEED_LIST = {
  init: function() {
    if(!this.setParams()) return;
    this.prepare();
  },
  setParams: function() {
    this.$feeds = $('.jsc-data-feed');
    if(this.$feeds.length === 0) return false;
    return true;
  },
  prepare: function() {
    this.instantiate();
  },
  instantiate: function() {
    for(var i = 0, len = this.$feeds.length; i < len; i++) {
      new VICTOR.FEED_LIST.CONSTRUCTOR(this.$feeds.eq(i));
    }
  }
};

VICTOR.FEED_LIST.CONSTRUCTOR = function($feed) {
  this.$feed = $feed;
  this.init();
};

VICTOR.FEED_LIST.CONSTRUCTOR.prototype = {
  CLASS: {
    IS_ACTIVE: 'is-active'
  },
  CONSTS: {
    VIEW_COUNTS: 5,
    SCROLL_OFFSET: -80,
    DELAY_TIME: 500
  },
  init: function() {
    this.setParams();
    this.prepare();
    this.bindEvents();
  },
  setParams: function() {
    this.$list = this.$feed.find('.jsc-df-list');
    this.$subcategorys = this.$feed.find('.jsc-df-subcategory').find('[data-df-subcategory]');
    this.$timesort = this.$feed.find('.jsc-df-timesort').find('a');
    this.$template = this.$feed.find('.jsc-df-template').clone(true);
    this.$loader = this.$feed.find('.jsc-df-loader');
    this.$body = $('body');

    this.viewCount = this.$list.attr('data-view-count') || this.CONSTS.VIEW_COUNTS;
    this.isViewCount = 0;
    this.type = this.$feed.attr('data-type');
    this.category = this.$feed.attr('data-category');
    this.startDate = this.$timesort.length !== 0 ? this.$timesort.filter('.is-active').attr('data-df-start-date') || null : null;
    this.endDate = this.$timesort.length !== 0 ? this.$timesort.filter('.is-active').attr('data-df-end-date') || null : null;
    if(this.startDate) this.startDate = this.startDate.replace(/\//g, '');
    if(this.endDate) this.endDate = this.endDate.replace(/\//g, '');

    this.isLoading(true);
    this.scrollable = this.$feed.attr('data-scroll-fetch') === 'true';
    this.$window = $(window);
    this.$htmlBody = $('html, body');
    this.ajax = null;
  },
  prepare: function() {
    this.url = this.getJSONUrl();
    if(this.$timesort.length != 0) this.setTimeSort(this.$timesort.filter('.' + this.CLASS.IS_ACTIVE));
    this.getListIdForHash();
    this.setTemplate();
    if(this.$subcategorys.length != 0) {
      this.controlHash();
    } else {
      this.fetchData();
    }
  },
  bindEvents: function() {
    var myself = this;
    if(this.$subcategorys.length != 0) {
      this.$subcategorys.on('click', function() {
        if($(this).get(0).tagName.toLowerCase() === 'span') return;
        if(myself.isRendering) return;
        myself.controlData(true, {subcategory: $(this).attr('data-df-subcategory'), startDate: myself.startDate, endDate: myself.endDate, listId: myself.listId});
      });
    }

    if(this.$timesort.length != 0) {
      this.$timesort.on('click', function() {
        if(myself.isRendering) return;
        myself.changeTimeSort($(this));
        var startDate = $(this).attr('data-df-start-date') ? $(this).attr('data-df-start-date').replace(/\//g, '') : null;
        var endDate = $(this).attr('data-df-end-date') ? $(this).attr('data-df-end-date').replace(/\//g, '') : null;
        myself.controlData(true, {subcategory: myself.subcategory, startDate: startDate, endDate: endDate, listId: myself.listId});
      });
    }

    this.$window.on('popstate', function(e) {
      var state = history.state;
      if(state && state.subcategory) {
        myself.controlData(false, {subcategory: history.state.subcategory, startDate: history.state.startDate, endDate: history.state.endDate, listId: history.state.listId});
      } else {
        myself.controlHash();
      }

    });

    if(this.scrollable) {
      this.$window.on('scroll', $.proxy(this.scrollEvent, this));
    }
  },
  scrollEvent: function() {
    if(this.isRendering || !this.url || this.url == '' || this.ajax != null || !this.$body.hasClass('dn-footer')) return;
    var scrollTop = this.$window.scrollTop();
    var scrollBottom = scrollTop + this.$window.height() - this.CONSTS.SCROLL_OFFSET;
    var offsetBottom = this.$list.offset().top + this.$list.height();

    if(scrollBottom > offsetBottom) {
      this.isLoading(true);
      this.fetchData(false);
    }
  },
  isLoading: function(flag) {
    this.isRendering = flag;
    if(this.$loader.length === 0) return;
    if(flag) {
      this.$loader.addClass('is-loading');
    } else {
      this.$loader.removeClass('is-loading');
    }
  },
  setTemplate: function() {
    $('.jsc-df-template').remove();
    if(this.$template.find('.jsc-df-template').length !== 0) this.$template.find('.jsc-df-template').remove();
    this.$template.removeClass('is-template');
  },
  changeTimeSort: function($target) {
    this.setTimeSort($target);
    this.url = this.getJSONUrl();
    this.$list.empty();
    if($('.jsc-noitem').length !== 0) $('.jsc-noitem').addClass('is-template');
  },
  changeSubcategory: function() {
    this.$subcategorys.removeClass(this.CLASS.IS_ACTIVE);
    $('[data-df-subcategory="' + this.subcategory + '"]').addClass(this.CLASS.IS_ACTIVE);
    this.url = this.getJSONUrl();
    this.$list.empty();
    if($('.jsc-noitem').length !== 0) $('.jsc-noitem').addClass('is-template');
  },
  pushStateSubcategory: function(state, title, url) {
    history.pushState(state, title, url);
    VICTOR.SHARE_LINK.updateShareLink();
  },
  setTimeSort: function($target) {
    this.startDateTime = new Date($target.attr('data-df-start-date')).getTime();
    this.endDateTime = new Date($target.attr('data-df-end-date')).getTime();
    this.$timesort.removeClass(this.CLASS.IS_ACTIVE);
    $target.addClass(this.CLASS.IS_ACTIVE);
  },
  getListIdForHash: function() {
    if(this.enableListId()) {
      this.listId = location.hash.replace('#', '').split('-')[1] || null;
    } else {
      this.listId = null;
    }
  },
  setListId: function(listId) {
    if(this.enableListId()) {
      this.listId = listId;
    } else {
      this.listId = null;
    }
  },
  enableListId: function() {
    return this.type === 'artist' && (this.category === 'tieup' || this.category === 'media' || this.category === 'live');
  },
  getJSONUrl: function() {
    var url = '';
    var filename = location.href.replace(location.hash, '').replace(location.getDir(), '').replace('.html', '');
    filename = filename.indexOf('index') > -1 || filename == '' ? '' : filename + '/';
    filename = filename.replace('#', '');
    filename = filename.replace(/\?[^/]*/g, '');
    if(this.category === 'top-sp') {
      url = '/-/Feed/-.json?page=1';
    } else if(this.type == 'global' && this.category == 'live') {
        url = location.getDir() + '/' + (this.subcategory || '-') + '.json?page=1&startdt=' + (this.startDate || '') + '&enddt=' + (this.endDate || '');;
    } else if(this.type == 'global' && this.category == 'newrelease') {
    	if (this.$timesort.filter('.is-active').length == 0) {
    	    this.startDate = this.$timesort.filter(':first').attr('data-df-start-date').replace(/\//g, '') || null;
    	    this.endDate = this.$timesort.filter(':first').attr('data-df-end-date').replace(/\//g, '') || null;
    	}
        url = location.getDir() + (filename.replace('/', '') || '-') + '/' + (this.subcategory || '-') + '.json?page=1&startdt=' + (this.startDate || '') + '&enddt=' + (this.endDate || '');;
    } else if((this.type == 'artist' && this.category == 'news') || this.category == 'other' || (this.type == 'artist' && this.category == 'live')) {
      url = location.getDir() + filename.replace('/', '') + '.json?page=1';
    } else {
      url = location.getDir() + filename + (this.subcategory || '-') + '.json?page=1';
    }
    return url;
  },
  fetchData: function(isRefresh) {
    if(this.url === "") return;
    if(this.ajax != null) { this.ajax.abort(); }

    this.loadTime = new Date().getTime();
    this.ajax = $.ajax({
      url: this.url,
      type: 'GET',
      datatype: 'json',
      success: $.proxy(this.createList, this, isRefresh),
      error: $.proxy(this.error, this)
    });
  },
  createList: function(isRefresh, d) {
    var myself = this;
    var delay = this.CONSTS.DELAY_TIME - (new Date().getTime() - this.loadTime);
    if(delay < 0) delay = 0;
    this.ajax = null;

    setTimeout(function() {
      var data = typeof d === 'object' ? d : JSON.parse(d);
      switch(myself.category) {
        case 'live':
          if(myself.type === 'global') {
            VICTOR.CREATE_FEED_LIST.GLOBAL_LIVE(myself.$list, myself.$template, data, {startDateTime: myself.startDateTime, endDateTime: myself.endDateTime, isRefresh: isRefresh});
          } else if(myself.type === 'artist') {
            VICTOR.CREATE_FEED_LIST.ARTIST_LIVE(myself.$list, myself.$template, data);
          }
          break;
        case 'media':
          if(myself.type === 'global') {
            VICTOR.CREATE_FEED_LIST.GLOBAL_MEDIA(myself.$list, myself.$template, data, {isRefresh: isRefresh, subcategorys: myself.$subcategorys});
          } else if(myself.type === 'artist') {
            VICTOR.CREATE_FEED_LIST.GLOBAL_MEDIA(myself.$list, myself.$template, data, {isRefresh: isRefresh, subcategorys: myself.$subcategorys});
          }
          break;
        case 'news':
          VICTOR.CREATE_FEED_LIST.NEWS(myself.$list, myself.$template, data);
          break;
        case 'other':
          VICTOR.CREATE_FEED_LIST.NEWS(myself.$list, myself.$template, data);
          break;
        case 'tieup':
          VICTOR.CREATE_FEED_LIST.TIEUP(myself.$list, myself.$template, data, {isRefresh: isRefresh, subcategorys: myself.$subcategorys});
          break;
        case 'discographylist':
          // VICTOR.CREATE_FEED_LIST.DISCOGRAPHYLIST(myself.$list, myself.$template, data, {isRefresh: isRefresh});
          VICTOR.CREATE_FEED_LIST.DISCOGRAPHYLIST_CONTENT_ONLY(myself.$list, myself.$template, data, {isRefresh: isRefresh, subcategorys: myself.$subcategorys});
          break;
        case 'newrelease':
          VICTOR.CREATE_FEED_LIST.NEWRELEASE(myself.$list, myself.$template, data,  {startDateTime: myself.startDateTime, endDateTime: myself.endDateTime, isRefresh: isRefresh, subcategorys: myself.$subcategorys});
          break;
        case 'playlist':
          VICTOR.CREATE_FEED_LIST.PLAYLIST(myself.$list, myself.$template, data, {isRefresh: isRefresh});
          break;
        case 'playlist-pickup':
          VICTOR.CREATE_FEED_LIST.PLAYLIST_PICKUP(myself.$list, myself.$template, data, {isRefresh: isRefresh});
          break;
        case 'playlist-pickup-detail':
          VICTOR.CREATE_FEED_LIST.PLAYLIST_PICKUP_DETAIL(myself.$list, myself.$template, data, {isRefresh: isRefresh});
          break;
        case 'genre-other':
          VICTOR.CREATE_FEED_LIST.GENRE_OTHER(myself.$list, myself.$template, data, {isRefresh: isRefresh});
          break;
        case 'top-sp':
          VICTOR.CREATE_FEED_LIST.TOP_SP(myself.$list, myself.$template, data);
          break;
      }
      myself.isViewCount = myself.isViewCount + myself.viewCount;
      myself.url = data.next_url;
      if(myself.url === '') {
        myself.$body.removeClass('dn-footer');
      }
      if(myself.scrollable) {
        if(myself.url === "" || ($('.jsc-noitem').length != 0 && !$('.jsc-noitem').hasClass('is-template'))) {
          myself.$body.removeClass('dn-footer');
        } else {
          myself.$body.addClass('dn-footer');
        }
      }
      if(myself.$window.height() > myself.$htmlBody.height()) {
        if($('.jsc-noitem').hasClass('is-template') && myself.url != '') {
          myself.isLoading(true);
          myself.fetchData(false);
        }

        if($('.jsc-noitem').length === 0 && myself.url != '') {
          myself.isLoading(true);
          myself.fetchData(false);
        }
      }
      if(location.href.indexOf('#') > 0 && myself.url != '' && $('.jsc-df-list').children().length === 0 && $('.jsc-noitem').attr('class').indexOf('isNoData') == -1) {
        $('.jsc-noitem').addClass('is-template');
        myself.fetchData(false);
      } else {
        myself.isLoading(false);
      }
      myself.scrollToId();
    }, delay);
  },
  error: function(error) {
    console.log(error);
  },
  scrollToId: function() {
    if(this.enableListId() && this.listId != null) {
      var $targetList = $('[data-df-id="' + this.listId + '"]');
      if($targetList.length === 0) {
        this.$htmlBody.animate({ scrollTop: this.$htmlBody.height() });
        if(this.url != '') {
          this.isLoading(true);
          this.fetchData(false);
        }

      } else {
        this.$htmlBody.animate({ scrollTop: $targetList.offset().top });
        this.listId = null;
        this.isLoading(false);
      }
    }
  },
  controlHash: function() {
    // hashからsubcategory startDate endDate listId を取得
    var hash = location.hash || '';
    var subcategoryGroupHash = hash.replace('#', '').split('-')[0] || '';
    var subcategory = subcategoryGroupHash.split('/')[0] || '-';
    var startDate = this.$timesort.length !== 0 && subcategoryGroupHash.split('/').length > 1 ? subcategoryGroupHash.split('/')[1] : null;
    var endDate = this.$timesort.length !== 0 && subcategoryGroupHash.split('/').length > 2 ? subcategoryGroupHash.split('/')[2]: null;
    var listId = hash.replace('#', '').split('-')[1] || null;

    // urlから直接hashをいじった際にもstateがnullになるため、以前の状態から変化があった場合はpushStateとして認識する。
    subcategory = subcategory.replace(/[ !"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g, '\\$&');
    if (this.$subcategorys.filter('[data-df-subcategory=' + subcategory + ']').length === 0) {
      subcategory = this.category === 'genre-other' ? $('.jsc-df-subcategory li a').attr('data-df-subcategory') : '-';
    }

    VICTOR.SHARE_LINK.updateShareLink();
    this.controlData(false, {subcategory: subcategory, startDate: startDate, endDate: endDate, listId: listId});
  },
  controlData: function(isHandler, data) {
    var startDate = data.startDate;
    var endDate = data.endDate;
    var subcategory = data.subcategory;
    var listId = data.listId;

    // timesort control
    var needFetchData = false;
    if(this.$timesort.length !== 0) {
      var $timesortBtn = null;
      var sd = startDate != null && startDate != '' ? startDate.slice(0, 4) + '/' + startDate.slice(4, 6) + '/' + startDate.slice(6,8) : null;
      var ed = endDate != null && endDate != '' ? endDate.slice(0, 4) + '/' + endDate.slice(4, 6) + '/' + endDate.slice(6,8) : null;
      if(sd && ed) {
        $timesortBtn = this.$timesort.filter('[data-df-start-date="' +  sd + '"][data-df-end-date="' + ed + '"]');
        this.startDate = startDate;
        this.endDate = endDate;
      } else if(sd) {
        $timesortBtn = this.$timesort.filter('[data-df-start-date="' +  sd + '"]:not([data-df-end-date])');
        this.startDate = startDate;
        this.endDate = null;
      }
      this.changeTimeSort($timesortBtn && $timesortBtn.length !== 0 ? $timesortBtn : this.$timesort.eq(0));
      needFetchData = true;
    }

    // subcategory control
    if(this.$subcategorys.length !== 0 && (this.subcategory !== subcategory)) {
      // サブカテゴリが変更された場合は変更ロジックを実行
      this.subcategory = subcategory;
      if(VICTOR.UA.isSP() && this.$subcategorys.length != 0) {
        this.$feed.find('.jsc-df-subcategory').scrollLeft(this.$subcategorys.filter('[data-df-subcategory=' + this.subcategory + ']').position().left + this.$feed.find('.jsc-df-subcategory').scrollLeft() - 20);
      }
      this.changeSubcategory();
      needFetchData = true;
    }

    // list id control
    this.setListId(listId);
    if(!needFetchData && listId != null) this.scrollToId(listId);

    if(isHandler) {
      this.pushStateSubcategory({ subcategory: subcategory, startDate: startDate, endDate: endDate }, '', location.pathname + this.getHash(subcategory, startDate, endDate, listId));
    }

    if(needFetchData) {
      this.isLoading(true);
      this.fetchData(true);
    }
  },
  getHash: function(subcategory, startDate, endDate, listId) {
    var sc = subcategory === '-' ? '' : (subcategory || '');
    var sd = startDate == null ? (endDate == null ? '' : '/') : '/' + startDate;
    var ed = endDate == null ? (startDate == null) ? '' : '/' : '/' + endDate;
    var li = listId == null ? '' : '-' + listId;
    var hash = !sc && !sd && !ed && !li ? '' : '#';

    return hash + sc + sd + ed + li;
  }
};

// ======================================================================================
// NEWSリスト作成オブジェクト
// ======================================================================================
VICTOR.CREATE_FEED_LIST = {
  topSpOrderCounter: -1,
  topSpUnitCounter: 0,
  outputUnitOrder: ['module-topics', 'banner-artist', 'module-playlist', 'banner-genre', 'module-sns', 'banner-video', 'module-banner', 'banner-live'],
  arrayUnitCount: [4, 4, 4, 4, 4, 4, 4, 4],
  $unitList: null,
  dayOfWeekString: [ "日", "月", "火", "水", "木", "金", "土" ],
  isViewNDate: '',
  NEWS: function($list, $template, data) {
    var articles = data.contents.articles;
    var blurImageService = new VICTOR.BLUR_IMAGE.CONSTRUCTOR();

    for(var i = 0, leni = articles.length; i < leni; i++) {
      // date
      var dataDate = articles[i].open_dt.replace(/-/g, '.').split(' ')[0];
      if(this.isViewDate !== dataDate) {
        this.isViewDate = dataDate;
        var $date = $template.filter('[data-df-template="date"]').clone(true);
        $date.find('[data-df-value="date"]').text(this.isViewDate);
        $list.append($date);
      }

      var $article = $template.filter('[data-df-template="article"]').clone(true);

      $article.on('dragstart', function() { return false; });

      // artist name
      if(articles[i].artist_name != void(0)) {
        $article.find('[data-df-value="artist"]').text(articles[i].artist_name);
      } else {
        $article.find('[data-df-value="artist"]').parent().remove();
      }

      // title
      if(articles[i].title != void(0)) {
        $article.find('[data-df-value="title"]').text(articles[i].title);
      }

      // contents
      if(articles[i].text != "") {
        //$article.find('[data-df-value="text"]').text(VICTOR.STRINGS.ellipsis(articles[i].text, 120, '...'));
        $article.find('[data-df-value="text"]').text(articles[i].text);
      }

      // images
      if(articles[i].list_image_url != "") {
        var $target = $article;
        $article.find('[data-df-value="image"]').find('img').attr('src', articles[i].list_image_url);
        blurImageService.prependBlurImage(articles[i].list_image_url, $target.find('[data-df-value="image"]'));
      } else {
        $article.find('[data-df-value="image"]').remove();
      }

      // share and url
      if(articles[i].url != "") {
        $article.find('a').attr('href', articles[i].url);
        $article.find('[data-df-value="share"]').find('a').attr('href', articles[i].url);
        for(var j = 0, lenj = $article.find('[data-df-value="share"]').find('a').length;  j < lenj; j++) {
          if(articles[i]['title_for_sns'] == '') {
            $article.find('[data-df-value="share"]').parent().remove();
            continue;
          }
          var title = '';
          var hash = articles[i]['hash_for_sns'];
          new VICTOR.SHARE_LINK.CONSTRUCTOR($article.find('[data-df-value="share"]').find('a').eq(j), title, articles[i].url, hash, articles[i]['artist_cd']);
        }
      } else {
        $article.find('[data-df-value="share"]').remove();
      }

      // new
      if(articles[i].newmark == "" || articles[i].newmark == "0") {
        $article.find('[data-df-value="new"]').css({display: 'none'});
      }

      $list.append($article);
    }
    $list.find('[data-df-value="text"]').each(function(index, element) {
      if (VICTOR.UA.isPC()){
          $clamp(element, {clamp: 2});
      } else {
    	  $(element).text(VICTOR.STRINGS.ellipsis($(element).text(), 120, '...'));
      }
    });
  },
  GLOBAL_LIVE: function($list, $template, data, option) {
    if(option.isRefresh) $list.empty();
    var noItemFlag = true;

    var dates = data.contents.dates;
    for(var i = 0, leni = dates.length; i < leni; i++) {
      // date
      var date = dates[i].date.replace(/-/g, '/');
      if(option.endDateTime && new Date(date).getTime() > option.endDateTime) continue;
      if(option.startDateTime && new Date(date).getTime() < option.startDateTime) {
        if(noItemFlag != false) {
          $('.jsc-noitem').removeClass('is-template');
          $('.jsc-noitem').addClass('isNoData');
          return;
        }
        continue;
      }

      // if(new Date(date).getTime())
      // var $date = $template.filter('[data-df-template="date"]').clone(true);
      // $date.find('[data-df-value="date"]').text(date + ' (' + this.dayOfWeekString[new Date(date).getDay()] + ')');
      // $list.append($date);

      // date
      var $date = $template.filter('[data-df-template="date"]').clone(true);
      $date.find('[data-df-value="date"]').text(dates[i]['date'].replace(/-/g, '.'));
      $list.append($date);

      var articles = dates[i].articles;
      for(var j = 0, lenj = articles.length; j < lenj; j++) {
        noItemFlag = false;
        var $article = $template.filter('[data-df-template="article"]').clone(true);

        $article.on('dragstart', function() { return false; });

        // url
        var url = articles[j]['id'] ? articles[j]['url'] + '#-' + articles[j]['id'] : articles[j]['url'];
        $article.find('[data-df-value="url"]').attr('href', url);

        // artist-name
        $article.find('[data-df-value="artist"]').text(articles[j]['artist_nm']);
        $article.find('[data-df-value="artist"]').attr('href', articles[j]['artist_url']);
        // new
        if(articles[j]['newmark'] == void(0) || articles[j]['newmark'] == '0') {
          $article.find('[data-df-value="new"]').remove();
        }

        // title
        $article.find('[data-df-value="title"]').text(articles[j]['live-event_nm']);

        // area
        if(articles[j]['prefecture_nm'] == void(0) || articles[j]['prefecture_nm'] == '') {
          $article.find('[data-df-value="prefecture"]').next('br').remove();
          $article.find('[data-df-value="prefecture"]').remove();
        } else {
          if($('[data-df-subcategory="kaigai"]').attr('class') == 'is-active') {
            $article.find('[data-df-value="prefecture"]').text('[国名] ' + articles[j]['prefecture_nm']);
          } else {
            $article.find('[data-df-value="prefecture"]').text($article.find('[data-df-value="prefecture"]').text() + ' ' + articles[j]['prefecture_nm']);
          }
        }

        // type
        if(articles[j]['type'] == void(0) || articles[j]['type'] == '') {
          $article.find('[data-df-value="type"]').remove();
        } else {
          $article.find('[data-df-value="type"]').text(articles[j]['type'].toUpperCase());
        }

        // place
        if(articles[j]['place'] == void(0) || articles[j]['place'] == '') {
          $article.find('[data-df-value="place"]').next('br').remove();
          $article.find('[data-df-value="place"]').remove();
        } else {
          $article.find('[data-df-value="place"]').text($article.find('[data-df-value="place"]').text() + ' ' + articles[j]['place']);
        }

        //enter-time
        if(articles[j]['enter_tm'] == void(0) || articles[j]['enter_tm'] == '') {
          $article.find('[data-df-value="enter-time"]').next('br').remove();
          $article.find('[data-df-value="enter-time"]').remove();
        } else {
          $article.find('[data-df-value="enter-time"]').text($article.find('[data-df-value="enter-time"]').text() + ' ' + articles[j]['enter_tm']);
        }

        // start-time
        if(articles[j]['start_tm'] == void(0) || articles[j]['start_tm'] == '') {
          $article.find('[data-df-value="start-time"]').next('br').remove();
          $article.find('[data-df-value="start-time"]').remove();
        } else {
          $article.find('[data-df-value="start-time"]').text($article.find('[data-df-value="start-time"]').text() + ' ' + articles[j]['start_tm']);
        }

        // call
        if(articles[j]['call'] == void(0) || articles[j]['call'] == '') {
          $article.find('[data-df-value="call"]').next('br').remove();
          $article.find('[data-df-value="call"]').remove();
        } else {
          $article.find('[data-df-value="call"]').text($article.find('[data-df-value="call"]').text() + ' ' + articles[j]['call']);
        }

        // memo
        if(articles[j]['memo'] === '') {
          $article.find('[data-df-value="memo"]').next().remove();
          $article.find('[data-df-value="memo"]').remove();
        } else {
          $article.find('[data-df-value="memo"]').html(articles[j]['memo']);
        }
        // web_url
        if(articles[j]['web_url'] === '') {
          $article.find('[data-df-value="web_url"]').next().remove();
          $article.find('[data-df-value="web_url"]').remove();
        } else {
          $article.find('[data-df-value="web_url"]').text(articles[j]['web_url']);
          $article.find('[data-df-value="web_url"]').attr("href",articles[j]['web_url']);
        }

        // share
        if(articles[j]['url'] != "") {
          for(var k = 0, lenk = $article.find('[data-df-value="share"]').find('a').length;  k < lenk; k++) {
          if(articles[j]['title_for_sns'] == '') {
            $article.find('[data-df-value="share"]').parent().remove();
            continue;
          }
            var title = '';
            var hash = articles[j]['hash_for_sns'];
            var url = articles[j]['id'] ? articles[j]['url'] + '#-' + articles[j]['id'] : articles[j]['url'];
            new VICTOR.SHARE_LINK.CONSTRUCTOR($article.find('[data-df-value="share"]').find('a').eq(k), title, url, hash, articles[j]['artist_cd']);
          }
        } else {
          $article.find('[data-df-value="share"]').remove();
        }
        $list.append($article);
      }
    }

    if(noItemFlag) {
      $('.jsc-noitem').removeClass('is-template');
    } else {
      $('.jsc-noitem').addClass('is-template');
    }
  },
  ARTIST_LIVE: function($list, $template, data) {
    var lives = data.contents.live;

    for(var i = 0, leni = lives.length; i < leni; i++) {
      var $article = $template.clone(true);

      $article.on('dragstart', function() { return false; });

      if(lives[i]['id'] && lives[i]['id'] !== "") {
        $article.attr('data-df-id', lives[i]['id']);
      }

      // new
      if(lives[i]['newmark'] == '' || lives[i]['newmark'] == '0') {
        $article.find('[data-df-value="new"]').eq(0).remove();
      }

      // title
      $article.find('[data-df-value="title"]').text(lives[i]['live-event_nm']);

      // type
      $article.find('[data-df-value="type"]').text(lives[i]['type'].toUpperCase());

      // text
      if(lives[i]['text'] == "") {
        $article.find('[data-df-value="text"]').remove();
      } else {
        $article.find('[data-df-value="text"]').html(lives[i]['text']);
      }

      // share and url
      if(lives[i]['url'] != "") {
        $article.find('[data-df-value="share"]').find('a').attr('href', lives[i]['url']);
        for(var j = 0, lenj = $article.find('[data-df-value="share"]').find('a').length;  j < lenj; j++) {
          if(lives[i]['title_for_sns'] == '') {
            $article.find('[data-df-value="share"]').parent().remove();
            continue;
          }
          var title = '';
          var hash = lives[i]['hash_for_sns'];
          var url = lives[i]['url'];
          new VICTOR.SHARE_LINK.CONSTRUCTOR($article.find('[data-df-value="share"]').find('a').eq(j), title, url, hash, lives[i]['artist_cd']);
        }
      } else {
        $article.find('[data-df-value="share"]').remove();
      }

      // schedule
      var $scheduleTemplate = $article.find('[data-df-value="schedule-template"]').clone(true);
      $article.find('[data-df-value="schedule-template"]').remove();
      $scheduleTemplate.removeClass('is-template');
      if(lives[i].schedules && lives[i].schedules.length != 0) {
        for(var j = 0, lenj = lives[i].schedules.length; j < lenj; j++) {

          var $schedule = $scheduleTemplate.clone(true);

          // new
          if(lives[i].schedules[j]['newmark'] == '' || lives[i].schedules[j]['newmark'] == '0') {
            $schedule.find('[data-df-value="new"]').remove();
          }

          // s-date
          var date = lives[i].schedules[j]['date'].replace(/-/g, '/');
          $schedule.find('[data-df-value="s-date"]').text(date + ' (' + this.dayOfWeekString[new Date(date).getDay()] + ')');

          // s-prefecture
          if(lives[i].schedules[j]['prefecture_nm'] === "") {
        	  $schedule.find('[data-df-value="s-prefecture"]').next().remove();
        	  $schedule.find('[data-df-value="s-prefecture"]').remove();
          } else {
        	  $schedule.find('[data-df-value="s-prefecture"]').text($schedule.find('[data-df-value="s-prefecture"]').text() + ' ' + lives[i].schedules[j]['prefecture_nm']);
          }

          // s-place
          if(lives[i].schedules[j]['place'] === "") {
            $schedule.find('[data-df-value="s-place"]').next().remove();
            $schedule.find('[data-df-value="s-place"]').remove();
          } else {
            $schedule.find('[data-df-value="s-place"]').text($schedule.find('[data-df-value="s-place"]').text() + ' ' + lives[i].schedules[j]['place']);
          }

          // s-enter-time
          if(lives[i].schedules[j]['enter_tm'] === "") {
            $schedule.find('[data-df-value="s-enter-time"]').next().remove();
            $schedule.find('[data-df-value="s-enter-time"]').remove();
          } else {
            var enterTime = lives[i].schedules[j]['enter_tm'].split(':');
            $schedule.find('[data-df-value="s-enter-time"]').text($schedule.find('[data-df-value="s-enter-time"]').text() + ' ' + enterTime[0] + ':' + enterTime[1]);
          }

          // s-start-time
          if(lives[i].schedules[j]['start_tm'] === '') {
            $schedule.find('[data-df-value="s-start-time"]').next().remove();
            $schedule.find('[data-df-value="s-start-time"]').remove();
          } else {
            var startTime = lives[i].schedules[j]['start_tm'].split(':');
            $schedule.find('[data-df-value="s-start-time"]').text($schedule.find('[data-df-value="s-start-time"]').text() + ' ' + startTime[0] + ':' + startTime[1]);
          }

          // s-call
          if(lives[i].schedules[j]['call'] === '') {
            $schedule.find('[data-df-value="s-call"]').next().remove();
            $schedule.find('[data-df-value="s-call"]').remove();
          } else {
            $schedule.find('[data-df-value="s-call"]').html($schedule.find('[data-df-value="s-call"]').text() + ' ' + lives[i].schedules[j]['call']);
          }

          // s-note      <- s-note は以下のコードに置き換えてください
          if(lives[i].schedules[j]['memo'] === '') {
            $schedule.find('[data-df-value="s-note"]').next().remove();
            $schedule.find('[data-df-value="s-note"]').remove();
          } else {
        	  $schedule.find('[data-df-value="s-note"]').html(lives[i].schedules[j]['memo']);
          }
          // s-link_url   <-新規に追加した項目です
          if(lives[i].schedules[j]['link_url'] === '') {
            $schedule.find('[data-df-value="s-link_url"]').next().remove();
            $schedule.find('[data-df-value="s-link_url"]').remove();
          } else {
            $schedule.find('[data-df-value="s-link_url"]').text(lives[i].schedules[j]['link_url']);
            $schedule.find('[data-df-value="s-link_url"]').attr("href",lives[i].schedules[j]['link_url']);
          }

          $article.find('[data-df-value="schedule"]').append($schedule);
          if(lenj - j - 1 > 0) $article.find('[data-df-value="schedule"]').append('<br/>');
        }
      }

      $list.append($article);
    }
  },
  GLOBAL_MEDIA: function($list, $template, data, option) {
    if(option.isRefresh) $list.empty();
    var articles = data.contents.articles;
    var noItemFlag = true;
    for(var i = 0, leni = articles.length; i < leni; i++) {
      // open date
      if(new Date(articles[i]['open_dt']).getTime() > new Date().getTime()) continue;

      var $article = $template.clone(true);

      $article.on('dragstart', function() { return false; });

      if(articles[i]['id'] && articles[i]['id'] !== "") {
        $article.attr('data-df-id', articles[i]['id']);
      }
      noItemFlag = false;
      // artist
      if(articles[i]['artist_nm'] && articles[i]['artist_nm'] !== "") {
        $article.find('[data-df-value="artist"]').text(articles[i]['artist_nm']);
        $article.find('[data-df-value="artist"]').attr('href', articles[i]['artist_url']);
      } else {
        $article.find('[data-df-value="artist"]').parent().remove();
      }

      // url
      $article.find('[data-df-value="url"]').attr('href', articles[i]['id'] && articles[i]['url'].indexOf('#') < 0 ? articles[i]['url'] + '#-' + articles[i]['id'] : articles[i]['url']);

      // new
      if(!articles[i]['newmark'] || articles[i]['newmark'] === '0') {
        $article.find('[data-df-value="new"]').remove();
      }

      // type
      $article.find('[data-df-value="type"]').text(option.subcategorys.filter('[data-df-subcategory="' + articles[i]['type'] + '"]').text());

      // title
      if(articles[i]['program_nm'] && articles[i]['program_nm'] !== '') {
        $article.find('[data-df-value="title"]').text(articles[i]['program_nm']);
      } else if(articles[i]['target_nm'] && articles[i]['target_nm'] !== '') {
        $article.find('[data-df-value="title"]').text(articles[i]['target_nm']);
      }

      // oa-channel
      if(articles[i]['channel_nm'] && articles[i]['channel_nm'] != '') {
        $article.find('[data-df-value="oa-channel"]').text(articles[i]['channel_nm']);
      } else  {
        $article.find('[data-df-value="oa-channel"]').next('br').remove();
        $article.find('[data-df-value="oa-channel"]').remove();
      }

      // date
      if(articles[i]['sale_dt'] && articles[i]['sale_dt'] !== '') {
        var regularName = articles[i]['regular'] == "1" ? ' ' + articles[i]['regular_nm']: "";
        $article.find('[data-df-value="date"]').text(articles[i]['sale_dt'].replace(/-/g, '.') + ' (' + this.dayOfWeekString[new Date(articles[i]['sale_dt']).getDay()] + ') ' + regularName);
      } else if((articles[i]['oa_dt'] == '' && articles[i]['oa_start_tm'] == '' && articles[i]['oa_end_tm'] == '') ||
      (articles[i]['type'] == 'newspaper' || articles[i]['type'] == 'magazine' || articles[i]['type'] == 'web')) {
        var regularName = articles[i]['regular'] == "1" ? ' ' + articles[i]['regular_nm']: "";
        if(regularName) {
          $article.find('[data-df-value="date"]').text(regularName);
        } else {
          $article.find('[data-df-value="date"]').next('br').remove();
          $article.find('[data-df-value="date"]').remove();
        }
      } else {
        if(articles[i]['oa_dt']) {
          var date = articles[i]['oa_dt'].replace(/-/g, '.') + ' (' + this.dayOfWeekString[new Date(articles[i]['oa_dt']).getDay()] + ')';
        } else {
          var date = '';
        }
        var startTime = articles[i]['oa_start_tm'] && articles[i]['oa_start_tm'] != "" ? articles[i]['oa_start_tm'].split(':') : "";
        if(startTime != "") startTime = startTime[0] + ':' + startTime[1];
        var endTime= articles[i]['oa_end_tm'] && articles[i]['oa_end_tm'] != "" ? articles[i]['oa_end_tm'].split(':') : "";
        if(endTime!= "") endTime= endTime[0] + ':' + endTime[1];
        var regularName = articles[i]['regular'] == "1" ? ' ' + articles[i]['regular_nm']: "";
        if(startTime || endTime) {
          if(regularName || date) {
            date = date + regularName + ' / ' + startTime + "〜" + endTime;
          } else {
            date = startTime + "〜" + endTime;
          }
        } else {
          date = date + regularName;
        }
        $article.find('[data-df-value="date"]').text(date);
      }

      // text
      if(articles[i]['text'] === '') {
        $article.find('[data-df-value="text"]').prev('br').remove();
        $article.find('[data-df-value="text"]').remove();
      }
      $article.find('[data-df-value="text"]').html(articles[i]['text']);

      // share
      if(articles[i].url != "") {
        $article.find('[data-df-value="share"]').find('a').attr('href', articles[i].url);
        for(var j = 0, lenj = $article.find('[data-df-value="share"]').find('a').length;  j < lenj; j++) {
          if(articles[i]['title_for_sns'] == '') {
            $article.find('[data-df-value="share"]').parent().remove();
            continue;
          }
          var title = '';
          var url = articles[i]['id'] && articles[i]['url'].indexOf('#') < 0 ? articles[i]['url'] + '#-' + articles[i]['id'] : articles[i]['url'];
          var hash = articles[i]['hash_for_sns'];
          new VICTOR.SHARE_LINK.CONSTRUCTOR($article.find('[data-df-value="share"]').find('a').eq(j), title, url, hash, articles[i]['artist_cd']);
        }
      } else {
        $article.find('[data-df-value="share"]').remove();
      }

      $list.append($article);

    }

    if(noItemFlag) {
      $('.jsc-noitem').removeClass('is-template');
      $('.jsc-noitem').addClass('isNoData');
    } else {
      $('.jsc-noitem').addClass('is-template');
    }

  },
  TIEUP: function($list, $template, data, option) {
    if(option && option.isRefresh) $list.empty();

    var articles = data.contents.articles;

    for(var i = 0, leni = articles.length; i < leni; i++) {
      var $article = $template.clone(true);

      $article.on('dragstart', function() { return false; });

      if(articles[i]['id'] && articles[i]['id'] !== "") {
        $article.attr('data-df-id', articles[i]['id']);
      }

      // url
      $article.find('[data-df-value="url"]').attr('href', articles[i]['id'] && articles[i]['url'].indexOf('#') < 0 ? articles[i]['url'] + '#-' + articles[i]['id'] : articles[i]['url']);

      // artist
      $article.find('[data-df-value="artist"]').text(articles[i]['artist_nm']);
      $article.find('[data-df-value="artist"]').attr('href', articles[i]['artist_url']);

      // type
      $article.find('[data-df-value="type"]').text(option.subcategorys.filter('[data-df-subcategory="' + articles[i]['type'] + '"]').text());

      // new
      if(articles[i]['newmark'] !== '1') {
        $article.find('[data-df-value="new"]').remove();
      }
      // title
      $article.find('[data-df-value="title"]').text(articles[i]['tieup_nm']);

      // song-name
      $article.find('[data-df-value="song-name"]').text(articles[i]['song_nm']);

      // item-url
      if(articles[i]['item_url'] != '') $article.find('[data-df-value="item-url"]').attr('href', articles[i]['item_url']);
      else {
        $article.find('[data-df-value="item-url"]').children().unwrap();
        $article.find('[data-df-value="song-name"]').addClass('mat-songname');
      }

      // song-btn
      if(articles[i]['video_id'] === "" || articles[i]['video_id'] === void(0)) {
        $article.find('[data-df-value="song-btn"]').parent().remove();
      } else {
        $article.find('[data-df-value="video"]').attr('data-id', articles[i]['video_id']);
        VICTOR.BC_PLAYER_MANAGER.externalCreatePlayer($article.find('[data-df-value="video"]'));
      }

      // text
      $article.find('[data-df-value="text"]').html(articles[i]['text']);

      // shares
      if(articles[i]['url'] != "") {
        $article.find('[data-df-value="share"]').find('a').attr('href', articles[i]['url']);
        for(var j = 0, lenj = $article.find('[data-df-value="share"]').find('a').length;  j < lenj; j++) {
          if(articles[i]['title_for_sns'] == '') {
            $article.find('[data-df-value="share"]').parent().remove();
            continue;
          }
          var title = '';
          var hash = articles[i]['hash_for_sns'];
          var url = articles[i]['id'] && articles[i]['url'].indexOf('#') < 0 ? articles[i]['url'] + '#-' + articles[i]['id'] : articles[i]['url'];
          new VICTOR.SHARE_LINK.CONSTRUCTOR($article.find('[data-df-value="share"]').find('a').eq(j), title, url, hash, articles[i]['artist_cd']);
        }
      } else {
        $article.find('[data-df-value="share"]').remove();
      }

      $list.append($article);
    }
  },
  NEWRELEASE: function($list, $template, data, option) {
    if(option && option.isRefresh) $list.empty();
    var dates = data.contents.dates;
    var noItemFlag = true;
    var category = option.subcategorys.filter('.is-active').attr('data-df-subcategory');
    // パンくず
    if (option.subcategorys.filter('.is-active').text() != 'ALL') {
      $('#type_breadclumb').html(option.subcategorys.filter('.is-active').text());
      $('#type_breadclumb').show();
    } else {
        $('#type_breadclumb').hide();
    }

    for(var i = 0, leni = dates.length; i < leni; i++) {
      var date = dates[i].date.replace(/-/g, '/');

      if(option.endDateTime && new Date(date).getTime() > option.endDateTime) continue;
      if(option.startDateTime && new Date(date).getTime() < option.startDateTime) {
        if(noItemFlag != false) {
          $('.jsc-noitem').removeClass('is-template');
          $('.jsc-noitem').addClass('isNoData');
          return;
        }
        continue;
      }

      // date
      var $date = $template.filter('[data-df-template="date"]').clone(true);
      $date.find('[data-df-value="date"]').text(dates[i]['date'].replace(/-/g, '.'));
      $list.append($date);

      var type = 'singles';
      if(dates[i][type] && dates[i][type].length !== 0) {
        noItemFlag = false;

        var $content = $template.filter('[data-df-template="content"]').clone(true);

        // heading
        if(category != void(0) && category === '-') {
          $list.append($template.filter('[data-df-template="heading-' + type + '"]').clone(true));
        }

        for (var j = 0, lenj = dates[i][type].length; j < lenj; j++) {
          var $item = $template.filter('[data-df-template="list"]').clone(true);

          $item.on('dragstart', function() { return false; });

          // url
          $item.find('a').attr('href', dates[i][type][j]['url']);

          // newmark
          if(dates[i][type][j]['newmark'] != "1") {
            $item.find('[data-df-value="new"]').remove();
          }

          // title
          $item.find('[data-df-value="title"]').text(dates[i][type][j]['item_nm']);

          // artist
          $item.find('[data-df-value="artist"]').text(dates[i][type][j]['artist_nm']);

          // label
          $item.find('[data-df-value="label"]').text(option.subcategorys.filter('[data-df-subcategory="' + type.slice(0, -1) + '"]').text());

          // image
          $item.find('[data-df-value="image"]').attr('src', dates[i][type][j]['image_url']);

          // item-type
          $item.find('[data-df-value="item-type"]').text(dates[i][type][j]['item_type_nm']);

          // item-cd
          if (dates[i][type][j]['item_cd'] && dates[i][type][j]['item_cd'] != '') $item.find('[data-df-value="item-cd"]').text(dates[i][type][j]['item_cd']);

          // price
          if (dates[i][type][j]['price'] && dates[i][type][j]['price'] != '') $item.find('[data-df-value="price"]').html(this.convertPrice(dates[i][type][j]['price']));

          $content.find('[data-df-value="list"]').append($item);
        }
        $list.append($content);
      }

      type = 'albums';
      if(dates[i][type] && dates[i][type].length !== 0) {
        noItemFlag = false;
        var $content = $template.filter('[data-df-template="content"]').clone(true);
        // heading
        if(category != void(0) && category === '-') {
          $list.append($template.filter('[data-df-template="heading-' + type + '"]').clone(true));
        }
        for (var j = 0, lenj = dates[i][type].length; j < lenj; j++) {
          var $item = $template.filter('[data-df-template="list"]').clone(true);

          $item.on('dragstart', function() { return false; });

          // url
          $item.find('a').attr('href', dates[i][type][j]['url']);

          // newmark
          if(dates[i][type][j]['newmark'] != "1") {
            $item.find('[data-df-value="new"]').remove();
          }

          // title
          $item.find('[data-df-value="title"]').text(dates[i][type][j]['item_nm']);

          // artist
          $item.find('[data-df-value="artist"]').text(dates[i][type][j]['artist_nm']);

          // label
          $item.find('[data-df-value="label"]').text(option.subcategorys.filter('[data-df-subcategory="' + type.slice(0, -1) + '"]').text());

          // image
          $item.find('[data-df-value="image"]').attr('src', dates[i][type][j]['image_url']);

          // item-type
          $item.find('[data-df-value="item-type"]').text(dates[i][type][j]['item_type_nm']);

          // item-cd
          if (dates[i][type][j]['item_cd'] && dates[i][type][j]['item_cd'] != '') $item.find('[data-df-value="item-cd"]').text(dates[i][type][j]['item_cd']);

          // price
          if (dates[i][type][j]['price'] && dates[i][type][j]['price'] != '') $item.find('[data-df-value="price"]').html(this.convertPrice(dates[i][type][j]['price']));

          $content.find('[data-df-value="list"]').append($item);
        }
        $list.append($content);
      }

      type = 'videos';
      if(dates[i][type] && dates[i][type].length !== 0) {
        noItemFlag = false;
        var $content = $template.filter('[data-df-template="content"]').clone(true);
        // heading
        if(category != void(0) && category === '-') {
          $list.append($template.filter('[data-df-template="heading-' + type + '"]').clone(true));
        }
        for (var j = 0, lenj = dates[i][type].length; j < lenj; j++) {
          var $item = $template.filter('[data-df-template="list"]').clone(true);

          $item.on('dragstart', function() { return false; });

          // url
          $item.find('a').attr('href', dates[i][type][j]['url']);

          // newmark
          if(dates[i][type][j]['newmark'] != "1") {
            $item.find('[data-df-value="new"]').remove();
          }

          // title
          $item.find('[data-df-value="title"]').text(dates[i][type][j]['item_nm']);

          // artist
          $item.find('[data-df-value="artist"]').text(dates[i][type][j]['artist_nm']);

          // label
          $item.find('[data-df-value="label"]').text(option.subcategorys.filter('[data-df-subcategory="' + type.slice(0, -1) + '"]').text());

          // image
          $item.find('[data-df-value="image"]').attr('src', dates[i][type][j]['image_url']);

          // item-type
          $item.find('[data-df-value="item-type"]').text(dates[i][type][j]['item_type_nm']);

          // item-cd
          if (dates[i][type][j]['item_cd'] && dates[i][type][j]['item_cd'] != '') $item.find('[data-df-value="item-cd"]').text(dates[i][type][j]['item_cd']);

          // price
          if (dates[i][type][j]['price'] && dates[i][type][j]['price'] != '') $item.find('[data-df-value="price"]').html(this.convertPrice(dates[i][type][j]['price']));

          $content.find('[data-df-value="list"]').append($item);
        }
        $list.append($content);
      }

      type = 'digitals';
      if(dates[i][type] && dates[i][type].length !== 0) {
        noItemFlag = false;
        var $content = $template.filter('[data-df-template="content"]').clone(true);
        // heading
        if(category != void(0) && category === '-') {
          $list.append($template.filter('[data-df-template="heading-' + type + '"]').clone(true));
        }
        for (var j = 0, lenj = dates[i][type].length; j < lenj; j++) {
          var $item = $template.filter('[data-df-template="list"]').clone(true);

          $item.on('dragstart', function() { return false; });

          // url
          $item.find('a').attr('href', dates[i][type][j]['url']);

          // newmark
          if(dates[i][type][j]['newmark'] != "1") {
            $item.find('[data-df-value="new"]').remove();
          }

          // title
          $item.find('[data-df-value="title"]').text(dates[i][type][j]['item_nm']);

          // artist
          $item.find('[data-df-value="artist"]').text(dates[i][type][j]['artist_nm']);

          // label
          $item.find('[data-df-value="label"]').text(option.subcategorys.filter('[data-df-subcategory="' + type.slice(0, -1) + '"]').text());

          // image
          $item.find('[data-df-value="image"]').attr('src', dates[i][type][j]['image_url']);

          // item-type
          $item.find('[data-df-value="item-type"]').text(dates[i][type][j]['item_type_nm']);

          // digital
          $item.find('[data-of-value="digital"]').hide();

          // item-cd
          if (dates[i][type][j]['item_cd'] && dates[i][type][j]['item_cd'] != '') $item.find('[data-df-value="item-cd"]').text(dates[i][type][j]['item_cd']);

          // price
          if (dates[i][type][j]['price'] && dates[i][type][j]['price'] != '') $item.find('[data-df-value="price"]').html(this.convertPrice(dates[i][type][j]['price']));

          $content.find('[data-df-value="list"]').append($item);
        }
        $list.append($content);
      }

      type = 'analogs';
      if(dates[i][type] && dates[i][type].length !== 0) {
        noItemFlag = false;
        var $content = $template.filter('[data-df-template="content"]').clone(true);
        // heading
        if(category != void(0) && category === '-') {
          $list.append($template.filter('[data-df-template="heading-' + type + '"]').clone(true));
        }
        for (var j = 0, lenj = dates[i][type].length; j < lenj; j++) {
          var $item = $template.filter('[data-df-template="list"]').clone(true);

          $item.on('dragstart', function() { return false; });

          // url
          $item.find('a').attr('href', dates[i][type][j]['url']);

          // newmark
          if(dates[i][type][j]['newmark'] != "1") {
            $item.find('[data-df-value="new"]').remove();
          }

          // title
          $item.find('[data-df-value="title"]').text(dates[i][type][j]['item_nm']);

          // artist
          $item.find('[data-df-value="artist"]').text(dates[i][type][j]['artist_nm']);

          // label
          $item.find('[data-df-value="label"]').text(option.subcategorys.filter('[data-df-subcategory="' + type.slice(0, -1) + '"]').text());

          // image
          $item.find('[data-df-value="image"]').attr('src', dates[i][type][j]['image_url']);

          // item-type
          $item.find('[data-df-value="item-type"]').text(dates[i][type][j]['item_type_nm']);

          // item-cd
          if (dates[i][type][j]['item_cd'] && dates[i][type][j]['item_cd'] != '') $item.find('[data-df-value="item-cd"]').text(dates[i][type][j]['item_cd']);

          // price
          if (dates[i][type][j]['price'] && dates[i][type][j]['price'] != '') $item.find('[data-df-value="price"]').html(this.convertPrice(dates[i][type][j]['price']));

          $content.find('[data-df-value="list"]').append($item);
        }
        $list.append($content);
      }

      type = 'others';
      if(dates[i][type] && dates[i][type].length !== 0) {
        noItemFlag = false;
        var $content = $template.filter('[data-df-template="content"]').clone(true);
        // heading
        if(category != void(0) && category === '-') {
          $list.append($template.filter('[data-df-template="heading-' + type + '"]').clone(true));
        }
        for (var j = 0, lenj = dates[i][type].length; j < lenj; j++) {
          var $item = $template.filter('[data-df-template="list"]').clone(true);

          $item.on('dragstart', function() { return false; });

          // url
          $item.find('a').attr('href', dates[i][type][j]['url']);

          // newmark
          if(dates[i][type][j]['newmark'] != "1") {
            $item.find('[data-df-value="new"]').remove();
          }

          // title
          $item.find('[data-df-value="title"]').text(dates[i][type][j]['item_nm']);

          // artist
          $item.find('[data-df-value="artist"]').text(dates[i][type][j]['artist_nm']);

          // label
          $item.find('[data-df-value="label"]').text(option.subcategorys.filter('[data-df-subcategory="' + type.slice(0, -1) + '"]').text());

          // image
          $item.find('[data-df-value="image"]').attr('src', dates[i][type][j]['image_url']);

          // item-type
          $item.find('[data-df-value="item-type"]').text(dates[i][type][j]['item_type_nm']);

          // item-cd
          if (dates[i][type][j]['item_cd'] && dates[i][type][j]['item_cd'] != '') $item.find('[data-df-value="item-cd"]').text(dates[i][type][j]['item_cd']);

          // price
          if (dates[i][type][j]['price'] && dates[i][type][j]['price'] != '') $item.find('[data-df-value="price"]').html(this.convertPrice(dates[i][type][j]['price']));

          $content.find('[data-df-value="list"]').append($item);
        }
        $list.append($content);
      }
    }

    if($list.children().length !== 0) noItemFlag = false;
    if(noItemFlag) {
      $('.jsc-noitem').removeClass('is-template');
    } else {
      $('.jsc-noitem').addClass('is-template');
    }
  },
  DISCOGRAPHYLIST_CONTENT_ONLY: function($list, $template, data, option) {
    if(option && option.isRefresh) $list.empty();
    var items = data.contents.items;
    var noItemFlag = true;

    if(items != void(0) && items.length != 0) {
      var hasContent = $list.find('[data-df-template="content"]').length != 0;

      var $content = hasContent ? $list.find('[data-df-template="content"]') : $template.filter('[data-df-template="content"]').clone(true);
      for(var i = 0, leni = items.length; i < leni; i++) {
        noItemFlag = false;
        var $li = $template.filter('[data-df-template="list"]').clone(true);

        $li.on('dragstart', function() { return false; });

        // url
        $li.find('a').attr('href', items[i]['url']);

        // imageitems[i]
        $li.find('[data-df-value="image"]').attr('src', items[i]['image_url']);

        // title
        $li.find('[data-df-value="title"]').text(items[i]['item_nm']);

        // newmark
        if(items[i]['newmark'] == "1") {
          $li.find('[data-df-value="new"]').css('display', 'inline');
        }

        // label
        $li.find('[data-df-value="label"]').text(option.subcategorys.filter('[data-df-subcategory="' + items[i]['type'] + '"]').text());

        // artist
        $li.find('[data-df-value="artist"]').text(items[i]['artist_nm']);

        // date
        $li.find('[data-df-value="date"]').text(items[i]['sale_dt'].replace(/-/g, '.'));

        // item-type
        $li.find('[data-df-value="item-type"]').text(items[i]['item_type_nm']);

        // price
        if(items[i]['price'] !== '') {
          $li.find('[data-df-value="price"]').html(' / ' + this.convertPrice(items[i]['price']));
        }

        $content.find('[data-df-value="list"]').append($li);
      }

      if(!hasContent) $list.append($content);
    }

    // relation
    if(data['next_url'] === '') {
      var relations = data.contents.relations;
      if(relations && relations.length !== 0) {
        noItemFlag = false;
        var $relation = $template.filter('[data-df-template="relation"]').clone(true);

        for(var i = 0, leni = relations.length; i < leni; i++) {
          var $li = $template.filter('[data-df-template="relation-list"]').clone(true);

          $li.find('[data-df-value="url"]').attr('href', relations[i]['url']);
          $li.find('[data-df-value="item-name"]').text(relations[i]['item_nm']);
          $li.find('[data-df-value="artist"]').text(relations[i]['artist_nm']);

          // newmark
          if(relations[i]['newmark'] == "1") {
            $li.find('[data-df-value="new"]').css('display', 'inline');
          }

          $relation.find('[data-df-value="relation-list"]').append($li);
        }

        // if(!$('[data-df-subcategory="products"]').hasClass('is-active')) {
        //   $relation.find('.m-hed2-page').remove();
        //   $relation.css({paddingTop: 0, borderTop: 'none'});
        // }
        $list.append($relation);
      }
    }

    if(items != void(0) && noItemFlag) {
      $('.jsc-noitem').removeClass('is-template');
    } else {
      $('.jsc-noitem').addClass('is-template');
    }
  },
  DISCOGRAPHYLIST: function($list, $template, data, option) {
    if(option && option.isRefresh) $list.empty();
    var items = data.contents.items;
    var noItemFlag = true;

    var type = 'single';
    var headingFlg = true;
    var $content = $template.filter('[data-df-template="content"]').clone(true);
    for(var i = 0, leni = items.length; i < leni; i++) {
      if(items[i].type !== type) continue;
      if(headingFlg) {
        var $heading = $template.filter('[data-df-template="heading-' + type + 's"]').clone(true);
        $list.append($heading);
        headingFlg = false;
      }
      noItemFlag = false;
      var $li = $template.filter('[data-df-template="list"]').clone(true);

      $li.on('dragstart', function() { return false; });

      // url
      $li.find('a').attr('href', items[i]['url']);

      // imageitems[i][
      $li.find('[data-df-value="image"]').attr('src', items[i]['image_url']);

      // title
      $li.find('[data-df-value="title"]').text(items[i]['item_nm']);

      // artist
      $li.find('[data-df-value="artist"]').text(items[i]['artist_nm']);

      // date
      $li.find('[data-df-value="date"]').text(items[i]['sale_dt'].replace(/-/g, '.'));

      // item-type
      $li.find('[data-df-value="item-type"]').text(items[i]['item_type_nm']);

      // price
      $li.find('[data-df-value="price"]').html(' / ' + this.convertPrice(items[i]['price']));

      $content.find('[data-df-value="list"]').append($li);
    }
    if(!headingFlg) $list.append($content);

    // アルバム
    var type = 'album';
    var headingFlg = true;
    var $content = $template.filter('[data-df-template="content"]').clone(true);
    for(var i = 0, leni = items.length; i < leni; i++) {
      if(items[i].type !== type) continue;
      if(headingFlg) {
        var $heading = $template.filter('[data-df-template="heading-' + type + 's"]').clone(true);
        $list.append($heading);
        headingFlg = false;
      }
      noItemFlag = false;
      var $li = $template.filter('[data-df-template="list"]').clone(true);

      $li.on('dragstart', function() { return false; });

      // url
      $li.find('a').attr('href', items[i]['url']);

      // imageitems[i][
      $li.find('[data-df-value="image"]').attr('src', items[i]['image_url']);

      // title
      $li.find('[data-df-value="title"]').text(items[i]['item_nm']);

      // artist
      $li.find('[data-df-value="artist"]').text(items[i]['artist_nm']);

      // date
      $li.find('[data-df-value="date"]').text(items[i]['sale_dt'].replace(/-/g, '.'));

      // item-type
      $li.find('[data-df-value="item-type"]').text(items[i]['item_type_nm']);

      // price
      $li.find('[data-df-value="price"]').html(' / ' + this.convertPrice(items[i]['price']));

      $content.find('[data-df-value="list"]').append($li);
    }
    if(!headingFlg) $list.append($content);

    // デジタル
    var type = 'digital';
    var headingFlg = true;
    var $content = $template.filter('[data-df-template="content"]').clone(true);
    for(var i = 0, leni = items.length; i < leni; i++) {
      if(items[i].type !== type) continue;
      if(headingFlg) {
        var $heading = $template.filter('[data-df-template="heading-' + type + 's"]').clone(true);
        $list.append($heading);
        headingFlg = false;
      }
      noItemFlag = false;
      var $li = $template.filter('[data-df-template="list"]').clone(true);

      $li.on('dragstart', function() { return false; });

      // url
      $li.find('a').attr('href', items[i]['url']);

      // imageitems[i][
      $li.find('[data-df-value="image"]').attr('src', items[i]['image_url']);

      // title
      $li.find('[data-df-value="title"]').text(items[i]['item_nm']);

      // artist
      $li.find('[data-df-value="artist"]').text(items[i]['artist_nm']);

      // date
      $li.find('[data-df-value="date"]').text(items[i]['sale_dt'].replace(/-/g, '.'));

      // item-type
      $li.find('[data-df-value="item-type"]').text(items[i]['item_type_nm']);

      $content.find('[data-df-value="list"]').append($li);
    }
    if(!headingFlg) $list.append($content);

    // 映像商品
    var type = 'video';
    var headingFlg = true;
    var $content = $template.filter('[data-df-template="content"]').clone(true);
    for(var i = 0, leni = items.length; i < leni; i++) {
      if(items[i].type !== type) continue;
      if(headingFlg) {
        var $heading = $template.filter('[data-df-template="heading-' + type + 's"]').clone(true);
        $list.append($heading);
        headingFlg = false;
      }
      noItemFlag = false;
      var $li = $template.filter('[data-df-template="list"]').clone(true);

      $li.on('dragstart', function() { return false; });

      // url
      $li.find('a').attr('href', items[i]['url']);

      // imageitems[i][
      $li.find('[data-df-value="image"]').attr('src', items[i]['image_url']);

      // title
      $li.find('[data-df-value="title"]').text(items[i]['item_nm']);

      // artist
      $li.find('[data-df-value="artist"]').text(items[i]['artist_nm']);

      // date
      $li.find('[data-df-value="date"]').text(items[i]['sale_dt'].replace(/-/g, '.'));

      // item-type
      $li.find('[data-df-value="item-type"]').text(items[i]['item_type_nm']);

      // price
      $li.find('[data-df-value="price"]').html(' / ' + this.convertPrice(items[i]['price']));

      $content.find('[data-df-value="list"]').append($li);
    }
    if(!headingFlg) $list.append($content);

    // アナログ盤
    var type = 'analog';
    var headingFlg = true;
    var $content = $template.filter('[data-df-template="content"]').clone(true);
    for(var i = 0, leni = items.length; i < leni; i++) {
      if(items[i].type !== type) continue;
      if(headingFlg) {
        var $heading = $template.filter('[data-df-template="heading-' + type + 's"]').clone(true);
        $list.append($heading);
        headingFlg = false;
      }
      noItemFlag = false;
      var $li = $template.filter('[data-df-template="list"]').clone(true);

      $li.on('dragstart', function() { return false; });

      // url
      $li.find('a').attr('href', items[i]['url']);

      // imageitems[i][
      $li.find('[data-df-value="image"]').attr('src', items[i]['image_url']);

      // title
      $li.find('[data-df-value="title"]').text(items[i]['item_nm']);

      // artist
      $li.find('[data-df-value="artist"]').text(items[i]['artist_nm']);

      // date
      $li.find('[data-df-value="date"]').text(items[i]['sale_dt'].replace(/-/g, '.'));

      // item-type
      $li.find('[data-df-value="item-type"]').text(items[i]['item_type_nm']);

      // price
      $li.find('[data-df-value="price"]').html(' / ' + this.convertPrice(items[i]['price']));

      $content.find('[data-df-value="list"]').append($li);
    }
    if(!headingFlg) $list.append($content);

    // その他
    var type = 'other';
    var headingFlg = true;
    var $content = $template.filter('[data-df-template="content"]').clone(true);
    for(var i = 0, leni = items.length; i < leni; i++) {
      if(items[i].type !== type) continue;
      if(headingFlg) {
        var $heading = $template.filter('[data-df-template="heading-' + type + 's"]').clone(true);
        $list.append($heading);
        headingFlg = false;
      }
      noItemFlag = false;
      var $li = $template.filter('[data-df-template="list"]').clone(true);

      $li.on('dragstart', function() { return false; });

      // url
      $li.find('a').attr('href', items[i]['url']);

      // imageitems[i][
      $li.find('[data-df-value="image"]').attr('src', items[i]['image_url']);

      // title
      $li.find('[data-df-value="title"]').text(items[i]['item_nm']);

      // artist
      $li.find('[data-df-value="artist"]').text(items[i]['artist_nm']);

      // date
      $li.find('[data-df-value="date"]').text(items[i]['sale_dt'].replace(/-/g, '.'));

      // item-type
      $li.find('[data-df-value="item-type"]').text(items[i]['item_type_nm']);

      // price
      $li.find('[data-df-value="price"]').html(' / ' + this.convertPrice(items[i]['price']));

      $content.find('[data-df-value="list"]').append($li);
    }
    if(!headingFlg) $list.append($content);

    // relation
    var relations = data.contents.relations;
    if(relations && relations.length !== 0) {
      var $relation = $template.filter('[data-df-template="relation"]').clone(true);

      for(var i = 0, leni = relations.length; i < leni; i++) {
        noItemFlag = false;
        var $li = $template.filter('[data-df-template="relation-list"]').clone(true);

        $li.on('dragstart', function() { return false; });

        $li.find('[data-df-value="url"]').attr('href', relations[i]['url']);
        $li.find('[data-df-value="item-name"]').text(relations[i]['item_nm']);
        $li.find('[data-df-value="artist"]').text(relations[i]['artist_nm']);

        $relation.find('[data-df-value="relation-list"]').append($li);
      }

      $list.append($relation);
    }
    if(noItemFlag) {
      $('.jsc-noitem').removeClass('is-template');
    } else {
      $('.jsc-noitem').addClass('is-template');
    }
  },
  PLAYLIST: function($list, $template, data, option) {
    if(option && option.isRefresh) $list.empty();
    var playlists = data.contents.playlists;

    for(var i = 0, leni = playlists.length; i < leni; i++) {
      var $li = $template.filter('[data-df-template="list"]').clone(true);

      $li.on('dragstart', function() { return false; });

      // url
      $li.find('[data-df-value="url"]').attr('href', playlists[i]['url']);

      // image
      $li.find('[data-df-value="image"]').css({backgroundImage: 'url(' + playlists[i]['image_url'] + ')'});

      // new
      if(playlists[i]['newmark'] === "0") $li.find('[data-df-value="new"]').remove();

      // title
      $li.find('[data-df-value="title"]').html(playlists[i]['title']);

      $list.append($li);
    }
  },
  PLAYLIST_PICKUP: function($list, $template, data, option) {
    if(option && option.isRefresh) $list.empty();
    var categories = data.contents.categories;

    for(var i = 0, leni = categories.length; i < leni; i++) {
      var $heading = $template.filter('[data-df-template="heading"]').clone(true);
      // heading title
      $heading.find('[data-df-value="title"]').text(categories[i]['category_nm']);
      var lenj = categories[i]['playlists'].length;

      // heading link
      if(categories[i]['is_more'] === "1") {
        $heading.find('[data-df-value="link"]').removeClass('is-template');
        $heading.find('a').attr('href', categories[i]['url']);
      }
      $list.append($heading);

      var $content = $template.filter('[data-df-template="content"]').clone(true);
      for(var j = 0; j < lenj && j < 4; j++) {
        var $li = $template.filter('[data-df-template="list"]').clone(true);

        $li.on('dragstart', function() { return false; });

        // url
        $li.find('a').attr('href', categories[i]['playlists'][j]['url']);

        // image
        $li.find('[data-df-value="image"]').css({backgroundImage: 'url(' + categories[i]['playlists'][j]['image_url'] + ')'});

        // title
        $li.find('[data-df-value="title"]').text(categories[i]['playlists'][j]['title']);

        if(categories[i]['playlists'][j]['newmark'] === "0") {
          $li.find('[data-df-value="new"]').remove();
        }

        $content.find('[data-df-value="list"]').append($li);
      }
      $list.append($content);

      if(categories[i]['is_more'] === "1") {
        var $moreBtnSp = $template.filter('[data-df-template="content-sp-btn"]').clone(true);
        $moreBtnSp.find('a').attr('href', categories[i]['url']);
        $list.append($moreBtnSp);
      }
    }
  },
  PLAYLIST_PICKUP_DETAIL: function($list, $template, data, option) {
    if(option && option.isRefresh) $list.empty();
    var category = data.contents.category;

    // heading
    if($list.find('[data-df-template="heading"]').length === 0) {
      var $heading = $template.filter('[data-df-template="heading"]').clone(true);
      // heading title
      $heading.find('[data-df-value="title"]').text(category['category_nm']);
      $list.append($heading);
    }

    var hasContent = $list.find('[data-df-template="content"]').length !== 0;
    var $content = hasContent ? $list.find('[data-df-template="content"]') : $template.filter('[data-df-template="content"]').clone(true);

    for(var i = 0, leni = category['playlists'].length; i < leni; i++) {

        var $li = $template.filter('[data-df-template="list"]').clone(true);

        $li.on('dragstart', function() { return false; });

        // url
        $li.find('a').attr('href', category['playlists'][i]['url']);

        // image
        $li.find('[data-df-value="image"]').css({backgroundImage: 'url(' + category['playlists'][i]['image_url'] + ')'});

        // title
        $li.find('[data-df-value="title"]').text(category['playlists'][i]['title']);

        if (category['playlists'][i]['newmark'] === "0") {
          $li.find('[data-df-value="new"]').remove();
        }

        $content.find('[data-df-value="list"]').append($li);
    }

    if(!hasContent) $list.append($content);
  },
  GENRE_OTHER: function($list, $template, data, option) {
    if(option.isRefresh) $list.empty();
    var items = data.contents.items;

    for(var i = 0, len = items.length; i < len; i++) {
      var $li = $template.filter('[data-df-template="list"]').clone(true);

      $li.on('dragstart', function() { return false; });

      $li.find('[data-df-value="url"]').attr('href', items[i]['url']);

      $li.find('[data-df-value="image"]').attr('src', items[i]['image_url']);

      $li.find('[data-df-value="title"]').text(items[i]['item_nm']);

      if(items[i]['type'] == void(0) || items[i]['type'] === '') {
        $li.find('[data-df-value="label"]').remove();
      } else {
        if(items[i]['type'] === 'single') $li.find('[data-df-value="label"]').text('シングル');
        if(items[i]['type'] === 'album') $li.find('[data-df-value="label"]').text('アルバム');
        if(items[i]['type'] === 'digital') $li.find('[data-df-value="label"]').text('デジタル');
        if(items[i]['type'] === 'video') $li.find('[data-df-value="label"]').text('映像商品');
        if(items[i]['type'] === 'analog') $li.find('[data-df-value="label"]').text('アナログ盤');
        if(items[i]['type'] === 'other') $li.find('[data-df-value="label"]').text('その他');
      }



      $list.append($li);

    }
  },
  TOP_SP: function($list, $template, data) {
    var articles = data.contents.articles;
    var blurImageService = new VICTOR.BLUR_IMAGE.CONSTRUCTOR();

    for(var i = 0, leni = articles.length; i < leni; i++) {
      if(this.$unitList == null || this.topSpUnitCounter >= this.arrayUnitCount[this.topSpOrderCounter]) {
        this.$unitList = $template.filter('[data-df-template="module-artist"]').clone(true);
        $list.append(this.$unitList);
        this.topSpUnitCounter = 0;
        this.topSpOrderCounter = this.arrayUnitCount.length - 1 <= this.topSpOrderCounter ? 0 : this.topSpOrderCounter + 1;
      }
      var $unit = $template.filter('[data-df-template="module-artist-list"]').clone(true);

      $unit.on('dragstart', function() { return false; });

      // image
      if(articles[i]['image_url'] != "") {
        this.setTopSpImageContainer(articles[i]['image_url'], $unit.find('[data-df-value="image"]'));
        if($unit.find('[data-df-value="image"]').attr('class').indexOf('jsc-blur-image') != -1) {
          blurImageService.prependBlurImage(articles[i]['image_url'], $unit.find('[data-df-value="image"]'));
        }
      } else {
        this.setTopSpImageContainer('/assets/images/img-homesp-noimage.png', $unit.find('[data-df-value="image"]'));
      }

      // artist_top_url
      $unit.find('[data-df-value="url"]').attr('href', articles[i]['artist_top_url']);

      // artist name
      $unit.find('[data-df-value="artist"]').text(articles[i]['artist_nm']);

      // title
      $unit.find('[data-df-value="title"]').text(articles[i]['title']);

      // text
      $unit.find('[data-df-value="text"]').text(VICTOR.STRINGS.ellipsis(articles[i].text, 120, '...'));

      // date
      $unit.find('[data-df-value="date"]').text(articles[i]['open_dt'].split(' ')[0].replace(/-/g, '.'));

      if(articles[i]['item_nm'] == '') {
        $unit.find('.hlw-info').remove();
        $unit.find('[data-df-value="description"]').remove();
        $unit.find('[data-df-value="buy"]').remove();
        $unit.find('[data-df-value="streaming"]').remove();
        $unit.find('[data-df-value="download"]').remove();
      } else {
        // description
        $unit.find('[data-df-value="description"]').text(articles[i]['description']);

        // buy
        if(articles[i]['sale_url'] === "") {
          $unit.find('[data-df-value="buy"]').remove();
        } else {
          var $modalTrigger = $unit.find('[data-df-value="buy"]');
          $modalTrigger.attr('data-href', articles[i]['sale_url']);
          new VICTOR.MODAL_IFRAME_CONSTRUCTOR($modalTrigger);
        }

        // streaming
        if(articles[i]['streaming_url'] === "") {
          $unit.find('[data-df-value="streaming"]').remove();
        } else {
          var $modalTrigger = $unit.find('[data-df-value="streaming"]');
          $modalTrigger.attr('data-href', articles[i]['streaming_url']);
          new VICTOR.MODAL_IFRAME_CONSTRUCTOR($modalTrigger);
        }

        // download
        if(articles[i]['iphone_redirect_url'] != "") {
            var $modalTrigger = $unit.find('[data-df-value="download"]');
            $modalTrigger.attr('href', articles[i]['iphone_redirect_url']);
            $modalTrigger.attr('ve-event-action', articles[i]['artist_cd'] +"/DR/"+ articles[i]['iphone_download_item_cd'] + "/iTS");
            $modalTrigger.attr('ve-event-category', "DOWNLOAD_iTS");
            $modalTrigger.attr('target', '_blank');
            $modalTrigger.addClass('ve-event-post');
        } else {
        if(articles[i]['download_url'] === "") {
          $unit.find('[data-df-value="download"]').remove();
        } else {
          var $modalTrigger = $unit.find('[data-df-value="download"]');
          $modalTrigger.attr('data-href', articles[i]['download_url']);
          new VICTOR.MODAL_IFRAME_CONSTRUCTOR($modalTrigger);
        }
      }
      }

      // share
      if(articles[i]['artist_top_url'] != "") {
        for(var j = 0, lenj = $unit.find('[data-df-value="share"]').find('a').length;  j < lenj; j++) {
          if(articles[i]['title_for_sns'] == '') {
            $unit.find('[data-df-value="share"]').parent().remove();
            continue;
          }
          var title = '';
          var hash = articles[i]['hash_for_sns'];
          new VICTOR.SHARE_LINK.CONSTRUCTOR($unit.find('[data-df-value="share"]').find('a').eq(j), title, articles[i]['artist_top_url'], hash, articles[i]['artist_cd']);
        }
      } else {
        $unit.find('[data-df-value="share"]').remove();
      }

      this.$unitList.append($unit);

      this.topSpUnitCounter = this.topSpUnitCounter + 1;
      if(this.arrayUnitCount[this.topSpOrderCounter] > this.topSpUnitCounter) continue;
      var $module = $template.filter('[data-df-template="' + this.outputUnitOrder[this.topSpOrderCounter] + '"]').clone(false);
      if(this.outputUnitOrder[this.topSpOrderCounter] === 'module-sns') {
        new VICTOR.CAROUSEL_NORMAL.CONSTRUCTOR($module.find('.m-carousel-normal'), $list.width());
      }
      if(this.outputUnitOrder[this.topSpOrderCounter] === 'module-topics') {
        var $textBoxes = $module.find('.df-ellipsis');
        for(var j = 0, lenj = $textBoxes.length; j < lenj; j++) new VICTOR.ELLIPSIS_CONSTRUCTOR($textBoxes.eq(j));
        new VICTOR.CAROUSEL_NORMAL.CONSTRUCTOR($module.find('.m-carousel-normal'), $list.width());
      }
      $list.append($module);
    }
  },
  convertPrice: function(value) {
    var prefix = '&yen;';
    var suffix = '(税込)';
    return prefix + this.addComma(value) + suffix;
  },
  addComma: function(num) {
    var _num = num.replace( /^(-?\d+)(\d{3})/, "$1,$2" );
    if(_num !== num) {
      return this.addComma(_num);
    }
    return _num;
  },
  setTopSpImageContainer: function(imageSrc, $container) {
    var img = new Image();
    img.onload = function() {
      if(img.width < img.height) $container.addClass('vertical');
      $container.find('img').attr('src', imageSrc);
    };
    img.src = imageSrc;
  }

};

VICTOR.STRINGS = {
  ellipsis: function(string, count, afterText) {
    var cutString = count || 30;
    var suffix = afterText || '…';

    var textLength = string.length;
    if(textLength <= cutString) {
      return string;
    } else {
      return string.substr(0, cutString - 1) + suffix;
    }
  }
};

VICTOR.ELLIPSIS = {
  init: function() {
    if(!this.setParams()) return;
    this.instantiate();
  },
  setParams: function() {
    this.$textBoxes = $('.jsc-ellipsis');
    if(this.$textBoxes.length === 0) return false;
    return true;
  },
  instantiate: function() {
    for(var i = 0, len = this.$textBoxes.length; i < len; i++) {
      new VICTOR.ELLIPSIS_CONSTRUCTOR(this.$textBoxes.eq(i));
    }
  }
};

VICTOR.ELLIPSIS_CONSTRUCTOR = function($textBox, suffix) {
  this.$textBox = $textBox;
  this.suffix = suffix || '…';
  this.init();
};

VICTOR.ELLIPSIS_CONSTRUCTOR.prototype = {
  init: function() {
    this.setParams();
    this.prepare();
    this.bindEvents();
  },
  setParams: function() {
    this.originalString = this.$textBox.text();
    this.$window = $(window);
  },
  prepare: function() {
    this.setMaxLength();
    this.cutString();
  },
  bindEvents: function() {
    var myself = this;
    this.$window.on('resize', function() {
      myself.setMaxLength();
      myself.cutString();
    });
  },
  setMaxLength: function() {
    if(VICTOR.UA.isSP()) {
      this.maxStringLength = this.$textBox.attr('data-sp') ? parseInt(this.$textBox.attr('data-sp')) : null;
    } else {
      this.maxStringLength = this.$textBox.attr('data-pc') ? parseInt(this.$textBox.attr('data-pc')) : null;
    }
  },
  cutString: function() {
    if(this.maxStringLength === null || this.originalString.length <= this.maxStringLength) {
      this.$textBox.text(this.originalString);
    } else {
      this.$textBox.text(this.originalString.substr(0, this.maxStringLength - 1) + this.suffix);
    }
  }
};

// ======================================================================================
// VIDEO ARTIST
// ======================================================================================
VICTOR.VIDEO_ARTIST = {
  init : function() {
    if(!this.setParams()) return;
    this.prepare();
  },
  setParams: function() {
    this.$videoListContainer = $('.jsc-video-artist');
    if(this.$videoListContainer.length === 0) return false;
    this.$videoList = this.$videoListContainer.find('.view_timer');
    return true;
  },
  prepare: function() {
    this.deleteTrashTag();
    this.wrapText();
    this.wrapIframe();
    this.checkTime();
  },
  deleteTrashTag: function() {
    this.$videoListContainer.children('br').remove();
    this.$videoListContainer.children('hr').remove();
  },
  wrapText: function() {
    this.$videoListContainer.find('div').each(function(){
      var text = $(this).text();
      if(text) {
        var iframe = $(this).find('iframe');
        $(this).html('<p>' + text + '</p>');
        $(this).append(iframe);
      }
    })
  },  wrapIframe: function() {
    this.$videoListContainer.children('iframe').wrap('<div />');
  },
  checkTime: function() {
    if(this.$videoList.length === 0) return;

    var nowTime = new Date().getTime();

    this.$videoList.each(function() {
      var startTime = $(this).attr('data-start-date');
      var endTime = $(this).attr('data-end-date');

      if(startTime) startTime = new Date(startTime).getTime();
      if(endTime) endTime = new Date(endTime).getTime();

      if(endTime && endTime < nowTime) {
        $(this).remove();
      } else if(startTime && startTime > nowTime) {
        $(this).remove();
      }
    });
  }
};

VICTOR.IFRAME_ASPECT_RATIO = {
  DEFAULT_ASPECT_RATIO: 0.7,
  init: function() {
    if(!this.setParams()) return;
    this.prepare();
    this.bindEvents();
  },
  setParams: function() {
    this.$iframes = $('.m-news-detail, .jsc-video-artist, .mba-read, .mid-note, .mbl-text, .l-content-read').find('iframe');
    if(this.$iframes.length === 0) return false;
    this.$window = $(window);
    return true;
  },
  prepare: function() {
    this.execute();
  },
  bindEvents: function() {
    this.$window.on('resize', $.proxy(this.execute, this));
  },
  execute: function() {
    if(this.$iframes.length != 0) {
      for(var i = 0, len = this.$iframes.length; i < len; i++) {
        this.setAspectRatio(this.$iframes.eq(i));
      }
    }
  },
  setAspectRatio: function($iframe) {
    if(VICTOR.UA.isSP()) {
      var width = parseInt($iframe.attr('width')),
          height = parseInt($iframe.attr('height'));
      var AspectRatio = width && height ? height / width : this.DEFAULT_ASPECT_RATIO;
      $iframe.css({
        'max-width': 'auto',
        'width': '100%',
        'height': ($iframe.css('width').replace('px', '') - 0) * AspectRatio
      });
    } else {
      $iframe.removeAttr('style');
    }
  }
};

/*
VICTOR.SP_TAP = {
  init: function() {
    if(!'ontouchend' in document) return;
    this.setParams();
    this.bindEvents();
  },
  setParams: function() {
    this.$body = $('body');
  },
  bindEvents: function() {
    let myself = this;

    this.$body.on( 'touchstart', function() {
      if(!myself.tapFlag) return;
      myself.tapFlag = false;
      $('a').removeClass('is-tap');
    });

    this.$body.on( 'touchstart', 'a' , function() {
      myself.isTouch = true;
    });
    this.$body.on( 'touchmove', 'a' , function(){
      myself.isTouch = false;
    });

    this.$body.on( 'touchend', 'a' , function() {
      if(myself.isTouch){
          myself.tapFlag = true;
          var $myself = $(this);
          $myself.addClass('is-tap');
          setTimeout(function(){
          $myself.removeClass('is-tap');
        }, 250);
      }
    });
  }
}
*/
/* 20181030追加--start */
VICTOR.SP_TAP = {
  init: function() {
    if(!'onstart' in document) return;
    this.setParams();
    this.bindEvents();
  },
  setParams: function() {
    this.$body = $('body');
  },
  bindEvents: function() {
    let myself = this;

    this.$body.on( 'touchend', function() {
      if(!myself.tapFlag) return;
      myself.tapFlag = false;
      $('a').removeClass('is-tap');
    });

    this.$body.on( 'touchend	', 'a' , function() {
      myself.isTouch = true;
    });
    this.$body.on( 'touchmove', 'a' , function(){
      myself.isTouch = false;
    });

    this.$body.on( 'touchstart', 'a' , function() {
      if(myself.isTouch){
          myself.tapFlag = true;
          var $myself = $(this);
          $myself.addClass('is-tap');
/*
          setTimeout(function(){
          $myself.removeClass('is-tap');
        }, 250);
*/
      }
    });

  }
}
/* 20181030追加--end */

VICTOR.LISTENING_MODAL_CONTROLLER = {
  init: function() {
    if(!this.setParams()) return;
    this.prepare();
  },
  setParams: function() {
    this.$listeningModalController = $('.jsc-listening-modal-controller');
    if(this.$listeningModalController.length === 0) return false;

    this.$abortButton = this.$listeningModalController.find('.jsc-listening-modal-abort');

    this.$image = this.$listeningModalController.find('.jsc-listening-modal-image');
    this.$player = this.$listeningModalController.find('.jsc-listening-modal-bcplayer-timeline');
    return true;
  },
  prepare: function() {
    this.setImage();
  },
  bindEvents: function() {
    var myself = this;
    if(this.$abortButton.length != 0) {
      this.$abortButton.on('click', function() {
        VICTOR.BC_PLAYER_MANAGER.endedOtherPlayer();
        myself.$listeningModalController.fadeOut(500);
      });
    }
  },
  setImage: function() {
    var myself = this;
    var image = new Image();
    image.onload = function() {
      VICTOR.BC_PLAYER_MANAGER.externalCreateTimelinePlayer(myself.$player);
      myself.bindEvents();
    };
    image.src = this.$image.attr('src');
  }
};

// ======================================================================================
// VIEW_TIMER
// ======================================================================================
VICTOR.VIEW_TIMER = {
  init : function() {
    if(!this.setParams()) return;
    this.prepare();
  },
  setParams: function() {
    this.$wrapper = $('.jsc-view-timers');
    this.$viewTimers = this.$wrapper.find('.view_timer');
    if(this.$viewTimers.length === 0) return false;
    return true;
  },
  prepare: function() {
    // this.wrapIframe(this.$wrapper.children('iframe'));
    // this.removeBrHr(this.$wrapper);
    this.checkTime();
  },
  checkTime: function() {
    var nowTime = new Date().getTime();

    this.$viewTimers.each(function() {
      var startTime = $(this).attr('data-start-date');
      var endTime = $(this).attr('data-end-date');

      if(startTime) startTime = new Date(startTime).getTime();
      if(endTime) endTime = new Date(endTime).getTime();

      if(endTime && endTime < nowTime) {
        var $next = $(this).next('br');
        if($next.length !== 0) {
          $(this).next('br').remove();
          $(this).next('hr').remove();
          $(this).next('br').remove();
        } else {
          $(this).prev('br').remove();
          $(this).prev('hr').remove();
          $(this).prev('br').remove();
        }

        $(this).remove();
      } else if(startTime && startTime > nowTime) {
        var $next = $(this).next('br');
        if($next.length !== 0) {
          $(this).next('br').remove();
          $(this).next('hr').remove();
          $(this).next('br').remove();
        } else {
          $(this).prev('br').remove();
          $(this).prev('hr').remove();
          $(this).prev('br').remove();
        }
        $(this).remove();
      }
    });
  },
  wrapIframe: function($iframes) {
    $iframes.wrap('<div />');
  },
  removeBrHr: function($wrap) {
    $wrap.find('br').remove();
    $wrap.find('hr').remove();
  }
};

VICTOR.FORM_VALIDATOR = {
  init: function() {
    if(!this.setParams()) return;
    this.prepare();
  },
  setParams: function() {
    this.$forms = $('.jsc-form-validator');
    if(this.$forms.length === 0) return false;
    return true;
  },
  prepare: function() {
    this.instantiate();
  },
  instantiate: function() {
    for(var i = 0, len = this.$forms.length; i < len; i++) {
      new VICTOR.FORM_VALIDATOR.CONSTRUCTOR(this.$forms.eq(i));
    }
  }
};

VICTOR.FORM_VALIDATOR.CONSTRUCTOR = function($form) {
  this.$form = $form;
  this.init();
};

VICTOR.FORM_VALIDATOR.CONSTRUCTOR.prototype = {
  init: function() {
    this.setParams();
    this.bindEvents();
  },
  setParams: function() {
    this.$formItems = this.$form.find('.jsc-fv-item');
    this.$submitBtn = this.$form.find('.jsc-fv-submit');
    return true;
  },
  bindEvents: function() {
    this.$submitBtn.on('click', $.proxy(this.submit, this));
  },
  submit: function(e) {
    if(!this.validation()) e.preventDefault();
  },
  validation: function() {
    var readyForSubmit = true;
    var $firstErrorItem = '';
    for(var i = 0, len = this.$formItems.length; i < len; i++) {
      var $item = this.$formItems.eq(i);
      var flag = false;

      // required
      if(this.$formItems.eq(i).attr('data-required') == 'true') flag = this.checkRequired(this.$formItems.eq(i)) || flag;

      // max length
      if(this.$formItems.eq(i).attr('data-max-length') != void(0)) flag = this.checkMaxLength(this.$formItems.eq(i)) || flag;

      // min length
      if(this.$formItems.eq(i).attr('data-min-length') != void(0)) flag = this.checkMinLength(this.$formItems.eq(i)) || flag;

      // telephone number validation
      if(this.$formItems.eq(i).attr('data-type') != 'tel') flag = this.checkTelephoneNumber(this.$formItems.eq(i)) || flag;

      // mail checkbox
      if(this.$formItems.eq(i).attr('data-mailcheck') == 'true') flag = this.checkMailmagazine(this.$formItems.eq(i)) || flag;

      if(flag) {
        $item.addClass('is-error');
        if (!$firstErrorItem) $firstErrorItem = $item;
      } else {
        $item.removeClass('is-error');
      }
      readyForSubmit = flag ? false : readyForSubmit;
    }
    if($firstErrorItem) {
      this.setFocus($firstErrorItem);
    }

    return readyForSubmit;
  },
  checkRequired: function($item) {
    var flag = false;
    var type = $item.attr('data-type');

    switch(type) {
      case 'text':
        flag = $item.find('input').val().length == 0;
        break;
      case 'email':
        flag = $item.find('input').val().length == 0;
        break;
      case 'textarea':
        flag = $item.find('textarea').val().length == 0;
        break;
      case 'checkbox':
        flag = !$item.find('input').is(':checked');
        break;
      case 'tel':
        flag = $item.find('input').val().length == 0;
        break;
    }

    flag && $item.find('.jsc-error-required') ? $item.find('.jsc-error-required').css({display: 'block'}) : $item.find('.jsc-error-required').css({display: 'none'});

    return flag;
  },
  setFocus: function($item) {
    var type = $item.attr('data-type');

    switch(type) {
      case 'text':
        $item.find('input').focus();
        break;
      case 'email':
        $item.find('input').focus();
        break;
      case 'textarea':
        $item.find('textarea').focus();
        break;
      case 'checkbox':
        $item.find('input').focus();
        break;
      case 'tel':
        $item.find('input').focus();
        break;
    }
  },
  checkMaxLength: function($item) {
    var flag = false;
    var type = $item.attr('data-type');
    var maxLength = parseInt($item.attr('data-max-length'));

    switch(type) {
      case 'text':
        flag = $item.find('input').val().length > maxLength;
        break;
      case 'textarea':
        flag = $item.find('textarea').val().length > maxLength;
        break;
    }

    flag && $item.find('.jsc-error-max-length') ? $item.find('.jsc-error-max-length').css({display: 'block'}) : $item.find('.jsc-error-max-length').css({display: 'none'});

    return flag;
  },
  checkMinLength: function($item) {
  },
  checkSelect: function($item) {
  },
  checkTelephoneNumber: function($item) {
  },
  checkMailmagazine: function($item) {
    var flag = true;
    var $checkbox = $item.find('input');

    for (var i = 0, len = $checkbox.length; i < len; i++) {
      if ( $checkbox.eq(i).is(':checked') ) {
        flag = false;
      }
    }

    flag && $item.find('.jsc-error-mailcheck') ? $item.find('.jsc-error-mailcheck').css({display: 'block'}) : $item.find('.jsc-error-mailcheck').css({display: 'none'});

    return flag;
  }
};

VICTOR.BANNER_HEADER = {
  init: function($item) {
    if(!this.setParams()) return;
    this.bindEvents();
  },
  setParams: function() {
    this.$content = $('.jsc-banner-header');
    if(this.$content.length == 0) return false;
    var myself = this;
    this.$closeBtn = this.$content.find('.jsc-btn-close');
    this.bannerHeight = this.$content.height();
    this.$content.css('height', this.bannerHeight + 'px');
    this.closeFlag = false;
    this.main = $('main');
    if(!VICTOR.UA.isPC() && !VICTOR.UA.isTAB()) {
      this.main.css('padding-top', 60 + Number(this.bannerHeight) + 'px');
      setTimeout(function(){
        myself.main.css('transition', 'padding-top .3s');
      }, 0)
    }
    return true;
  },
  bindEvents: function() {
    var myself = this;
    this.$closeBtn.on('click', function(){
      myself.$content.addClass('is-close');
      myself.closeFlag = true;
      $('.jsc-data-feed').css('padding-top', '');
    });
  }
};

// ======================================================================================
// 初期化メソッド
// ======================================================================================
VICTOR.UA.init();

$(function() {
  VICTOR.SHARE_LINK.init();
  VICTOR.HEADER.init();
  VICTOR.MODAL.init();
  VICTOR.MODAL_YT.init();
  VICTOR.MODAL_IMAGE.init();
  VICTOR.BLUR_IMAGE.init();
  VICTOR.BC_PLAYER_MANAGER.init();
  VICTOR.SMOOTH_SCROLL.init();
  VICTOR.YT_PLAYER_MANAGER.init();
  VICTOR.ACCORDION.init();
  VICTOR.BANNER_HEADER.init();

  VICTOR.CAROUSEL_NORMAL.init();
  VICTOR.CAROUSEL_HOME_PC.init();
  VICTOR.CAROUSEL_SP.init();
  VICTOR.CAROUSEL_VIDEO.init();

  VICTOR.VIEW_TIMER.init();
  VICTOR.FORM_VALIDATOR.init();

  VICTOR.SCROLL_TOP.init();
  VICTOR.VIDEO_LIST.init();
  VICTOR.MENU_ARTIST.init();
  VICTOR.MENU_SCROLL.init();
  VICTOR.FEED_LIST.init();
  VICTOR.MODAL_IFRAME.init();
  VICTOR.MODAL_LISTNING.init();
  VICTOR.MODAL_HOME.init();
  VICTOR.VIDEO_ARTIST.init();
  VICTOR.IFRAME_ASPECT_RATIO.init();
  VICTOR.ELLIPSIS.init();
  VICTOR.LISTENING_MODAL_CONTROLLER.init();
});

$(window).on('load', function() {
  VICTOR.SMOOTH_SCROLL_SIMPLE.init();
  VICTOR.FACEBOOK_PAGE_RESIZER.init();
  VICTOR.SP_TAP.init();
});
