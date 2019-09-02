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
        },
        {
          path: "employee/files",
          component: () => import("@/views/employee_file/employee_file.vue")
        },
        {
          path: "dept/positionList",
          component: () => import("@/views/position_management/position_list.vue")
        },
        {
          path: "bonus/bonusList",
          component: () => import("@/views/bonus_management/position_bonus_list.vue")
        },
        {
          path: "bonus/allowancemaster",
          component: () => import("@/views/bonus_management/bonus_item_list.vue")
        },
        {
          path: "bonus/employee/bonusList",
          component: () => import("@/views/bonus_management/employee_bonus_list.vue")
        }
      ]
    }
  ]
});

export default routers;
