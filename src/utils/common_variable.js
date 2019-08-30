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
