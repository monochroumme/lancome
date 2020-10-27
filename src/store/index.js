import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    widgetData: null
  },
  mutations: {
    setWidgetData(state, payload) {
      state.widgetData = payload.sort((a, b) => {
        return new Date(b.stream.startAt) - new Date(a.stream.startAt)
      })
    }
  },
  actions: {
    async getWidgetData({commit}, payload) {
      const res = await axios.get(`https://widget.live.24ttl.stream/${payload.brand}/${payload.domain}/${payload.templateType}/${payload.resultType}/${payload.contentType}/data.json`);
      if (res && res.data)
        commit('setWidgetData', res.data);
    }
  },
  modules: {}
})
