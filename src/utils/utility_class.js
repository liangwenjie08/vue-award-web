//工具方法
import { Message, Loading, Notification } from "element-ui";

//消息提示
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

//通知
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

//正在加载（全屏）
export function loading(options = { text: "loading" }) {
  const loadingService = Loading.service(options);
  return loadingService;
}

//禁用今天之后的日期
export function disabledDate(time) {
  return time.getTime() > Date.now();
}

//前端分頁函數
export function frontEndPagination(data = [], page = 1, size = 50) {
  const total = data.length;
  if(total > 0) {
    const start = (page - 1) * size;
    const end = page * size;
    const paginationData = data.slice(start, total >= end ? end : total);
    return paginationData;
  } else {
    return [];
  }
}
