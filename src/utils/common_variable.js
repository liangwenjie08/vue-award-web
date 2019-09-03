import Vue from "vue";

export const store = Vue.observable({
  departmentList: []
});

export const mutations = {
  setDepartmentList(departmentList) {
    store.departmentList = departmentList;
  }
};


//默認請求條數
export const default_page_size = 50;
//當前時間，仅精确到天数时使用
export const today = new Date();
