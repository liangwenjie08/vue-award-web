import axios from "axios";
import { Message } from "element-ui";
import { saveAs } from "file-saver";

//easy mock
// const baseURL = "https://easy-mock.com/mock/5d0da256be676b5daf4250ad/admin";
//dev 服务器
const baseURL = "http://172.16.234.157:8000/award";
//源权 服务器
// const baseURL = "http://172.30.20.122:8929/award";
//先员 服务器
// const baseURL = "http://172.30.20.29:8928/award";

//请求方法
const method = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
  PUT: "PUT"
};

// 15 * 1000 ms
const timeout = 15000;
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
    const { config: { responseType }, data: res } = response;
    if(responseType && responseType === "blob") {
      if(res.type && res.type !== "application/json") {
        try {
          const headers = response.headers;
          const contentDisposition = headers["content-disposition"];
          const filename = contentDisposition.split("=")[1];
          saveAs(res, filename || "template.xls");
          Message({
            message: "下載成功",
            type: "success",
            duration: tipsShowTime,
            center: true
          });
          return Promise.resolve();
        } catch(e) {
          Message({
            message: e || "Error",
            type: "error",
            duration: tipsShowTime,
            center: true
          });
          return Promise.reject("保存文件失敗");
        }
      } else {
        res.text().then((jsonDataStr) => {
          const jsonData = JSON.parse(jsonDataStr);
          Message({
            message: jsonData.message || "Error",
            type: "error",
            duration: tipsShowTime,
            center: true
          });
        });
        return Promise.reject("文件下載失敗");
      }
    } else {
      if(res.status === 200 || typeof res.access_token !== "undefined") {
        if(typeof res.access_token !== "undefined") {
          return res;
        }
        const data = res.data;
        return data;
      } else {
        if(res.status === 400) {
          Message({
            message: res.message || "Error",
            type: "warning",
            duration: tipsShowTime,
            center: true
          });
        } else {
          Message({
            message: res.message || "Error",
            type: "error",
            duration: tipsShowTime,
            center: true
          });
        }
        return Promise.reject(new Error(res.message || "Error"));
      }
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
