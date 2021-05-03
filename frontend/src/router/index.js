import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/auth',
    component: () => import("@/components/Auth.vue"),
    children: [
      {path: "", name: "Login", component: () => import("@/views/Login.vue")},
      {path: "signup", name: "SignUp", component: () => import("@/views/SignUp.vue")}
    ]
  },
  {
    path: "/terms",
    component: () => import("@/views/Terms")
  },
  {
    path: "/privacy",
    component: () => import("@/views/PrivacyPolicy")
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
