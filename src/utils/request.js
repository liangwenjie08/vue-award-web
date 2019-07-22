import axios from "axios";
import { Message } from "element-ui";

const baseURL = "https://easy-mock.com/mock/5d0da256be676b5daf4250ad/admin";
// 5 * 1000 ms
const timeout = 5000;
const tipsShowTime = 5000;

const request = axios.create({
  baseURL,
  timeout
});

request.interceptors.request.use(
  config => {
    let token = sessionStorage.getItem("token");
    if(token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => {
    console.log("================axios bug==============");
    console.error(error);
    console.log("=======================================");
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  response => {
    const res = response.data;
    if(res.status !== 200) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: tipsShowTime,
        center: true
      });
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  error => {
    console.log("================axios bug==============");
    console.error(error);
    console.log("=======================================");
    Message({
      message: error.message,
      type: "error",
      duration: tipsShowTime,
      center: true
    });
    return Promise.reject(error);
  }
);

export default request;
