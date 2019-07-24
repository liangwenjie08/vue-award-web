import Vue from "vue";
import App from "./App";
import routers from "@/router/routers";
import { Plugin } from "vue-fragment";
import { Button, Input, Menu, Submenu, MenuItem } from "element-ui";

Vue.use(Button);
Vue.use(Input);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Plugin);

new Vue({
  router: routers,
  render: h => h(App)
}).$mount("#root");
