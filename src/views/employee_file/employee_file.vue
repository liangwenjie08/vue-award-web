<template>
  <div id="employee_file">
    <div class="header">
      <div class="header-button">
        <el-button style="background-color: #5CB85C;" type="primary" icon="el-icon-plus">增加</el-button>
        <el-button style="background-color: red;" type="primary" icon="el-icon-delete-solid">刪除</el-button>
        <el-button style="background-color: #5BC0DE;" type="primary" icon="el-icon-edit">更新</el-button>
        <el-button style="background-color: #418DCF;" type="primary" icon="el-icon-document">查看明細</el-button>
        <el-button style="background-color: #418DCF;" type="primary" icon="el-icon-upload2">批量録入</el-button>
        <el-button style="background-color: #418DCF;" type="primary" icon="el-icon-download">模板下載</el-button>
        <el-button style="background-color: #418DCF;" type="primary" icon="el-icon-download">導出Excel</el-button>
        <el-button style="background-color: #53C0B0;" type="primary" icon="el-icon-download">報表統計</el-button>
      </div>
      <div class="header-search">
        <div class="header-search-top">
          <el-cascader
            @change="getEmployeeList()"
            v-model="deptId"
            placeholder="部門"
            clearable
            :show-all-levels="false"
            filterable
            :options="deptList"
            :props="{expandTrigger: 'hover', label: 'name', value: 'id', checkStrictly: true}"
            style="width: 120px;"
          />
          <el-input @keyup.enter.native="getEmployeeList()" v-model="deptDesc" class="left-distance"
                    style="width: 130px;" placeholder="部門模糊查詢" clearable />
          <el-select @change="getEmployeeList()" class="left-distance" style="width: 120px;"
                     placeholder="離職原因" v-model="resignReason" clearable>
            <el-option
              v-for="item of leaveReasonList"
              :key="item"
              :value="item"
            />
          </el-select>
          <el-input @keyup.enter.native="getEmployeeList()" v-model="empId" clearable
                    class="left-distance" style="width: 120px;" placeholder="工號" />
          <el-input @keyup.enter.native="getEmployeeList()" v-model="empName" clearable
                    class="left-distance" style="width: 100px;" placeholder="姓名" />
          <el-select @change="getEmployeeList()" class="left-distance" style="width: 120px;"
                     placeholder="職務狀態" v-model="isOnjob" clearable>
            <el-option
              v-for="item of isOnjobList"
              :key="item.value"
              :value="item.value"
              :label="item.lable"
            />
          </el-select>
        </div>
        <div class="header-search-bottom">
          <el-date-picker @change="getEmployeeList()" v-model="joinDate" format="yyyyMMdd" type="daterange" clearable
                          value-format="yyyy-MM-dd" :validate-event="false" range-separator="至"
                          start-placeholder="入職開始日期"
                          end-placeholder="入職結束日期" style="width: 270px;"
          />
          <el-date-picker class="left-distance" @change="getEmployeeList()" v-model="leaveDate" format="yyyyMMdd"
                          type="daterange" clearable value-format="yyyy-MM-dd" :validate-event="false"
                          range-separator="至" start-placeholder="離職開始日期" end-placeholder="離職結束日期" style="width: 270px;"
          />
          <el-checkbox style="margin-left: 20px;" v-model="multipleChoice">多選</el-checkbox>
        </div>
      </div>
    </div>
    <div style="height: 100%;">
      <table-box @selection-change="selectedRow" @current-change="selectedRow" highlight-current-row
                 :data="employeeList">
        <el-table-column
          v-if="multipleChoice"
          type="selection"
          width="40"
        />
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
      @size-change="sizeChange($event)"
      @current-change="pageChange($event)"
    />
  </div>
</template>

<script>
  import { EMPLOYEE, SEARCH_DEPARTMENT_LIST } from "@/api/employee_file";
  import { default_page_size } from "@/utils/common_variable";

  export default {
    name: "employee_file",
    data() {
      return {
        //表格列表
        employeeList: [],
        //头部搜索部门列表
        deptList: [],
        //离职原因列表
        leaveReasonList: ["解僱", "有身孕", "自動離職", "有事回家", "身體不適", "工作壓力大"],
        //是否在職列表
        isOnjobList: [{ lable: "在職", value: true }, { lable: "離職", value: false }],
        pageNum: 1,
        pageSize: 50,
        total: 0,
        deptId: undefined,
        deptDesc: undefined,
        resignReason: undefined,
        empId: undefined,
        empName: undefined,
        isOnjob: true,
        joinDate: [],
        leaveDate: [],
        //表格是否需要重新計算寬度
        doLayout: true,
        //表格是否多選，多選為true
        multipleChoice: false
      };
    },
    created() {
      this.getEmployeeList();
      this.getDeptList();
    },
    methods: {
      async getEmployeeList() {
        //请求参数
        const {
          pageNum = 1, pageSize = default_page_size, deptId = 49, deptDesc,
          resignReason, isOnjob, empId, empName, joinDate, leaveDate
        } = this;
        const [joinStartDate, joinEndDate] = joinDate || [];
        const [leaveStartDate, leaveEndDate] = leaveDate || [];
        try {
          const res = await this.$axios.request({
            url: EMPLOYEE,
            method: this.$axios.method.GET,
            params: {
              isAdditional: true,
              status: 1,
              pageNum,
              pageSize,
              deptId,
              deptDesc,
              resignReason,
              isOnjob,
              empId,
              empName,
              joinStartDate,
              joinEndDate,
              leaveStartDate,
              leaveEndDate
            }
          });
          this.employeeList = res.list;
          this.total = res.total;
          this.pageNum = res.pageNum;
          this.pageSize = res.pageSize;
          if(this.doLayout) {
            this.$nextTick(function() {
              this.$refs.tableBoxRef.doLayout();
            });
            this.doLayout = false;
          }
        } catch(e) {
          this.employeeList = [];
        }
      },
      async getDeptList() {
        try {
          const res = await this.$axios.request({
            url: SEARCH_DEPARTMENT_LIST,
            method: this.$axios.method.GET,
            params: {
              deptIds: 49,
              tree: true
            }
          });
          //将 children = [] 置为 children = undefined
          this.handleDeptList(res);
          this.deptList = res;
        } catch(e) {
          this.deptList = [];
        }
      },
      handleDeptList(data) {
        const dataLen = data.length;
        if(typeof data !== "undefined" && dataLen > 0) {
          for(let i = 0; i < dataLen; i ++) {
            const children = data[i].children;
            if(children.length === 0) {
              data[i].children = undefined;
            } else {
              this.handleDeptList(children);
            }
          }
        }
      },
      sizeChange(size) {
        this.pageSize = size;
        this.$nextTick(this.getEmployeeList);
      },
      pageChange(page) {
        this.pageNum = page;
        this.$nextTick(this.getEmployeeList);
      },
      selectedRow(rowData) {
        console.log(rowData);
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
      padding: 0 0 15px 0;

      .header-button {
        padding-bottom: 10px;
      }

      .header-search {
        .header-search-top {
          display: flex;
          flex-flow: row wrap;
        }

        .header-search-bottom {
          display: flex;
          flex-flow: row wrap;
          align-items: center;
          padding-top: 10px;
        }

        .left-distance {
          margin-left: 5px;
        }
      }
    }
  }
</style>
