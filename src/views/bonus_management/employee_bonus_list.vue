<template>
  <div id="employee_bonus_list">
    <div class="header">
      <el-button @click="addAndUpdateBtnHandler(false)" style="background-color: #53C0B0;" type="primary"
                 icon="el-icon-plus">
        增加
      </el-button>
      <el-button @click="addAndUpdateBtnHandler(true)" style="background-color: #5BC0DE;" type="primary"
                 icon="el-icon-edit">
        更新
      </el-button>
      <delete-button :delete-callback="getEmployeeBonusList" description-key="empName" id-key="id"
                     :selected-data="selectedData" :url="employeeBonusURL" />
    </div>
    <div class="table">
      <table-box @current-change="selectedRow" :data="paginationData" highlight-current-row>
        <el-table-column
          min-width="90"
          prop="empName"
          label="員工姓名"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="110"
          prop="deptDesc"
          label="部門名稱"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="90"
          prop="itemId"
          label="津貼項編號"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="120"
          prop="itemDesc"
          label="津貼項描述"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="80"
          prop="value"
          label="個數/金額"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="100"
          prop="dateFrom"
          label="開始時間"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="100"
          prop="dateTo"
          label="結束時間"
          align="center"
        ></el-table-column>
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
    ></el-pagination>
    <el-dialog width="30%" :title="`${isUpdateOperation ? '更新' : '新增'}崗位信息`" :visible.sync="dialogVisible">
      <div class="dialog-cell-item">
        <span class="span-distance">部門</span>
        <department :disabled="isUpdateOperation" @input="deptChange" v-model="deptId"></department>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">員工列表</span>
        <el-select default-first-option filterable :disabled="isUpdateOperation" v-model="empId" placeholder="員工列表">
          <el-option
            :key="item.empId"
            :value="item.empId"
            :label="item.empName"
            v-for="item of empList"
          />
        </el-select>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">津貼項</span>
        <el-select default-first-option filterable :disabled="isUpdateOperation" v-model="itemId" placeholder="津貼項">
          <el-option
            :key="item.itemId"
            :value="item.itemId"
            :label="item.itemDesc"
            v-for="item of itemList"
          />
        </el-select>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">數量</span>
        <el-input-number :min="0" style="width: 100%;" :controls="false"
                         v-model="value" placeholder="數量"></el-input-number>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">日期</span>
        <el-date-picker :disabled="isUpdateOperation" type="daterange" clearable style="width: 100%;" v-model="date"
                        range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期"
                        value-format="yyyy-MM-dd"
                        format="yyyyMMdd" />
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
  import { EMPLOYEE_BONUS, BONUS_ITEM, EMPLOYEE } from "@/api/bonus";
  import { frontEndPagination } from "@/utils/utility_class";

  export default {
    name: "employee_bonus_list",
    data() {
      return {
        isClick: false,
        //員工津貼列表
        employeeBonusList: [],
        //分頁之後顯示在表格中的數據
        paginationData: [],
        //津貼項列表
        itemList: [],
        //員工列表
        empList: [],
        selectedData: null,
        pageNum: 1,
        pageSize: 50,
        isUpdateOperation: false,
        dialogVisible: false,
        //新增和更新請求參數
        itemId: undefined,
        empId: undefined,
        deptId: undefined,
        value: 0,
        date: null
      };
    },
    computed: {
      total() {
        return this.employeeBonusList.length;
      },
      employeeBonusURL() {
        return EMPLOYEE_BONUS;
      }
    },
    created() {
      this.getEmployeeBonusList();
      this.getItemList();
    },
    methods: {
      async getEmployeeBonusList() {
        try {
          this.employeeBonusList = await this.$axios.request({
            url: this.employeeBonusURL
          });
          this.getPaginationData(this.pageNum, this.pageSize);
        } catch(e) {
          this.employeeBonusList = [];
          this.paginationData = [];
        }
      },
      async getItemList() {
        try {
          this.itemList = await this.$axios.request({
            url: BONUS_ITEM,
            params: {
              itemType: 1
            }
          });
        } catch(e) {
          this.itemList = [];
        }
      },
      async getEmployeeList() {
        try {
          const deptId = this.deptId;
          if(!deptId) {
            throw new Error("部門為空");
          }
          this.empList = await this.$axios.request({
            url: EMPLOYEE,
            params: {
              deptId
            }
          });
        } catch(e) {
          this.empList = [];
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
          const { itemId, empId, deptId, dateFrom, value, dateTo } = this.selectedData;
          this.itemId = itemId;
          this.deptId = deptId;
          this.value = value;
          this.date = [dateFrom, dateTo];
          this.getEmployeeList();
          this.$nextTick(function() {
            this.empId = empId;
          });
        } else {
          this.itemId = undefined;
          this.empId = undefined;
          this.deptId = undefined;
          this.value = 0;
          this.date = null;
        }
        this.isUpdateOperation = isUpdateOperation;
        this.dialogVisible = true;
      },
      async addAndUpdateAxios() {
        const { itemId, empId, deptId, date, value, isUpdateOperation, employeeBonusURL } = this;
        if(!deptId) {
          this.$message({
            message: "部門不允許為空!",
            type: "error"
          });
          return null;
        }
        if(!empId) {
          this.$message({
            message: "員工不允許為空!",
            type: "error"
          });
          return null;
        }
        if(typeof itemId === "undefined") {
          this.$message({
            message: "津貼項不允許為空!",
            type: "error"
          });
          return null;
        }
        if(!value) {
          this.$message({
            message: "數量不允許為空!",
            type: "error"
          });
          return null;
        }
        if(!date) {
          this.$message({
            message: "日期不允許為空!",
            type: "error"
          });
          return null;
        }
        try {
          if(this.isClick) {
            return null;
          }
          this.isClick = true;
          const [dateFrom, dateTo] = date;
          const { request, method } = this.$axios;
          const url = isUpdateOperation ? `${ employeeBonusURL }/${ this.selectedData.id }` : employeeBonusURL;
          await request({
            url,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: {
              deptId,
              empId,
              itemId,
              value,
              dateFrom,
              dateTo
            }
          });
          this.$message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          this.dialogVisible = false;
          this.getEmployeeBonusList();
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
        this.paginationData = frontEndPagination(this.employeeBonusList, page, size);
      },
      selectedRow(data) {
        this.selectedData = data;
      },
      deptChange() {
        this.getEmployeeList();
      }
    }
  };
</script>

<style lang="less" scoped>
  #employee_bonus_list {
    display: flex;
    flex-direction: column;
    height: 100%;

    .header {
      padding-bottom: 15px;
    }

    .table {
      height: calc(100% - 80px);
    }

    .dialog-cell-item {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 5px 10px;

      .span-distance {
        padding-bottom: 5px;
      }
    }
  }
</style>
