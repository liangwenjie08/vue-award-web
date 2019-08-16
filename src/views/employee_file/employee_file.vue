<template>
  <div id="employee_file">
    <div style="height: 150px;width: 200px;">
      <p>this is header</p>
    </div>
    <div style="height: 100%;">
      <table-box :data="employeeList">
        <el-table-column
          prop="empId"
          label="工號"
          width="80"
          fixed="left"
          align="center"
        />
        <el-table-column
          prop="empName"
          label="姓名"
          width="100"
          fixed="left"
          align="center"
        />
        <el-table-column
          prop="deptDesc"
          label="部門"
          width="120"
          fixed="left"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column
          prop="shift"
          label="班別"
          width="55"
          align="center"
        />
        <el-table-column
          prop="jobTitle"
          label="職務"
          width="80"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column
          prop="posDesc"
          label="崗位"
          width="90"
          align="center"
        />
        <el-table-column
          prop="gender"
          label="性別"
          width="60"
          align="center"
        />
        <el-table-column
          prop="birthday"
          label="年齡"
          width="100"
          align="center"
        />
        <el-table-column
          prop="height"
          label="身高"
          width="45"
          align="center"
        />
        <el-table-column
          prop="academic"
          label="學歷"
          width="45"
          align="center"
        />
        <el-table-column
          prop="domicilePlace"
          label="戶籍"
          width="65"
          align="center"
        />
        <el-table-column
          prop="birthday"
          label="出生日期"
          width="90"
          align="center"
        />
        <el-table-column
          prop="joinDate"
          label="入職日期"
          width="90"
          align="center"
        />
        <el-table-column
          prop="leaveDate"
          label="離職日期"
          width="90"
          align="center"
        />
        <el-table-column
          prop="isOnjob"
          label="離職"
          width="45"
          align="center"
        />
        <el-table-column
          prop="resignReason"
          label="離職原因"
          width="100"
          align="center"
        />
        <el-table-column
          prop="phone"
          label="手機號碼"
          width="100"
          align="center"
        />
        <el-table-column
          prop="idCard"
          label="身份證"
          width="160"
          align="center"
        />
        <el-table-column
          prop="description"
          label="備註"
          width="140"
          align="center"
        />
      </table-box>
    </div>
  </div>
</template>

<script>
  import { EMPLOYEE } from "@/api/employee_file";
  import { default_page_size } from "@/utils/common_variable";

  export default {
    name: "employee_file",
    data() {
      return {
        employeeList: []
      };
    },
    created() {
      this.getEmployeeList();
    },
    methods: {
      async getEmployeeList(pageNum = 1, pageSize = default_page_size) {
        let url = EMPLOYEE + `?isAdditional=true&status=1&pageNum=${ pageNum }&pageSize=${ pageSize }`;
        try {
          const res = await this.$axios.request({
            url,
            method: this.$axios.method.GET
          });
          console.log(res);
          this.employeeList = res.list;
        } catch(e) {
          this.employeeList = [];
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  #employee_file {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
</style>
