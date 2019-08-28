//工具方法
import { Message, Loading, Notification } from "element-ui";

export function message({ message = "提示消息", type = "success", duration = 5000, showClose = true, center = true, ...res }) {
  Message({
    message,
    type,
    duration,
    showClose,
    center,
    ...res
  });
}

export function notification({ message = "提示消息", type = "success", duration = 0, position = "top-right", showClose = true, ...res }) {
  const notificationInstance = Notification({
    message,
    type,
    duration,
    showClose,
    position,
    ...res
  });
  return notificationInstance;
}

export function loading(options = { text: "loading" }) {
  const loadingService = Loading.service(options);
  return loadingService;
}

export function disabledDate(time) {
  return time.getTime() > Date.now();
}
