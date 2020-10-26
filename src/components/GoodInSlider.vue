<template>
  <div class="good__outer">
    <a v-if="good.price" class="good" target="_blank" :href="good.link">
      <div v-if="good.image" class="good__img-wrap">
        <img :src="good.image.small" :alt="good.title" />
      </div>
      <div class="good__desc-wrap">
        <h3 class="good__title" v-if="good.title">
          {{ good.title }}
        </h3>
        <p class="good__desc" v-if="good.description">
          {{ good.description }}
        </p>
        <div class="good__info-wrap">
          <div class="good__price-wrap">
            <span class="good__old-price" v-if="good.isDiscount">
              {{ good.price.old | currency }} <span class="rub">₽</span>
            </span>
            <span class="good__price">
              {{ good.price.current | currency }} <span class="rub">₽</span>
            </span>
          </div>
          <div class="good__buy-button">
            <span>Купить</span>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: ["good"]
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
      border-right: none;
    }
  }
}

.good {
  width: 100%;
  position: relative;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  background-color: $white;
  transition: box-shadow 0.4s, border-color 0.4s;

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
    flex-shrink: 0;
    overflow: hidden;
    position: relative;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;

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
    justify-content: space-between;
    border-right: 1px solid #e5e5e5;
    position: relative;

    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: -16px;
      bottom: -16px;
      width: 100%;
      transition: background .2s ease;

      &:hover {
        background: #F7F6F7;
      }
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
    margin-top: 20px;
    margin-bottom: 20px;
    margin-right: 9px;

    &__img-wrap {
      min-width: 136px;
      min-height: 136px;
      width: 136px;
      height: 136px;
    }

    &__desc-wrap {
      margin-top: 4px;
      margin-bottom: 4px;
    }
  }
}

@media (max-width: 550px) {
  .good {
    
  }
}
</style>