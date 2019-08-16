import axios from "axios";
import { Message } from "element-ui";

//easy mock
// const baseURL = "https://easy-mock.com/mock/5d0da256be676b5daf4250ad/admin";
//dev 服务器
const baseURL = "http://172.16.234.157:8000/award";
//源权 服务器
// const baseURL = "http://172.30.20.122:8929/award";

//请求方法
const method = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
  PUT: "PUT"
};

// 5 * 1000 ms
const timeout = 5000;
const tipsShowTime = 5000;

const request = axios.create({
  baseURL,
  timeout
});
//用户token
let token = null;
request.interceptors.request.use(
  config => {
    if(!token) {
      token = sessionStorage.getItem("token");
    }
    if(token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  error => {
    console.log("================request axios bug==============");
    console.error(error);
    console.log("=======================================");
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  response => {
    const res = response.data;
    if(res.status === 200 || typeof res.access_token !== "undefined") {
      if(typeof res.access_token !== "undefined") {
        return res;
      }
      const data = res.data;
      return data;
    } else {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: tipsShowTime,
        center: true
      });
      return Promise.reject(new Error(res.message || "Error"));
    }
  },
  error => {
    console.log("================response axios bug==============");
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

export default { request, method };
