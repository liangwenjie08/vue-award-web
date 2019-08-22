<template>
  <div id="employee_file">
    <div class="header">
      <el-button style="background-color: #5CB85C;" type="primary" icon="el-icon-plus">增加</el-button>
      <el-button style="background-color: red;" type="primary" icon="el-icon-delete-solid">刪除</el-button>
      <el-button style="background-color: #5BC0DE;" type="primary" icon="el-icon-edit">更新</el-button>
      <el-button style="background-color: #418DCF;" type="primary" icon="el-icon-document">查看明細</el-button>
      <el-button style="background-color: #418DCF;" type="primary" icon="el-icon-upload2">批量録入</el-button>
      <el-button style="background-color: #418DCF;" type="primary" icon="el-icon-download">模板下載</el-button>
      <el-button style="background-color: #418DCF;" type="primary" icon="el-icon-download">導出Excel</el-button>
      <el-button style="background-color: #53C0B0;" type="primary" icon="el-icon-download">報表統計</el-button>

    </div>
    <div style="height: 100%;">
      <table-box :data="employeeList">
        <el-table-column
          prop="empId"
          label="工號"
          width="85"
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
          width="100"
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
    <el-pagination
      background
      :total="total"
      :current-page="pageNum"
      :page-size="pageSize"
      :page-sizes="[50, 100, 200]"
      layout="total, prev, pager, next, sizes"
    />
  </div>
</template>

<script>
  import { EMPLOYEE } from "@/api/employee_file";
  import { default_page_size } from "@/utils/common_variable";

  export default {
    name: "employee_file",
    data() {
      return {
        employeeList: [],
        pageNum: 1,
        pageSize: 50,
        total: 0
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
          this.employeeList = res.list;
          this.total = res.total;
          this.pageNum = res.pageNum;
          this.pageSize = res.pageSize;
          this.$nextTick(function() {
            this.$refs.tableBoxRef.doLayout();
          });
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

    .header {
      padding: 0 0 20px 0;
    }
  }
</style>
