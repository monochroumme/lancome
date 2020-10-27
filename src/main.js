import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import VueLazyload from 'vue-lazyload'
import VueObserveVisibility from 'vue-observe-visibility'
import VueCurrencyFilter from 'vue-currency-filter'
import VBodyScrollLock from 'v-body-scroll-lock'

const moment = require('moment');
require('moment/locale/ru');

Vue.use(require('vue-moment'), {
	moment
});

Vue.use(VueLazyload);
Vue.use(VueObserveVisibility)
Vue.use(VueCurrencyFilter)
Vue.use(VBodyScrollLock)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
