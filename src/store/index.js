import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    quotes_list: [],
  },
  getters: {
    getQuotesList(state) {
      return state.quotes_list;
    },
  },
  mutations: {
    setQuotesList(state, val) {
      state.quotes_list = val;
    },
  },
  actions: {},
  modules: {},
});
