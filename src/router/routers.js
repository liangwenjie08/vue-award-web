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
      path: "/mes/",
      component: () => import("@/views/layout/layout.vue"),
      children: [
        {
          path: "/",
          component: () => import("@/views/home/home.vue")
        },
        {
          path: "employee/list",
          component: () => import("@/views/employee_management/employee_list.vue")
        }
      ]
    }
  ]
});

export default routers;
