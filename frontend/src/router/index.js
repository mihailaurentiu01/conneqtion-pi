import Vue from 'vue'
import VueRouter from 'vue-router'
import SecureLS from 'secure-ls';

Vue.use(VueRouter)

// TODO MIGRATE TO VUEX
const routes = [
  {
    path: "/",
    redirect: "/auth"
  },
  {
    path: '/auth',
    component: () => import("@/components/Auth.vue"),
    children: [
      {path: "", name: "Login", component: () => import("@/views/Login.vue")},
      {path: "signup", name: "SignUp", component: () => import("@/views/SignUp.vue")}
    ],
    beforeEnter: (to, from, next) => {
      let ls = new SecureLS({isCompression: false});
      let vuex = ls.get("vuex");

      if (vuex.length > 0) vuex = JSON.parse(ls.get("vuex"));

      if (vuex.loggedIn && vuex.accessToken){
        return next({name: "Index"})
      }

      next();
    }
  },
  {
    path: "/terms",
    name: "terms",
    component: () => import("@/views/Terms")
  },
  {
    path: "/privacy",
    name: "privacy",
    component: () => import("@/views/PrivacyPolicy")
  },
  {
    path: "/index",
    name: "Index",
    component: () => import("@/views/Index"),
    beforeEnter: (to, from, next) => {
      let ls = new SecureLS({isCompression: false});
      let vuex = ls.get("vuex");

      if (vuex.length > 0) vuex = JSON.parse(ls.get("vuex"));
      else next({to: "/auth", params: {error: "You must login first"}});

      if (!vuex.loggedIn || !vuex.accessToken){
       return next({name: "Login", params: {error: "You must login first"}})
      }

      next();
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
