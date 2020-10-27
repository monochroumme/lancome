<template>
  <div class="good__outer">
    <a v-if="good.price" class="good" target="_blank" :href="good.link">
      <div v-if="good.image" class="good__img-wrap">
        <img :src="good.image.small" :alt="good.title" />
      </div>
      <div class="good__desc-wrap" :class="{hovered}" @mouseover="hovered = true" @mouseleave="hovered = false">
        <h3 class="good__title" v-if="good.title" @mouseover.stop="hovered = false">
          {{ decodeURI(good.title) }}
        </h3>
        <p class="good__desc" v-if="good.description" @mouseover.stop="hovered = false">
          {{ decodeURI(good.description) }}
        </p>
        <div class="good__info-wrap">
          <div class="good__price-wrap">
            <span class="good__old-price" v-if="good.isDiscount == 'true'">
              {{ good.price.old | currency }} <span class="rub">
                <svg width="8" height="9" viewBox="0 0 8 9" style="margin-left: -2px" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.00869 9.00001V7.36801H0.964687V6.58801H2.00869V5.52001H0.964687V4.60801H2.00869V0.432007H4.26469C5.31269 0.432007 6.08869 0.644007 6.59269 1.06801C7.10469 1.49201 7.36069 2.10801 7.36069 2.91601C7.36069 3.73201 7.08469 4.37201 6.53269 4.83601C5.98069 5.29201 5.16869 5.52001 4.09669 5.52001H3.08869V6.58801H5.06869V7.36801H3.08869V9.00001H2.00869ZM3.94069 4.60801C4.66869 4.60801 5.23269 4.48801 5.63269 4.24801C6.04069 4.00801 6.24469 3.57601 6.24469 2.95201C6.24469 2.40801 6.07669 2.00401 5.74069 1.74001C5.40469 1.47601 4.88069 1.34401 4.16869 1.34401H3.08869V4.60801H3.94069Z" fill="#525252"/>
                <path d="M0.844687 5.13601H7.82869V5.73601H0.844687V5.13601Z" fill="#525252"/>
                </svg>
              </span>
            </span>
            <span class="good__price">
              {{ good.price.current | currency }} <span class="rub">
                <svg width="10" height="12" viewBox="0 0 10 12" style="margin-left: -2px" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.09903 12V9.82399H0.707031V8.78399H2.09903V7.35999H0.707031V6.14399H2.09903V0.575989H5.10703C6.50437 0.575989 7.53903 0.858656 8.21103 1.42399C8.8937 1.98932 9.23503 2.81066 9.23503 3.88799C9.23503 4.97599 8.86703 5.82932 8.13103 6.44799C7.39503 7.05599 6.31237 7.35999 4.88303 7.35999H3.53903V8.78399H6.17903V9.82399H3.53903V12H2.09903ZM4.67503 6.14399C5.6457 6.14399 6.3977 5.98399 6.93103 5.66399C7.47503 5.34399 7.74703 4.76799 7.74703 3.93599C7.74703 3.21066 7.52303 2.67199 7.07503 2.31999C6.62703 1.96799 5.92836 1.79199 4.97903 1.79199H3.53903V6.14399H4.67503Z" fill="black"/>
                </svg>
              </span>
            </span>
          </div>
          <div class="good__buy-button" @mouseover.stop="hovered = false">
            <span>Купить</span>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: ["good"],

  data() {
    return {
      hovered: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/colors';
@import '@/assets/scss/mixins/ellipsis';
@import '@/assets/scss/mixins/common';

@include common;

.cards__item {
  &:last-of-type {
    .good__desc-wrap {
      &:after {
        display: none;
      }
    }
  }
}

.good {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: $white;
  transition: box-shadow 0.4s, border-color 0.4s;
  margin-right: 2px;

  &:hover {
    cursor: pointer;
  }

  &__outer {
    overflow: hidden;
    max-width: 474px;
    width: 100%;
    display: flex;
    align-items: stretch;
    position: relative;
    transform: translate3d(0, 0, 0);
    width: 100%;
  }

  &__img-wrap {
    z-index: 1;
    min-width: 180px;
    min-height: 180px;
    width: 180px;
    height: 180px;
    padding: 20px;
    flex-shrink: 0;
    overflow: hidden;
    position: relative;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    img {
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
  }

  &__desc-wrap {
    margin: 16px 0;
    padding: 16px 16px;
    padding-right: 40px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 1;

    &.hovered {
      &:before {
        opacity: 1;
      }
    }

    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: -60px;
      bottom: -60px;
      width: 100%;
      opacity: 0;
      transition: opacity .2s ease;
      background: #F7F6F7;
    }

    &:after {
      content: '';
      display: block;
      position: absolute;
      right: 3px;
      top: 0;
      height: 100%;
      width: 1px;
      background: #e5e5e5;
      z-index: 1;
    }
  }

  &__title {
    @include ellipsis;
    margin: 0;
    padding: 0;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    color: black;
    text-transform: uppercase;
    text-align: left;
    margin-bottom: 8px;
  }

  &__desc {
    @include ellipsis;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: #0C0C0C;
    margin-bottom: 20px;
  }

  &__title, &__desc {
    z-index: 1;
    transition: color .2s ease;

    &:hover {
      color: $pink;
    }
  }

  &__price-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 40px;
  }

  &__old-price {
    font-family: Avenir, Arial, sans-serif;
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
    text-decoration-line: line-through;
    color: #525252;
    z-index: 1;
    margin-bottom: 5px;
  }

  &__price {
    font-family: Avenir, Arial, sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: #000000;
    z-index: 1;
    white-space: nowrap;
  }

  &__buy-button {
    background-color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
    max-width: 144px;
    min-width: 144px;
    width: 100%;
    height: 40px;
    font-size: 12px;
    line-height: 100%;
    text-align: center;
    text-transform: uppercase;
    color: #FFFFFF;
    flex-grow: 1;
    z-index: 1;
    transition: background .2s ease;

    &:hover {
      background: $pink;
    }
  }

  &__info-wrap {
    display: flex;
    justify-content: space-between;
  }

  &__link {
    display: flex;
    margin: 0;
    padding: 0;
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
    word-wrap: break-word;
    text-decoration: none;
    color: #717377;
    transition: color 0.4s,
    border-color 0.4s,
    background-color 0.4s;
    align-items: center;

    .buy__text {
      display: flex;
    }

    span {
      margin-right: 4px !important;
      display: block;
      line-height: 18px;
      height: 18px;
      white-space: nowrap;
    }

    img {
      height: 18px;
      width: auto;
      max-width: 75px;
      object-fit: contain;
      object-position: left center;
      transform: translateY(0);
    }

    &:hover,
    &:focus {
      outline: none;
      color: $pink;
    }
  }

  &__logo {
    overflow: hidden;
    position: relative;
    height: auto;
    max-width: 57px;
    max-height: 14px;
    flex-shrink: 0;

    img {
      position: absolute;
      width: 100%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

@media (max-width: 1400px) {
  .good {
    margin-right: 9px;

    &__img-wrap {
      min-width: 136px;
      min-height: 136px;
      width: 136px;
      height: 136px;
    }

    &__desc-wrap {
      margin-top: 24px;
      margin-bottom: 24px;

      &:after {
        right: 0;
      }
    }
  }
}

@media (max-width: 550px) {
  .good {
    margin-top: 16px;
    margin-bottom: 16px;
    margin-right: 0;

    &__title {
      margin-bottom: 4px;
    }

    &__desc {
      margin-bottom: 13px;
    }

    &__outer {
      max-width: 312px;
    }

    &__price-wrap {
      margin-right: 24px;
    }

    &__img-wrap {
      margin-top: 0;
      margin-bottom: 0;
      min-width: 73px;
      min-height: 73px;
      width: 73px;
      height: 73px;
      padding: 5px;
    }

    &__buy-button {
      min-width: 100px;
      max-width: 116px;
      width: 116px;
    }

    &__desc-wrap {
      padding-right: 27px;
      padding-top: 0;
      padding-bottom: 0;
      margin-top: 0;
      margin-bottom: 0;
      border-right: none;
    }
  }

  .cards__item {
    &:last-of-type {
      .good {
        border-right: none;
      }
    }
  }
}
</style>