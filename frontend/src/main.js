import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {BootstrapVue, IconsPlugin} from "bootstrap-vue";
import {store} from './store'
import VueSocketIOExt from 'vue-socket.io-extended';
import {io} from 'socket.io-client';
import VueSnackbar from 'vue-snack';

// CSS Import
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-snack/dist/vue-snack.min.css'
import {mapMutations} from "vuex";

// Boostrap available through the project
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

// Socket IO and snackbar
Vue.use(VueSocketIOExt, io("http://localhost:3000"))
Vue.use(VueSnackbar, {position: "bottom", time: 3000});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
