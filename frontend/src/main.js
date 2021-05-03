import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {BootstrapVue, IconsPlugin} from "bootstrap-vue";
import {store} from './store'

// CSS Import
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


// Boostrap available through the project
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
