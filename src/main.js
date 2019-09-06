import Vue from "vue";
import App from "./App";
import routers from "@/router/routers";
import { Plugin } from "vue-fragment";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  Button,
  ButtonGroup,
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
  RadioGroup,
  Tooltip
} from "element-ui";
import TableBox from "@/components/TableBox";
import { message, loading, notification } from "@/utils/utility_class";
import axios from "@/utils/axios";
import FileUpload from "@/components/FileUpload";
import FileDownload from "@/components/FileDownload";
import Delete from "@/components/Delete";
import BatchDelete from "@/components/BatchDelete";
import Department from "@/components/Department";
import TextileDepartment from "@/components/TextileDepartment.vue";
import TableAndFormLayout from "@/components/layout/TableAndFormLayout.vue";

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
Vue.use(Tooltip);
Vue.use(ButtonGroup);

Vue.component("treeselect", Treeselect);
Vue.component("file-upload", FileUpload);
Vue.component("file-download", FileDownload);
Vue.component("delete-button", Delete);
Vue.component("department", Department);
Vue.component("textile-department", TextileDepartment);
Vue.component("batch-delete-button", BatchDelete);
Vue.component("table-form-layout", TableAndFormLayout);

Vue.prototype.$ELEMENT = { size: "small" };
Vue.component("table-box", TableBox);
Vue.use(Plugin);

Vue.prototype.$axios = axios;
Vue.prototype.$message = message;
Vue.prototype.$loading = loading;
Vue.prototype.$notification = notification;

//日期格式化
Date.prototype.format = function(format) {
  if(typeof format === "undefined") {
    console.error("請輸入需要的格式");
  } else {
    const date = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      "S+": this.getMilliseconds()
    };
    if(/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for(let k in date) {
      if(new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1
          ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
      }
    }
    return format;
  }
};

new Vue({
  router: routers,
  render: h => h(App)
}).$mount("#root");
