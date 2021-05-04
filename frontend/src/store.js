import Vuex from "vuex";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";
import Vue from 'vue';
import createPersistedState from "vuex-persistedstate";
import * as SecureLS from "secure-ls";

let ls = new SecureLS({ isCompression: false });
Vue.use(Vuex);

export const store =  new Vuex.Store({
    state: {
        loggedIn: false,
        accessToken: null
    },
    getters,
    mutations,
    actions,
    plugins: [createPersistedState({
        storage: {
            getItem: (key) => ls.get(key),
            setItem: (key, value) => ls.set(key, value),
            removeItem: (key) => ls.remove(key),
        }
    })]
});