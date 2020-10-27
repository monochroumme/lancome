<template>
  <div class="index-page" :class="{inner: currentStream ? true : false}">
    <div class="container">
      <video-products-card v-for="(item, i) in filteredData" :key="i" :data="item" />
    </div>

    <!-- INNER PAGE -->
    <transition name="slide-v" mode="out-in">
      <div class="inner-page" v-if="currentStream">
        <div class="inner-page__close" @click="goToHome">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L17 17M17 1L1 17" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="inner-page__author">
          <img :src="currentStream.streamer.image.small" :alt="currentStream.streamer.title">
          <span>{{ currentStream.streamer.title }}</span>
        </div>
        <h1 class="inner-page__title">{{ currentStream.stream.title }}</h1>
        <!-- VIDEO HERE -->
        <div class="inner-page__products">
          <div class="inner-page__products-item" v-for="(product,i) in currentStream.products" :key="i">
            <img :src="product.image.small" :alt="product.title" class="inner-page__products-image">
            <div class="inner-page__products-info">
              <h2 class="inner-page__products-title">{{ product.title }}</h2>
              <h3 class="inner-page__products-desc">{{ product.description }}</h3>
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
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import data from '@/temp/data.js';

export default {
  name: 'Index',

  components: {
    VideoProductsCard: () => import('@/components/VideoProductsCard')
  },

  data() {
    return {
      rawData: data,
      filteredData: [],
      currentStream: null
    }
  },

  mounted() {
    if (window.params)
      console.log(window.params)

    if (window.params) {
      let data = [],
        curStream;

      if (window.params.streams) {
        window.params.streams.forEach(q => {
          curStream = this.rawData.find(s => s.stream.id == q);
          if (curStream)
            data.push(curStream);
          else {
            console.log(`Stream with id ${q} doesn't exist`);
          }
        });
        this.filteredData = data;
      }
    }
  },

  watch: {
    $route: {
      handler() {
        if (this.$route && this.$route.query && this.$route.query.stream) {
          this.currentStream = this.rawData.find(s => s.stream.url == this.$route.query.stream)
        } else {
          this.currentStream = null;
        }
      },
      immediate: true
    }
  },

  methods: {
    goToHome() {
      this.$router.push({ name: 'index' })
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

  &.inner {
    overflow: hidden;
    height: 90vh;
  }
}

.slide-v-enter-active,
.slide-v-leave-active {
  transition: transform .2s ease;
}

.slide-v-enter,
.slide-v-leave-to {
  transform: translateY(100%);
}

.inner-page {
  background: white;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(0);
  z-index: 10;

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
    margin-bottom: 9px;

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
</style>
