//工具方法
import { Message, Loading } from "element-ui";

export function message({ message = "提示消息", type = "success", duration = 4000, showClose = true, center = true }) {
  Message({
    message,
    type,
    duration,
    showClose,
    center
  });
}

export function loading(options = { text: "loading" }) {
  let loadingService = Loading.service(options);
  return loadingService;
}
