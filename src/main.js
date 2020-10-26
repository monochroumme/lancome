import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import VueLazyload from 'vue-lazyload'
import VueObserveVisibility from 'vue-observe-visibility'
import VueCurrencyFilter from 'vue-currency-filter'

const moment = require('moment');
Vue.use(require('vue-moment'), {
	moment
});
require('moment/locale/ru');

Vue.use(VueLazyload);
Vue.use(VueObserveVisibility)
Vue.use(VueCurrencyFilter)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
