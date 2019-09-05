<template>
  <div class="employee-list">
    <div class="header">
      <el-button @click="addAndUpdateBtnHandler(false)" style="background-color: #53C0B0;" type="primary"
                 icon="el-icon-plus">
        增加
      </el-button>
      <el-button @click="addAndUpdateBtnHandler(true)" style="background-color: #5BC0DE;" type="primary"
                 icon="el-icon-edit">
        更新
      </el-button>
      <delete-button :deleteCallback="getEmployeeList" description-key="empName" id-key="empId"
                     :selected-data="selectedData" :url="employeeURL" />
      <file-upload :url="importURL" />
      <file-download :url="downloadTemplateURL" />
    </div>
    <div class="table">
      <table-box @current-change="selectedRow" :data="paginationData" highlight-current-row>
        <el-table-column
          min-width="65"
          prop="empId"
          label="工號"
          align="center"
        />
        <el-table-column
          min-width="60"
          prop="empName"
          label="姓名"
          align="center"
        />
        <el-table-column
          min-width="90"
          prop="deptDesc"
          label="部門"
          align="center"
        />
        <el-table-column
          min-width="90"
          prop="posDesc"
          label="崗位"
          align="center"
        />
        <el-table-column
          min-width="50"
          prop="placardNums"
          label="考牌數"
          align="center"
        />
        <el-table-column
          min-width="85"
          prop="phone"
          label="手機號"
          align="center"
        />
        <el-table-column
          min-width="55"
          prop="isRejoin"
          label="二次入職"
          align="center"
          :formatter="isRejoinFormatter"
        />
        <el-table-column
          min-width="55"
          prop="isSpec"
          label="特殊人員"
          align="center"
          :formatter="isSpecFormatter"
        />
        <el-table-column
          min-width="75"
          prop="joinDate"
          label="入職日期"
          align="center"
        />
        <el-table-column
          min-width="75"
          prop="leaveDate"
          label="離職日期"
          align="center"
        />
      </table-box>
    </div>
    <el-pagination
      background
      :total="total"
      :page-sizes="[50, 100, 200]"
      layout="total, prev, pager, next, sizes"
      :current-page="pageNum"
      :page-size="pageSize"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
    <el-dialog width="50%" :title="`${isUpdateOperation ? '更新' : '新增'}員工信息`" :visible.sync="dialogVisible">
      <div class="dialog-row-item">
        <div class="dialog-cell-item">
          <span class="span-distance">員工編號</span>
          <el-input :disabled="isUpdateOperation" clearable v-model="empId" placeholder="員工編號"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">員工姓名</span>
          <el-input clearable v-model="empName" placeholder="員工姓名"></el-input>
        </div>
      </div>
      <div class="dialog-row-item">
        <div class="dialog-cell-item">
          <span class="span-distance">手機號碼</span>
          <el-input clearable v-model="phone" placeholder="手機號碼"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">考牌數</span>
          <el-input-number :min="0" style="width: 100%;" :controls="false"
                           v-model="placardNums" placeholder="考牌數"></el-input-number>
        </div>
      </div>
      <div class="dialog-row-item">
        <div class="dialog-cell-item">
          <span class="span-distance">部門</span>
          <department @input="deptChange" v-model="deptId"></department>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">崗位</span>
          <el-select v-model="posId" placeholder="崗位">
            <el-option
              :key="item.posId"
              :label="item.posDesc"
              :value="item.posId"
              v-for="item of positionList"
            />
          </el-select>
        </div>
      </div>
      <div class="dialog-row-item">
        <div class="dialog-cell-item">
          <span class="span-distance">入職日期</span>
          <el-date-picker clearable :picker-options="pickerOptions" style="width: 100%;" v-model="joinDate"
                          placeholder="入職日期" value-format="yyyy-MM-dd" format="yyyyMMdd" />
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance"><el-checkbox v-model="isDimission">是否離職</el-checkbox></span>
          <el-date-picker clearable :disabled="!isDimission" :picker-options="pickerOptions" style="width: 100%;"
                          v-model="leaveDate" placeholder="離職日期" value-format="yyyy-MM-dd" format="yyyyMMdd" />
        </div>
      </div>
      <div class="dialog-row-item">
        <div class="dialog-cell-item">
          <span class="span-distance">是否二次入職</span>
          <el-radio-group v-model="isRejoin">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">是否特殊人員</span>
          <el-radio-group v-model="isSpec">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button style="background-color: #418DCF;" type="primary" @click="addAndUpdateAxios">
          {{this.isUpdateOperation ? "更 新" : "确 定"}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  //API
  import { DOWNLOAD_TEMPLATE, EMPLOYEE, IMPORT, POSITION } from "@/api/employee_list";
  import { disabledDate, frontEndPagination } from "@/utils/utility_class";

  export default {
    name: "employee_list",
    data() {
      return {
        isClick: false,
        employeeList: [],
        //分頁之後顯示在表格中的數據
        paginationData: [],
        positionList: [],
        pageNum: 1,
        pageSize: 50,
        deleteConfirmVisible: false,
        selectedData: null,
        //是否是更新操作，更新為true，新增為 false
        isUpdateOperation: false,
        dialogVisible: false,
        pickerOptions: {
          disabledDate
        },
        //新增和更新的請求參數
        empName: "",
        empId: "",
        deptId: undefined,
        posId: undefined,
        isRejoin: 0,
        isSpec: 0,
        phone: "",
        placardNums: 0,
        joinDate: undefined,
        leaveDate: undefined,
        isDimission: false
      };
    },
    computed: {
      total() {
        return this.employeeList.length;
      },
      downloadTemplateURL() {
        return DOWNLOAD_TEMPLATE;
      },
      importURL() {
        return IMPORT;
      },
      employeeURL() {
        return EMPLOYEE;
      }
    },
    created() {
      this.getEmployeeList();
    },
    methods: {
      async getEmployeeList() {
        try {
          this.employeeList = await this.$axios.request({
            url: EMPLOYEE
          });
          this.getPaginationData(this.pageNum, this.pageSize);
        } catch(e) {
          this.employeeList = [];
          this.paginationData = [];
        }
      },
      addAndUpdateBtnHandler(isUpdateOperation) {
        if(isUpdateOperation) {
          if(!this.selectedData) {
            this.$message({
              message: "請選擇要修改的數據!",
              type: "error"
            });
            return null;
          }
          const { empName, empId, deptId, posId, isRejoin, isSpec, phone, placardNums, joinDate, leaveDate, isOnjob } = this.selectedData;
          this.empName = empName;
          this.empId = empId;
          this.deptId = deptId;
          this.posId = posId;
          this.isRejoin = isRejoin;
          this.isSpec = isSpec;
          this.phone = phone;
          this.placardNums = placardNums;
          this.joinDate = joinDate;
          this.leaveDate = leaveDate;
          this.isDimission = isOnjob === 0;
          this.deptChange();
          this.$nextTick(function() {
            this.posId = posId;
          });
        } else {
          this.empName = "";
          this.empId = "";
          this.deptId = undefined;
          this.posId = undefined;
          this.isRejoin = 0;
          this.isSpec = 0;
          this.phone = "";
          this.placardNums = 0;
          this.joinDate = undefined;
          this.leaveDate = undefined;
          this.isDimission = false;
        }
        this.dialogVisible = true;
        this.isUpdateOperation = isUpdateOperation;
      },
      async addAndUpdateAxios() {
        const { empName, empId, deptId, posId, isRejoin, isSpec, phone, placardNums, joinDate, leaveDate, isDimission, isUpdateOperation } = this;
        if(!empId) {
          this.$message({
            message: "員工編號不能為空！",
            type: "error"
          });
          return null;
        }
        if(empId.length !== 8) {
          this.$message({
            message: "員工編號應為8位！",
            type: "error"
          });
          return null;
        }
        if(!empName) {
          this.$message({
            message: "員工姓名不能為空！",
            type: "error"
          });
          return null;
        }
        if(phone) {
          if(!(/^1[34578]\d{9}$/.test(phone))) {
            this.$message({
              message: "手机号码有误，请重填！",
              type: "error"
            });
            return null;
          }
        }
        if(!deptId) {
          this.$message({
            message: "部門不能為空！",
            type: "error"
          });
          return null;
        }
        if(!posId) {
          this.$message({
            message: "崗位不能為空！",
            type: "error"
          });
          return null;
        }
        if(isDimission) {
          if(!leaveDate) {
            this.$message({
              message: "離職日期不能為空！",
              type: "error"
            });
            return null;
          }
        }
        if(this.isClick) {
          return null;
        }
        this.isClick = true;
        try {
          const { request, method } = this.$axios;
          let url = EMPLOYEE;
          if(isUpdateOperation) {
            url += `/${ empId }`;
          }
          await request({
            url,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: {
              empName,
              empId,
              deptId,
              posId,
              isRejoin,
              isSpec,
              phone,
              placardNums,
              joinDate,
              leaveDate,
              isOnjob: + !isDimission
            }
          });
          this.$message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          this.dialogVisible = false;
          this.getEmployeeList();
        } finally {
          this.isClick = false;
        }
      },
      sizeChange(size) {
        this.pageSize = size;
        this.getPaginationData(this.pageNum, size);
      },
      pageChange(page) {
        this.pageNum = page;
        this.getPaginationData(page, this.pageSize);
      },
      getPaginationData(page, size) {
        this.paginationData = frontEndPagination(this.employeeList, page, size);
      },
      isRejoinFormatter(row) {
        let isRejoin = "";
        if(typeof row.isRejoin === "number") {
          isRejoin = row.isRejoin === 1 ? "是" : "否";
        }
        return isRejoin;
      },
      isSpecFormatter(row) {
        let isSpec = "";
        if(typeof row.isSpec === "number") {
          isSpec = row.isSpec === 1 ? "是" : "否";
        }
        return isSpec;
      },
      selectedRow(data) {
        this.selectedData = data;
      },
      async deptChange() {
        const deptId = this.deptId;
        if(deptId === undefined) {
          this.positionList = [];
          this.posId = undefined;
        } else {
          this.positionList = await this.$axios.request({
            url: POSITION,
            params: {
              deptId
            }
          });
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .employee-list {
    display: flex;
    flex-direction: column;
    height: 100%;

    .header {
      padding-bottom: 15px;
    }

    .table {
      height: calc(100% - 80px);
    }

    .dialog-row-item {
      display: flex;
      flex-flow: row wrap;

      .dialog-cell-item {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 5px 10px;

        .span-distance {
          padding-bottom: 5px;
        }

        .el-radio {
          margin-top: 10px;
          margin-right: 20px;
        }
      }
    }
  }
</style>
