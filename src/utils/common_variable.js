import Vue from "vue";

export const store = Vue.observable({
  //QM奖金部门列表
  departmentList: [],
  //纺织厂部门列表
  textileDepartmentList: []
});

export const mutations = {
  setDepartmentList(departmentList) {
    store.departmentList = departmentList;
  },
  setTextileDepartmentList(textileDepartmentList) {
    store.textileDepartmentList = textileDepartmentList;
  }
};


//默認請求條數
export const default_page_size = 50;
//當前時間，仅精确到天数时使用
export const today = new Date();
