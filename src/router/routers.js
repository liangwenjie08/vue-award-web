import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routers = new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      redirect: () => {
        return "/login";
      }
    },
    {
      path: "/login",
      component: () => import("@/views/login/login.vue")
    },
    {
      path: "/award",
      component: () => import("@/views/home/home.vue")
    }
  ]
});

export default routers;
