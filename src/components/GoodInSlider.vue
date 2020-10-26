<template>
  <div class="good__outer" v-observe-visibility="visibilityChanged" ref="good">
    <span v-if="good.price" class="good" @click="openTarget">
      <div v-if="good.images" class="good__img-wrap">
        <img :src="good.images.mobile || good.images.desktop" :alt="good.images.alt" class="swiper-lazy1" />
      </div>
      <div class="good__desc-wrap">
        <h3 class="good__title" v-if="good.title">
          {{ good.title }}
        </h3>
        <p class="good__desc" v-if="good.desc">
          {{ good.desc }}
        </p>
        <div class="good__info-wrap">
          <div class="good__price-wrap">
            <span class="good__old-price" v-if="good.price && Number(good.priceWithSalePercent) < Number(good.price)">
              {{ good.price | currency }} <span class="rub">₽</span>
            </span>
            <span class="good__price">
              {{ good.priceWithSalePercent || good.price | currency }} <span class="rub">₽</span>
            </span>
          </div>
          <div class="good__buy-button">
            <span>Купить</span>
          </div>
        </div>
      </div>
    </span>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: "Good",

  props: ["good", 'position', 'viewAnalitycs', 'documentWidth'],

  data() {
    return {
      isVisible: false,
      desktopWidth: 1000,
    }
  },
  computed: {
    ...mapState(['uuid', 'channels']),

    openUrl() {
      return this.good.merchantUrl || this.good.merchant_url || this.good.url || "";
    },
  },


  methods: {
    openTarget() {
      if (this.openUrl && window) {
        window.dataLayer = window.dataLayer || [];

        if (this.good.priceWithSalePercent) {
          window.dataLayer.push({
              'ecommerce': {
                'click': {
                 'actionField': { 'list': this.$route.name == 'index' ? 'Главная страница' :
                          (this.$route.name == 'stars' ? 'Стримы звезд' :
                          (this.$route.name == 'brands' ? 'Стримы брендов' :
                          (this.$route.path.startsWith('/stream/') ? 'страница стрима' : ''))) },
                'products': [{
                  'name': this.good.title,
                  'id': this.good.id,
                  'price': this.good.priceWithSalePercent,
                  'brand': this.good.merchant,
                  'category': this.getCategory(),
                  'list': this.$route.name == 'index' ? 'Главная страница' : (this.$route.name == 'stars' ? 'Стримы звезд' :
                    (this.$route.name == 'brands' ? 'Стримы брендов' :
                      (this.$route.path.startsWith('/stream/') ? 'страница стрима' : ''))),
                  'position': this.position || this.good.position
                }]
              },
            },
            'event': 'gtm-ee-event',
            'gtm-ee-event-category': 'Enhanced Ecommerce',
            'gtm-ee-event-action': 'Product Clicks',
            'gtm-ee-event-label': window.location.href,
            'gtm-ee-event-non-interaction': false
          });
      } else {
        window.dataLayer.push({
          'ecommerce': {
            'promoClick': {
              'promotions': [{
                'id': this.good.id,
                'name': this.good.title,
                'creative': '',
                'position': this.position || this.good.position
              }]
            }
          },
          'event': 'gtm-ee-event',
          'gtm-ee-event-category': 'Enhanced Ecommerce',
          'gtm-ee-event-action': 'Promo Click',
          'gtm-ee-event-label': window.location.href,
          'gtm-ee-event-non-interaction': false
        });
      }

      this.$emit('clickProduct')
      let newWindow = window.open(this.openUrl, '_blank')
      newWindow.focus()
    }
  },

  visibilityChanged(isVisible) {
    if (isVisible) {
      this.visibleImages()
    }

    this.isVisible = isVisible;
    if (isVisible && this.viewAnalitycs && window) {
      window.dataLayer = window.dataLayer || [];

      if (this.good.priceWithSalePercent) { // product
        window.dataLayer.push({
          'ecommerce': {
            'impressions': [{
              'name': this.good.title,
              'id': this.good.id,
              'price': this.good.priceWithSalePercent,
              'brand': this.good.merchant,
              'category': this.getCategory(),
              'list': this.$route.name == 'index' ? 'Главная страница' : (this.$route.name == 'stars' ? 'Стримы звезд' :
                (this.$route.name == 'brands' ? 'Стримы брендов' :
                  (this.$route.path.startsWith('/stream/') ? 'страница стрима' : ''))),
              'position': this.position || this.good.position
            }]
          },
          'event': 'gtm-ee-event',
          'gtm-ee-event-category': 'Enhanced Ecommerce',
          'gtm-ee-event-action': 'Product Impressions',
          'gtm-ee-event-label': window.location.href,
          'gtm-ee-event-non-interaction': true
        });
      } else { // banner
        window.dataLayer.push({
          'ecommerce': {
            'promoView': {
              'promotions': [{
                'id': this.good.id,
                'name': this.good.title,
                'creative': '',
                'position': this.position || this.good.position
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
  },

  visibleImages() {
    const images = this.$refs.good.querySelectorAll('img')
    images.forEach(img => {
      if (!img.src) {
        img.src = img.dataset.src
      }
    });
  }
}
};

</script>
