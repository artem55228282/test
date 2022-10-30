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
    getQuoteById: (state) => (id) => {
      return state.quotes_list.find((quote) => quote.id === id);
    },
  },
  mutations: {
    setQuotesList(state, val) {
      state.quotes_list = val;
    },
    addQuote(state, val) {
      state.quotes_list.push(val);
    },
    deleteQuote(state, val) {
      state.quotes_list.forEach((el, idx) => {
        if (el.id === val.id) {
          state.quotes_list.splice(idx, 1);
          return;
        }
      });
    },
    updateQuote(state, val) {
      state.quotes_list.forEach((el, idx) => {
        if (el.id === val.id) {
          console.log(state.quotes_list[idx]);
          state.quotes_list[idx] = val;
          return;
        }
      });
    },
  },
  actions: {
    addQuote(state, val) {
      console.log("PUSHHHH Actions", val);
      state.quotes_list.push(val);
    },
  },
  modules: {},
});
