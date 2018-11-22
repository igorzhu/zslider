/**
 * zSlider v 1.2.2
 * Author: Igor Zhuravlev
 */

(function ($, window, document, undefined) {

    var pluginName = "zSlider";


    function zSlider(element, options) {
        this.element = $(element);

        this.settings = $.extend({
            midW: 1000,  // при ширине меньше этой начинается адаптив
            mobW: 650,   // при ширине меньше этой показывается мобильная версия
            transition: 750, // время прокрутки слайда (ms)
            pager: false,  // показывать индикатор страниц
            arrows: true,   // показывать стрелки листания влево/вправо
            urlHashListener: false, // отслеживать изменение url при переключении слайдов
            search: false,  // формировать ссылку на основе параметров, напр.: ?page=2
            meetProportions: false, // слайд будет заполнять всё пространство экрана с сохранением пропорций картинок
            slidePicture: null, // jquery-селектор для картинки слайда в формате '.slide__picture', над которой нужно произвести манипуляции типа meetProportions
            goToSlideAnimate: false // анимировать переход к указанному слайду
        }, options);

        this.init();
    }

    $.extend(zSlider.prototype, {

        setup: {
            isMobile: false, // информация о том, соответствует ли данная ширина экрана мобильной версии
            counter: 0,              // счётчик запуска экземпляров плагина
            container: '',           // контейнер для поп-апа
            currentSlide: 1,         // индекс номер текущего слайда (отсчёт ведётся с 1, клоны не считаются)
            currentSlideId: '',      // id текущего слайда
            currentSourceId: '',     // id источника текущего слайда
            slidesSourceContainer: 'null',   // элемент, содержащий исходные слайды (на который вешается плагин)
            slideW: 0,               // ширина слайда
            shift: 0,                // смещение полотна слайдера
            slidesN: 0,              // число слайдов в галерее (не считая клонов)
            host: '',                 // исходный адрес страницы
            slidingAllowed: true,
            sliderName: '',
            def: $.Deferred()
        },

        init: function () {

            var self = this;

            self.setup = $.extend(self.setup, self.settings);

            var winW = $(window).outerWidth();

            if (winW <= self.setup.mobW) {
                self.setup.isMobile = true;
            }

            self.events();

            self.createSlider(null, null, function(){
                self.onSlideShown.apply(self);
            });

            self.swiping();

            self.mousewheel();

            self.resize();

            return true;

        },

        createSlider: function(elem, slideAlias, onCreated) {

            var self = this;

            var isSlideExist = false, // Переменная, отвечающая, существует ли слайд, соответствующий данному алиасу
                hash = '';
            var slideData;

            self.setup.slidesSourceContainer = self.element[0];

            if (self.setup.urlHashListener) {

                if (self.setup.search) {

                    var search = window.location.search;

                    slideData= search.split('page=')[1];

                } else {
                    hash = window.location.hash;

                    slideData = hash.split('_zg_')[1];
                }

                self.setup.currentSlideSource = $('#' + slideData);

                if (self.setup.currentSlideSource.length < 1){
                    console.log('Error link');
                }

                else {
                    isSlideExist = true;
                }
            }


            self.setup.sliderName = $(self.setup.slidesSourceContainer).find('[data-zslider]').data('zslider');

            var slidesGallery = $(self.setup.slidesSourceContainer).find('[data-zslider=' + self.setup.sliderName + ']');


            // Создаём контейнер для слайдера:

            self.setup.container = $('<div class="zslider__container" id="zslider-container' + self.setup.counter + '"><div class="zslider__stage"><div class="zslider__navigation"><button class="zslider__arrow zslider__arrow-left z-ar z-ar-left"></button><button class="zslider__arrow zslider__arrow-right z-ar z-ar-right"></button><div class="zslider__pager zslider__elem-hide"><button class="zslider__pager-arrow zslider__pager-arrow-left z-ar z-ar-left"></button><span class="zslider__current-slide-number">0</span>&nbsp;<span>/</span>&nbsp;<span class="zslider__total-slides-number">0</span><button class="zslider__pager-arrow zslider__pager-arrow-right z-ar z-ar-right"></button></div></div><div class="zslider__band"></div></div></div>');

            self.setup.container.insertAfter(self.setup.slidesSourceContainer);


            // Заполняем контейнер слайдами:

            slidesGallery.each(function(i, el) {

                var idTemplate = '' + self.setup.sliderName + '_zg_' + $(this).attr('id') + ''; // шаблон формирования id слайдов

                // Определяем текущий слайд

                if (isSlideExist){

                    if ($(this).attr('id') === slideData){
                        self.setup.currentSlide = i + 1; // currentSlide исчисляется с 1, а i - c 0
                        self.setup.currentSlideId = idTemplate;  // Определяем id текущего слайда
                        self.setup.currentSourceId = $(this).attr('id');
                        $(el).appendTo('.zslider__band', self.setup.container).wrap('<div class="zslider__slide zslider__slide_active" id="' + idTemplate + '"></div>');
                    }

                    else {
                        $(el).appendTo('.zslider__band', self.setup.container).wrap('<div class="zslider__slide" id="' + idTemplate + '"></div>');
                    }
                }

                else {
                    if (i === 0) {
                        self.setup.currentSlide = 1;
                        self.setup.currentSlideId = idTemplate;  // Определяем id текущего слайда
                        self.setup.currentSourceId = $(this).attr('id');
                        $(el).appendTo('.zslider__band', self.setup.container).wrap('<div class="zslider__slide zslider__slide_active" id="' + idTemplate + '"></div>');
                    }

                    else {
                        $(el).appendTo('.zslider__band', self.setup.container).wrap('<div class="zslider__slide" id="' + idTemplate + '"></div>');
                    }
                }
            });

            // $(self.setup.slidesSourceContainer).remove(); // удаляем контейнер с исходными слайдами

            if(self.setup.arrows == false){

                $('.zslider__arrow').addClass('zslider__elem-hide');
            }

            if(self.setup.pager == true){

                $('.zslider__pager').removeClass('zslider__elem-hide');
            }

            self.setup.slideW = $('.zslider__slide').outerWidth();

            $('.zslider__stage').width(self.setup.slideW);


            self.setup.slidesN = $('.zslider__slide').length; // число слайдов без клонов

            var totalSlidesNumber = self.setup.slidesN < 10 ? '0' + self.setup.slidesN : self.setup.slidesN,
                currentSlideNumber = self.setup.currentSlide < 10 ? '0' + self.setup.currentSlide : self.setup.currentSlide;

            $('.zslider__current-slide-number').text(currentSlideNumber);
            $('.zslider__total-slides-number').text(totalSlidesNumber);


            // Создаём клоны первого и последнего элементов галереи:

            $('.zslider__slide:last-child').clone().removeClass('zslider__slide_active').addClass('zslider__slide_clone').removeAttr('id').prependTo('.zslider__band');
            $('.zslider__slide:nth-child(2)').clone().removeClass('zslider__slide_active').addClass('zslider__slide_clone').removeAttr('id').appendTo('.zslider__band');


            // Смещаем полотно слайдера так, чтобы отображался текущий слайд (в соответствии с кликнутой ссылкой):

            self.setup.shift = (self.setup.currentSlide * self.setup.slideW) * -1;

            $('.zslider__band').width(self.setup.slideW * (slidesGallery.length + 2)).css({left: self.setup.shift});

            // Растягиваем картинки либо по ширине, либо по высоте, в зависимости от пропорций

            if (self.setup.meetProportions){
                self.meetProportions(self.setup.slidePicture);
            } else {
                $('.zslider__band').waitForImages(function() {
                    $('.loading__overlay').hide();
                    self.setup.def.resolve();
                });
            }

            if (onCreated) {
                self.setup.def.done(function(){
                    onCreated();
                    //callback-функция, вызываемая после создания слайдера
                });
            };
        },

        meetProportions: function(slidePicture){

            // Растягиваем картинки либо по ширине, либо по высоте, в зависимости от пропорций

            var self = this;

            var winW = $(window).outerWidth(),
                winH = $(window).height(),
                winProportion = winW / winH;


            $('.zslider__band').waitForImages(function() {

                $('.zslider__slide').each(function(i, el){
                    var pic = $(el).find($(slidePicture));
                    var picW =  pic.width(),
                        picH =  pic.height(),
                        picProportion = picW / picH;

                    if (picProportion > winProportion) {
                        pic.css({
                            width: 'auto',
                            height: '100vh'
                        });
                    } else {
                        pic.css({
                            width: '100%',
                            height: 'auto'
                        });
                    }

                    if (i == ($('.zslider__slide').length - 1)){
                        $('.loading__overlay').hide();
                    }
                });

                self.setup.def.resolve();
            });
        },

        markActiveSlideAndMakeURL: function(currentSlide){

            var self = this;

            $('.zslider__slide').removeClass('zslider__slide_active');

            var activeSlide = $('.zslider__slide:nth-child(' + (currentSlide + 1) +')');

            activeSlide.addClass('zslider__slide_active');

            self.setup.currentSlideId = activeSlide.attr('id');

            self.setup.currentSourceId = activeSlide.find('[data-zslider=' + self.setup.sliderName + ']').attr('id');

            if (self.setup.search) {
                //window.location.search = 'page=' + self.setup.currentSourceId;
                if (currentSlide === 1) {
                    window.history.replaceState( {} , '', '/' );
                } else {
                    window.history.replaceState( {} , '', '?page=' + self.setup.currentSourceId );
                }
            } else {
                window.location.hash = 'z_' + self.setup.currentSlideId;
            }
        },

        sliding: function(elem, swipeDirection, keyarrow, onSlided){

            var self = this;

            if (!self.setup.slidingAllowed) return false;

            var sliderBand = $('.zslider__band');

            if ($('.zslider__band:animated', self.setup.container).length) {
                return false;
            }

            var slideLeft  =  elem ? elem.hasClass('z-ar-left') : false  ||  ( swipeDirection === 'swipeLeft') || ( keyarrow === 'leftArrow' ),
                slideRight =  elem ? elem.hasClass('z-ar-right') : false || ( swipeDirection === 'swipeRight') || ( keyarrow === 'rightArrow' );

            if (slideLeft)
            {
                self.setup.shift += self.setup.slideW;

                if (self.setup.currentSlide > 1 )
                {
                    self.setup.currentSlide--;

                    sliderBand.animate({
                        left: self.setup.shift
                    }, self.setup.transition, function(){
                        self.onSlideShown.apply(self);
                    });

                    self.markActiveSlideAndMakeURL (self.setup.currentSlide);
                }

                else
                {
                    sliderBand.animate({
                        left: self.setup.shift
                    }, self.setup.transition, function(){

                        // устанавливаем слайдер на последний слайд:

                        self.setup.shift = (self.setup.slidesN * self.setup.slideW) * -1;

                        sliderBand.css({
                            left: self.setup.shift
                        });

                        self.onSlideShown.apply(self);
                    });

                    self.setup.currentSlide = self.setup.slidesN;

                    self.markActiveSlideAndMakeURL (self.setup.currentSlide);
                }
            }

            else if (slideRight)
            {
                self.setup.shift -= self.setup.slideW;

                if( self.setup.currentSlide < self.setup.slidesN)
                {
                    self.setup.currentSlide++;

                    sliderBand.animate({
                        left: self.setup.shift
                    }, self.setup.transition, function(){
                        self.onSlideShown.apply(self);
                    });

                    self.markActiveSlideAndMakeURL (self.setup.currentSlide);
                }

                else
                {
                    sliderBand.animate({
                        left: self.setup.shift
                    }, self.setup.transition, function(){

                        // устанавливаем слайдер на первый слайд:

                        self.setup.shift = (self.setup.slideW) * -1;

                        sliderBand.css({
                            left: self.setup.shift
                        });

                        self.onSlideShown.apply(self);
                    });

                    self.setup.currentSlide = 1;

                    self.markActiveSlideAndMakeURL (self.setup.currentSlide);
                }
            }

            if (onSlided)
            {
                onSlided();
            }
        },

        swiping: function() {

            var self = this;

            if ($.fn.swipe) {

                $('.zslider__slide').swipe({

                    swipeLeft: function (event, distance, duration, fingerCount, fingerData, currentDirection) {

                        self.sliding(null, 'swipeRight', null);
                    },

                    swipeRight: function (event, distance, duration, fingerCount, fingerData, currentDirection) {

                        self.sliding(null, 'swipeLeft', null);
                    }
                });
            }
        },

        mousewheel: function(){

            var self = this;

            if ($.fn.mousewheel) {

                $('.zslider__slide').mousewheel(function (event, delta) {

                    event.preventDefault();

                    var scrollDirection = ( delta > 0 ) ? 'swipeLeft' : 'swipeRight';

                    self.sliding(null, scrollDirection, null);
                });
            }
        },

        goTo: function (slideAlias, slideNumber){

            var self = this;

            if (slideAlias) {

                $('.zslider__slide').each(function(i, el){

                    var slideId = $(this).attr('id');

                    if (slideId) { // если это не клон
                        var regexp = new RegExp(slideId);

                        if (regexp.test(slideAlias)){

                            self.setup.currentSlide = i;

                            self.markActiveSlideAndMakeURL (self.setup.currentSlide);

                            self.setup.shift = (self.setup.currentSlide * self.setup.slideW) * -1;

                            if (self.setup.goToSlideAnimate) {
                                $('.zslider__band').animate({
                                    left: self.setup.shift
                                }, self.setup.transition, function(){
                                    self.onSlideShown.apply(self);
                                });
                            } else {
                                $('.zslider__band').css({left: self.setup.shift});

                                self.onSlideShown.apply(self);
                            }
                        };
                    }
                });

            } else if (slideNumber) {

                self.setup.currentSlide = slideNumber;

                self.markActiveSlideAndMakeURL (self.setup.currentSlide);

                self.setup.shift = (self.setup.currentSlide * self.setup.slideW) * -1;

                if (self.setup.goToSlideAnimate) {
                    $('.zslider__band').animate({
                        left: self.setup.shift
                    }, self.setup.transition, function(){
                        self.onSlideShown.apply(self);
                    });
                } else {
                    $('.zslider__band').css({left: self.setup.shift});
                    self.onSlideShown.apply(self);
                }
            }
        },

        events: function() {

            var self = this;

            /* Sliding */

            $('body').on('click', '.z-ar', function(){

                self.sliding($(this), null, null);
            });


            /* Keybord operating: sliding with left/right arrows on the keybord */

            $('body').on('keydown', self.setup.container, function(e) {

                if (e.which === 37)
                {
                    self.sliding(null, null, 'leftArrow');
                }

                else if (e.which === 39)
                {
                    self.sliding(null, null, 'rightArrow');
                }
            });
        },

        resize: function() {

            var self = this;

            $(window).on('resize', function(){

                var winW = $(window).outerWidth();

                self.setup.slideW = $('.zslider__slide').outerWidth();

                $('.zslider__stage').width(self.setup.slideW);

                // Смещаем полотно слайдера так, чтобы отображался текущий слайд (в соответствии с кликнутой ссылкой):

                self.setup.shift = ((self.setup.currentSlide) * self.setup.slideW) * -1;

                $('.zslider__band').width(self.setup.slideW * (self.setup.slidesN + 2)).css({left: self.setup.shift});

                if (self.setup.meetProportions) {
                    self.meetProportions(self.setup.slidePicture);
                } else {
                    $('.zslider__band').waitForImages(function() {
                        $('.loading__overlay').hide();
                        self.setup.def.resolve();
                    });
                }

                if (winW <= self.setup.mobW) {

                    if (self.setup.isMobile == false){
                        self.setup.isMobile = true;
                    }
                }

                else if (winW > self.setup.mobW){

                    if (self.setup.isMobile == true){
                        self.setup.isMobile = false;
                    }
                }

            });
        },

        onSlideShown: function(){

            var self = this;

            var currentSlideNumber = self.setup.currentSlide < 10 ? '0' + self.setup.currentSlide : self.setup.currentSlide;

            $('.zslider__current-slide-number').text(currentSlideNumber);
        },

        enableSliding: function(){

            var self = this;

            self.setup.slidingAllowed = true;
        },

        disableSliding: function(){

            var self = this;

            self.setup.slidingAllowed = false;
        }
    });
	
	
	$.fn[ pluginName ] = function (options) {
        this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new zSlider(this, options));
            }
        });
        return this;
    };

    // Инициализация плагина через плагин-хелпер
    // $.fn.pluginInit(pluginName, zSlider);



})(jQuery, window, document);
