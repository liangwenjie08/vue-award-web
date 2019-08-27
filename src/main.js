import Vue from "vue";
import App from "./App";
import routers from "@/router/routers";
import { Plugin } from "vue-fragment";
import {
  Button,
  Input,
  Menu,
  Submenu,
  MenuItem,
  TableColumn,
  Table,
  Pagination,
  Cascader,
  Select,
  Option,
  DatePicker,
  Checkbox,
} from "element-ui";
import TableBox from "@/components/TableBox";
import { message, loading } from "@/utils/utility_class";
import axios from "@/utils/axios";

Vue.use(Pagination);
Vue.use(Button);
Vue.use(Input);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Cascader);
Vue.use(Select);
Vue.use(Option);
Vue.use(DatePicker);
Vue.use(Checkbox);

Vue.prototype.$ELEMENT = { size: "small" };
Vue.component("table-box", TableBox);
Vue.use(Plugin);

Vue.prototype.$axios = axios;
Vue.prototype.$message = message;
Vue.prototype.$loading = loading;

new Vue({
  router: routers,
  render: h => h(App)
}).$mount("#root");
