import Vue from "vue";
import App from "./App";
import routers from "@/router/routers";
import { Plugin } from "vue-fragment";
import { Button, Input, Menu, Submenu, MenuItem, TableColumn, Table } from "element-ui";
import TableBox from "@/components/TableBox";
import { message, loading } from "@/utils/utility_class";
import axios from "@/utils/axios";

Vue.use(Button);
Vue.use(Input);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.component("table-box", TableBox);
Vue.use(Plugin);

Vue.prototype.$axios = axios;
Vue.prototype.$message = message;
Vue.prototype.$loading = loading;

new Vue({
  router: routers,
  render: h => h(App)
}).$mount("#root");
