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
        },
        {
          path: "configManagement/assItemConfig",
          component: () => import("@/views/configuration_management/assess_configuration.vue")
        },
        {
          path: "configManagement/shiftConf",
          component: () => import("@/views/configuration_management/shift_configuration.vue")
        },
        {
          path: "configManagement/machineConfig",
          component: () => import("@/views/configuration_management/machine_configuration.vue")
        },
        {
          path: "configManagement/machineType",
          component: () => import("@/views/configuration_management/machine_type_configuration.vue")
        },
        {
          path: "configManagement/outputType",
          component: () => import("@/views/configuration_management/output_type_configuration.vue")
        },
        {
          path: "configManagement/holidayConf",
          component: () => import("@/views/configuration_management/holiday_configuration.vue")
        },
        {
          path: "checkinout/import",
          component: () => import("@/views/center_control_attendance/dingding_attendance.vue")
        },
        {
          path: "trainManagement/trainingList",
          component: () => import("@/views/training_management/train_list.vue")
        },
        {
          path: "trainManagement/projectList",
          component: () => import("@/views/training_management/train_summary.vue")
        },
        {
          path: "position/list",
          component: () => import("@/views/textile_position_management/textile_position_list.vue")
        }
      ]
    }
  ]
});

export default routers;
