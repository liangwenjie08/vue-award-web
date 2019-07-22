import Vue from "vue";
import App from "./App";
import routers from "@/router/routers";
import { Button, Input } from "element-ui";

Vue.use(Button);
Vue.use(Input);

new Vue({
  router: routers,
  render: h => h(App)
}).$mount("#root");
