import Vue from "vue";
import VueRouter from "vue-router";
import QuoteOnePageVue from "../views/QuoteOnePage.vue";
import QuotesPage from "../views/QuotesPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: QuotesPage,
  },

  {
    path: "/quote/:id",
    name: "QuotePage",
    component: QuoteOnePageVue,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
