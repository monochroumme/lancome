<template>
  <section v-if="data" class="cards" v-observe-visibility="visibilityChanged">
    <swiper ref="Cards" class="cards__swiper" :options="swiperOption">
      <swiper-slide class="cards__item" v-for="(card, i) in computedCards" :key="i">
        <slot :card="card" :position="position"></slot>
      </swiper-slide>
    </swiper>
    <div class="swiper-button-prev promo__arrow-btn arrow-btn" :class="`prev-btn-${name}${idVideo}`" slot="button-prev"></div>
    <div class="swiper-button-next promo__arrow-btn arrow-btn arrow-btn-products" :class="`next-btn-${name}${idVideo}`" slot="button-next" ref="nextBtn" @click="clickNext"></div>
  </section>
</template>
<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import {mapState} from 'vuex';

export default {
  name: "CardScroller",
  props: {
    data: {
      Type: Object,
      default: undefined
    },
    documentWidth: {
      Type: Number,
      default: 0
    },
    name: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    position: {},
    idVideo: {
      type: String,
      default: ''
    }
  },
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: "auto",
        loop: false,
        autoplay: {
          delay: 5000
        },
        navigation: {
          nextEl: `.next-btn-${this.name}${this.idVideo}`,
          prevEl: `.prev-btn-${this.name}${this.idVideo}`
        },
        init: false,
        preloadImages: false,
        lazyLoading: true,
        lazy: {
          loadPrevNext: true
        }
      },
      tabletWidth: 765,
      desktopWidth: 1280,
      desktopWidthMax: 1920,
      streamStatus: "",
      isVisible: false,
      activeIndex: 0,
      addedSlides: [],
      filters: [{
          title: "В эфире",
          status: "online"
        },
        {
          title: "Будут позже",
          status: "future"
        },
        {
          title: "Уже прошли",
          status: "past"
        }
      ]
    };
  },

  mounted() {
    if (this.$refs && this.$refs.Cards) {
      this.$refs.Cards.$swiper.on('transitionEnd', () => {
        if (this.isVisible) {
          this.activeIndex = this.geSlideDataIndex();
          this.visibilityChanged(true);
        }
      });

      this.$refs.Cards.$swiper.init(this.swiperOption);
    }
  },

  methods: {
    clickNext(){
      let arrow = this.$refs.nextBtn
      if(arrow && arrow.classList.contains('swiper-button-disabled')){
        this.swiper.slideTo(0)
      }
    },
    passOption() {
      return this.swiperOption;
    },
    clickFilter(status) {
      this.streamStatus = status;
    },

    visibilityChanged(isVisible) {
      this.isVisible = isVisible;
      if (isVisible && this.$refs && this.$refs.Cards && this.computedCards.length > 0) {
        window.dataLayer = window.dataLayer || [];
        if (window) {
          // send only the active slide info
          const activeProduct = this.computedCards && this.computedCards[this.activeIndex]
                                ? this.computedCards[this.activeIndex]
                                : {};
          if (activeProduct && !this.addedSlides.find(v => v == activeProduct.id)) {
            if (activeProduct.priceWithSalePercent != undefined) {
              this.addedSlides.push(activeProduct.id);
              window.dataLayer.push({
                'ecommerce': {
                  'impressions': [{
                    'name': activeProduct.title,
                    'id': activeProduct.id,
                    'price': activeProduct.priceWithSalePercent,
                    'brand': activeProduct.merchant,
                    'list': this.$route.name == 'index' ? 'Главная страница' :
                            (this.$route.name == 'stars' ? 'Стримы звезд' :
                            (this.$route.name == 'brands' ? 'Стримы брендов' :
                            (this.$route.path.startsWith('/stream/') ? 'страница стрима' : ''))),
                    'position': this.position || activeProduct.position
                  }]
                },
                'event': 'gtm-ee-event',
                'gtm-ee-event-category': 'Enhanced Ecommerce',
                'gtm-ee-event-action': 'Product Impressions',
                'gtm-ee-event-label': window.location.href,
                'gtm-ee-event-non-interaction': true
              });
            } else {
              window.dataLayer.push({
                'ecommerce': {
                  'promoView': {
                    'promotions': [{
                        'id': activeProduct.id,
                        'name': activeProduct.title,
                        'creative': '',
                        'position': this.position || activeProduct.position
                    }]
                  }
                },
                'event': 'gtm-ee-event',
                'gtm-ee-event-category': 'Enhanced Ecommerce',
                'gtm-ee-event-action': 'Promo View',
                'gtm-ee-event-label': window.location.href,
                'gtm-ee-event-non-interaction': true
              });
            }
          }
          if (!(window.innerWidth <= 700 && window.innerWidth >= 500 || window.innerWidth <= 435 || this.computedCards.length == 1)) {
            const nextToActiveProduct = this.computedCards && this.computedCards[this.activeIndex+1]
                                  ? this.computedCards[this.activeIndex+1]
                                  : {};
            if (nextToActiveProduct && !this.addedSlides.find(v => v == nextToActiveProduct.id)) {
              this.addedSlides.push(nextToActiveProduct.id);
              if (nextToActiveProduct.priceWithSalePercent != undefined) {
                window.dataLayer.push({
                  'ecommerce': {
                    'impressions': [{
                      'name': nextToActiveProduct.title,
                      'id': nextToActiveProduct.id,
                      'price': nextToActiveProduct.priceWithSalePercent,
                      'brand': nextToActiveProduct.merchant,
                      'list': this.$route.name == 'index' ? 'Главная страница' :
                              (this.$route.name == 'stars' ? 'Стримы звезд' :
                              (this.$route.name == 'brands' ? 'Стримы брендов' :
                              (this.$route.path.startsWith('/stream/') ? 'страница стрима' : ''))),
                      'position': this.position
                    }]
                  },
                  'event': 'gtm-ee-event',
                  'gtm-ee-event-category': 'Enhanced Ecommerce',
                  'gtm-ee-event-action': 'Product Impressions',
                  'gtm-ee-event-label': window.location.href,
                  'gtm-ee-event-non-interaction': true
                });
              } else {
                window.dataLayer.push({
                  'ecommerce': {
                    'promoView': {
                      'promotions': [{
                          'id': nextToActiveProduct.id,
                          'name': nextToActiveProduct.title,
                          'creative': '',
                          'position': this.position || nextToActiveProduct.position
                      }]
                    }
                  },
                  'event': 'gtm-ee-event',
                  'gtm-ee-event-category': 'Enhanced Ecommerce',
                  'gtm-ee-event-action': 'Promo View',
                  'gtm-ee-event-label': window.location.href,
                  'gtm-ee-event-non-interaction': true
                });
              }
            }
          }
        }
      }
    },

    geSlideDataIndex() {
      var activeIndex = this.swiper.realIndex;
      return activeIndex-1;
    }
  },
  computed: {
    ...mapState(['uuid', 'channels']),

    computedCards() {
      if (!Array.isArray(this.data)) return [];
      this.data.map(item => {
        if (item)
          return item.tovbanType == 'streamBottom'
        else return false;
      })
      return this.data.filter(item => {
        return (
          this.streamStatus == "" || item.status == this.streamStatus
        );
      });
    },

    swiper() {
      return this.$refs && this.$refs.Cards ? this.$refs.Cards.$swiper : {};
    }
  }
};

</script>
