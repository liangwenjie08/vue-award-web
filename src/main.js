import Vue from "vue";
import App from "./App";
import routers from "@/router/routers";
import { Plugin } from "vue-fragment";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  Button,
  Input,
  InputNumber,
  Menu,
  Submenu,
  MenuItem,
  TableColumn,
  Table,
  Pagination,
  Select,
  Option,
  DatePicker,
  Checkbox,
  Popover,
  Dialog,
  Radio,
  RadioGroup
} from "element-ui";
import TableBox from "@/components/TableBox";
import { message, loading, notification } from "@/utils/utility_class";
import axios from "@/utils/axios";
import FileUpload from "@/components/FileUpload";
import FileDownload from "@/components/FileDownload";
import Delete from "@/components/Delete";
import Department from "@/components/Department";

Vue.use(Pagination);
Vue.use(Button);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Select);
Vue.use(Option);
Vue.use(DatePicker);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Checkbox);
Vue.use(Popover);
Vue.use(Dialog);

Vue.component("treeselect", Treeselect);
Vue.component("file-upload", FileUpload);
Vue.component("file-download", FileDownload);
Vue.component("delete-button", Delete);
Vue.component("department", Department);

Vue.prototype.$ELEMENT = { size: "small" };
Vue.component("table-box", TableBox);
Vue.use(Plugin);

Vue.prototype.$axios = axios;
Vue.prototype.$message = message;
Vue.prototype.$loading = loading;
Vue.prototype.$notification = notification;

new Vue({
  router: routers,
  render: h => h(App)
}).$mount("#root");
