import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import app from "./modules/app";
import settings from "./modules/settings";
import user from "./modules/user/user";
import flowable from "./modules/flowable";

import bpmn from "./modules/bpmn";
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    bpmn,
    user,
    flowable
  },
  getters
});

export default store;
