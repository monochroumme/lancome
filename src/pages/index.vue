<template>
  <div class="index-page" ref="index">
    <div class="container">
      <video-products-card v-for="(item, i) in filteredData" :key="i" :data="item" :windowWidth="windowWidth" />
    </div>

    <!-- INNER PAGE -->
    <div class="inner-page" :class="{active: currentStreamOpen}" v-if="isInnerShown">
      <div class="inner-page__close" @click="goToHome">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L17 17M17 1L1 17" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <!-- <div class="inner-page__top"> -->
      <div class="inner-page__author">
        <img :src="currentStream.streamer.image.small" :alt="decodeURI(currentStream.streamer.title)">
        <span>{{ decodeURI(currentStream.streamer.title) }}</span>
      </div>
      <h1 class="inner-page__title">{{ decodeURI(currentStream.stream.title) }}</h1>
      <img :src="currentStream.stream.image.big" class="inner-page__video" :alt="currentStream.stream.title" v-if="currentStream.stream.status === 'not_started'">
      <iframe :src="currentStream.stream.player.url" frameborder="0" v-else></iframe>
        <!-- <Emoji class="stream-page__video_emoji" :stream="currentStream.id" v-if="currentStream.status !== 'NOT_STARTED'" /> -->
      <!-- </div> -->
      <div class="inner-page__products">
        <a target="_blank" :href="product.link" class="inner-page__products-item" v-for="(product,i) in currentStream.products" :key="i">
          <img :src="product.image.small" :alt="decodeURI(product.title)" class="inner-page__products-image">
          <div class="inner-page__products-info">
            <h2 class="inner-page__products-title">{{ decodeURI(product.title) }}</h2>
            <h3 class="inner-page__products-desc">{{ decodeURI(product.description) }}</h3>
            <div class="inner-page__products-price-wrapper">
              <div class="inner-page__products-prices">
                <span class="inner-page__products-price-old" v-if="product.isDiscount == 'true'">{{ product.price.old | currency }}
                  <svg width="8" height="9" viewBox="0 0 8 9" style="margin-left: -2px" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.00869 9.00001V7.36801H0.964687V6.58801H2.00869V5.52001H0.964687V4.60801H2.00869V0.432007H4.26469C5.31269 0.432007 6.08869 0.644007 6.59269 1.06801C7.10469 1.49201 7.36069 2.10801 7.36069 2.91601C7.36069 3.73201 7.08469 4.37201 6.53269 4.83601C5.98069 5.29201 5.16869 5.52001 4.09669 5.52001H3.08869V6.58801H5.06869V7.36801H3.08869V9.00001H2.00869ZM3.94069 4.60801C4.66869 4.60801 5.23269 4.48801 5.63269 4.24801C6.04069 4.00801 6.24469 3.57601 6.24469 2.95201C6.24469 2.40801 6.07669 2.00401 5.74069 1.74001C5.40469 1.47601 4.88069 1.34401 4.16869 1.34401H3.08869V4.60801H3.94069Z" fill="#525252"/>
                  <path d="M0.844687 5.13601H7.82869V5.73601H0.844687V5.13601Z" fill="#525252"/>
                  </svg>
                  </span>
                <span class="inner-page__products-price-current">{{ product.price.current | currency }}
                <svg width="10" height="12" viewBox="0 0 10 12" style="margin-left: -2px" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.09903 12V9.82399H0.707031V8.78399H2.09903V7.35999H0.707031V6.14399H2.09903V0.575989H5.10703C6.50437 0.575989 7.53903 0.858656 8.21103 1.42399C8.8937 1.98932 9.23503 2.81066 9.23503 3.88799C9.23503 4.97599 8.86703 5.82932 8.13103 6.44799C7.39503 7.05599 6.31237 7.35999 4.88303 7.35999H3.53903V8.78399H6.17903V9.82399H3.53903V12H2.09903ZM4.67503 6.14399C5.6457 6.14399 6.3977 5.98399 6.93103 5.66399C7.47503 5.34399 7.74703 4.76799 7.74703 3.93599C7.74703 3.21066 7.52303 2.67199 7.07503 2.31999C6.62703 1.96799 5.92836 1.79199 4.97903 1.79199H3.53903V6.14399H4.67503Z" fill="black"/>
                </svg>
                </span>
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

import scrollTo from '@/utils/smooth-scroll'

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
      windowWidth: 1000,
      savedScroll: 0
    }
  },

  async created() {
    if (window.WIDGET_SPECIAL_PARAMS_300) {
      await this.getWidgetData(window.WIDGET_SPECIAL_PARAMS_300); 

      let data = [],
        curStream;

      if (window.WIDGET_SPECIAL_PARAMS_300.streamId && this.widgetData) {
        window.WIDGET_SPECIAL_PARAMS_300.streamId.forEach(q => {
          curStream = this.widgetData.find(s => s.stream.id == q);
          if (curStream)
            data.push(curStream);
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
            this.savedScroll = document.body.scrollTop;
            this.currentStream = this.widgetData.find(s => s.stream.url == this.$route.query.stream);
            if (window.innerWidth <= 550) {
              this.$nextTick(() => {
                requestAnimationFrame(() => {
                  document.body.style.overflowY = 'hidden';
                  if (this.$refs.index)
                    this.$refs.index.style.height = 0;
                  this.currentStreamOpen = true;
                });
              });
            } else {
              scrollTo(document.querySelector(`#special-widget-${this.currentStream.stream.url}`).offsetTop - 50, null, 500);
            }
          }, 301);
        } else {
          if (window.innerWidth <= 550) {
            document.body.scrollTop = this.savedScroll;
            document.body.style.overflowY = '';
            if (this.$refs.index)
              this.$refs.index.style.height = 0;
          }
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
  height: 0;
}

.container {
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
  overflow: auto;

  iframe {
    width: 100%;
    min-height: 300px;
    height: 300px;
    position: sticky;
    top: 0;
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
    min-height: 65px;

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
    padding: 24px 10px 50px;

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
      min-height: 210px;
      height: 210px;
    }
  }
}
</style>
