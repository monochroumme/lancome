<template>
  <div class="index-page">
    <div class="container">
      <video-products-card v-for="(item, i) in filteredData" :key="i" :data="item" :windowWidth="windowWidth" />
    </div>

    <!-- INNER PAGE -->
    <div class="inner-page" :class="{active: currentStreamOpen}" v-body-scroll-lock="isInnerShown" v-if="isInnerShown">
      <div class="inner-page__close" @click="goToHome">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L17 17M17 1L1 17" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="inner-page__top">
        <div class="inner-page__author">
          <img :src="currentStream.streamer.image.small" :alt="decodeURI(currentStream.streamer.title)">
          <span>{{ decodeURI(currentStream.streamer.title) }}</span>
        </div>
        <h1 class="inner-page__title">{{ decodeURI(currentStream.stream.title) }}</h1>
        <img :src="currentStream.stream.image.big" class="inner-page__video" :alt="currentStream.stream.title" v-if="currentStream.stream.status === 'not_started'">
        <iframe :src="currentStream.stream.player.url" frameborder="0" v-else></iframe>
        <!-- <Emoji class="stream-page__video_emoji" :stream="currentStream.id" v-if="currentStream.status !== 'NOT_STARTED'" /> -->
      </div>
      <div class="inner-page__products">
        <a target="_blank" :href="product.link" class="inner-page__products-item" v-for="(product,i) in currentStream.products" :key="i">
          <img :src="product.image.small" :alt="decodeURI(product.title)" class="inner-page__products-image">
          <div class="inner-page__products-info">
            <h2 class="inner-page__products-title">{{ decodeURI(product.title) }}</h2>
            <h3 class="inner-page__products-desc">{{ decodeURI(product.description) }}</h3>
            <div class="inner-page__products-price-wrapper">
              <div class="inner-page__products-prices">
                <span class="inner-page__products-price-old" v-if="product.isDiscount">{{ product.price.old }}₽</span>
                <span class="inner-page__products-price-current">{{ product.price.current }}₽</span>
              </div>
              <div class="inner-page__products-buy">
                <span>Купить</span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: 'Index',

  components: {
    VideoProductsCard: () => import('@/components/VideoProductsCard')
  },

  data() {
    return {
      filteredData: [],
      currentStream: null,
      currentStreamOpen: false,
      windowWidth: 1000
    }
  },

  async created() {
    if (window.params) {
      console.log(window.params);
      await this.getWidgetData(window.params); 

      let data = [],
        curStream;

      if (window.params.streamId && this.widgetData) {
        window.params.streamId.forEach(q => {
          curStream = this.widgetData.find(s => s.stream.id == q);
          if (curStream)
            data.push(curStream);
          else {
            console.log(`Stream with id ${q} doesn't exist`);
          }
        });
        this.filteredData = data;
      }
    }

    window.addEventListener('resize', this.onResize, false);
    this.onResize();
  },

  watch: {
    currentStreamExists: {
      handler(n) {
        if (n && this.widgetData) {
          setTimeout(() => {
            this.currentStream = this.widgetData.find(s => s.stream.url == this.$route.query.stream);
            this.$nextTick(() => {
              requestAnimationFrame(() => {
                this.currentStreamOpen = true;
              });
            });
          }, 301);
        } else {
          this.$nextTick(() => {
            this.currentStreamOpen = false;
            setTimeout(() => {
              this.currentStream = null;
            }, 300);
          });
        }
      },
      immediate: true
    }
  },

  computed: {
    ...mapState(['widgetData']),

    currentStreamExists() {
      if (this.$route && this.$route.query && this.$route.query.stream && this.widgetData)
        return true
      return false
    },

    isInnerShown() {
      return this.currentStream && this.windowWidth <= 550
    }
  },

  methods: {
    ...mapActions(['getWidgetData']),

    goToHome() {
      this.$router.push({ name: 'index' })
    },

    onResize() {
      if (!this.$el) {
        window.removeEventListener('resize', this.onResize, false);
        return
      }

      this.windowWidth = window.innerWidth;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/mixins/container';
@import '@/assets/scss/mixins/common';

@include special-container;
@include common;

.index-page {
  padding-top: 50px;
  padding-bottom: 50px;
}


.inner-page {
  background: white;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(110%);
  transition: transform .2s ease;
  z-index: 10;
  display: none;
  flex-direction: column;

  iframe {
    width: 100%;
    height: 300px;
  }

  &.active {
    transform: translateY(0);
  }

  &__video {
    width: 100%;
  }

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 16px;
    height: 16px;
    cursor: pointer;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  &__author {
    padding: 16px 16px 9px;
    display: flex;
    align-items: center;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 16px;
    }

    span {
      font-weight: 600;
      font-size: 16px;
      line-height: 100%;
      color: #000000;
    }
  }

  &__title {
    font-size: 14px;
    line-height: 20px;
    color: #000000;
    font-weight: 400;
    padding: 0 16px 16px;
  }

  &__products {
    overflow-y: auto;
    padding: 24px 10px;

    &-item {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid #E5E5E5;

      &:last-of-type {
        padding-bottom: 0;
        margin-bottom: 0;
        border-bottom: none;
      }
    }

    &-info {
      flex-grow: 1;
    }

    &-image {
      width: 100px;
      object-fit: contain;
      margin-right: 8px;
    }

    &-title {
      font-weight: 500;
      margin-bottom: 5px;
      font-size: 12px;
      line-height: 14px;
      text-transform: uppercase;
      color: #000000;
    }

    &-desc {
      font-size: 14px;
      line-height: 16px;
      font-weight: 400;
      color: #000000;
      margin-bottom: 16px;
    }

    &-price-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-prices {
      margin-right: 10px;
    }

    &-price-old {
      margin-bottom: 5px;
      font-size: 12px;
      text-decoration-line: line-through;
      color: #525252;
      font-weight: 500;
    }

    &-price-current, &-price-old {
      white-space: nowrap;
      line-height: 100%;
      display: block;
    }

    &-price-current {
      font-size: 16px;
      color: #000000;
      font-weight: 500;
    }

    &-buy {
      width: 144px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      line-height: 100%;
      text-align: center;
      text-transform: uppercase;
      color: #FFFFFF;
      background: black;
      cursor: pointer;
    }
  }
}

@media (max-width: 550px) {
  .inner-page {
    display: flex;
  }
}

@media (max-width: 420px) {
  .inner-page {
    iframe {
      height: 210px;
    }
  }
}
</style>
