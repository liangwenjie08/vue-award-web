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
//考勤假期類型
export const holiday_type = [
  {
    code: "1011",
    description: "事假"
  }, {
    code: "1014",
    description: "全薪病假"
  }, {
    code: "1013",
    description: "无薪病假"
  }, {
    code: "1015",
    description: "婚假"
  }, {
    code: "1016",
    description: "喪假"
  }, {
    code: "1017",
    description: "產假"
  }, {
    code: "1022",
    description: "年假"
  }, {
    code: "1023",
    description: "補休"
  }, {
    code: "1024",
    description: "曠工"
  }, {
    code: "1018",
    description: "哺乳假"
  }, {
    code: "1019",
    description: "工傷假"
  }, {
    code: "1020",
    description: "計劃生育假"
  }];
