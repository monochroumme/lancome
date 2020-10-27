<template>
  <section v-if="data" class="cards">
    <swiper ref="mySwiper" class="cards__swiper" :options="swiperOption">
      <swiper-slide class="cards__item" v-for="(card, i) in data" :key="i">
        <slot :card="card"></slot>
      </swiper-slide>
    </swiper>
    <div class="swiper-button-prev promo__arrow-btn arrow-btn" :class="`prev-btn-goods-${idVideo}`" slot="button-prev"></div>
    <div class="swiper-button-next promo__arrow-btn arrow-btn arrow-btn-products" :class="`next-btn-goods-${idVideo}`" slot="button-next"></div>
  </section>
</template>
<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

export default {
  name: "CardScroller",

  props: {
    data: {
      Type: Object,
      default: undefined
    },
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
        initialSlide: 0,
        loop: false,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        navigation: {
          nextEl: `.next-btn-goods-${this.idVideo}`,
          prevEl: `.prev-btn-goods-${this.idVideo}`
        },
        observer: true,
        observeParents: true,
        preloadImages: false,
        lazyLoading: true,
        lazy: {
          loadPrevNext: true
        }
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.mySwiper.$swiper.slideTo(0);
      }, 50);
    });
  }
};

</script>

<style lang="scss" scoped>
@import '@/assets/scss/mixins/list-scroll';
@import '@/assets/scss/global/colors';

.cards {
  &--goods {
    .cards__item {
      display: flex;
      flex-shrink: 0;
      width: fit-content;
    }

    .cards__hover {
      padding-top: 20px;
    }
  }
}

.swiper-container {
  overflow: hidden;
  border-radius: 8px;
}

.cards__hover {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cards__date {
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
}

.arrow-btn {
  border-radius: 50%;
  background-color: white;
  box-shadow: -2px 0px 4px rgba(0, 0, 0, 0.16);

  &.swiper-button-next,
  &.swiper-button-prev {
    width: 32px;
    height: 32px;
    margin-top: 0;
    top: 50%;
    transform: translateY(-50%);
    transition:
      background-color .4s,
      border-color .4s,
      opacity .4s,
      visibility .4s;

    &:focus {
      outline: none;
    }

    &::after,
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: inherit;
    }

    &::before {
      height: 1px;
      width: 11px;
      background-color: #000000;

      transition: background-color .4s;
    }

    &::after {
      left: 17px;
      width: 8px;
      height: 8px;
      border: 1px solid #000000;
      border-left: none;
      border-top: none;

      transform: translate(-50%, -50%) rotate(-45deg);

      transition: border-color .4s;
    }

    &:hover {
      outline: none;
      background-color: $pink;
      border-color: $pink;

      &::before {
        background-color: $white;
      }

      &::after {
        border-color: $white;
      }
    }

    &.swiper-button-next {
      right: -15px;
    }

    &.swiper-button-prev {
      transform: scaleX(-1) translateY(-50%);
      left: -15px;
    }
  }

  &.swiper-button-disabled {
    opacity: 0 !important;
    visibility: none;
  }

  &--transparent {
    background-color: rgba(255, 255, 255, .88);
    border-color: #969BA8;

    &::before {
      background-color: #969BA8;
    }

    &::after {
      border-color: #969BA8;
    }
  }
}

@media (max-width: 1400px) {
  .arrow-btn {
    &.swiper-button-prev.swiper-button-prev {
      left: -8px;
    }

    &.swiper-button-next.swiper-button-next {
      right: -8px;
    }
  }

  .cards__item {
    height: unset;
  }
}

@media (max-width: 550px) {
  .cards {
    &--goods {
      margin: 0 10px;

      .swiper-container {
        overflow: visible;
      }
    }
  }

  .arrow-btn {
    display: none;
  }
}
</style>
