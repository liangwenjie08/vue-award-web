import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routers = new Router({
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
    }
  ]
});

export default routers;
