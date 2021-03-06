<template>
  <table-form-layout :style.native="{height: 'calc(100% - 80px)'}">
    <template #table>
      <table-box highlight-current-row :data="tableData" @row-click="singleSelectedRow"
                 @selection-change="multipleSelectedRow">
        <el-table-column
          type="selection"
          width="35"
        ></el-table-column>
        <el-table-column
          min-width="80"
          prop="empId"
          label="員工編號"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="80"
          prop="empName"
          label="員工名稱"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="110"
          prop="deptName"
          label="部門"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="60"
          prop="shift"
          label="班次"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="100"
          prop="restStartTime"
          label="休息日期"
          align="center"
          :formatter="restStartTimeFormatter"
        ></el-table-column>
        <el-table-column
          min-width="100"
          prop="workStartTime"
          label="工作日期"
          align="center"
          :formatter="workStartTimeFormatter"
        ></el-table-column>
        <el-table-column
          min-width="80"
          prop="code"
          label="類型"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="100"
          prop="createTime"
          label="録入日期"
          align="center"
          :formatter="createTimeFormatter"
        ></el-table-column>
      </table-box>
    </template>
    <template #pagination>
      <el-pagination
        background
        :total="total"
        :current-page="pageNum"
        :page-size="pageSize"
        :page-sizes="[50, 100, 200]"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"
      ></el-pagination>
    </template>
    <template #form>
      <div :tabindex="0" @keyup.enter.stop="addAndUpdateAxios" class="form">
        <div class="dialog-cell-item">
          <span class="span-distance">員工編號</span>
          <el-input ref="adjustHolidayEmpId" @change="empIsExist = false" @keyup.enter.stop.native="getEmployee"
                    v-model="empId"
                    placeholder="員工編號"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">員工姓名</span>
          <el-input readonly v-model="empName" placeholder="員工姓名"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">工作日期</span>
          <el-date-picker v-model="workDate" value-format="yyyy-MM-dd HH:mm:ss"
                          format="yyyyMMdd" style="width: 100%;" placeholder="工作日期"></el-date-picker>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">休息日期</span>
          <el-date-picker v-model="restDate" value-format="yyyy-MM-dd HH:mm:ss"
                          format="yyyyMMdd" style="width: 100%;" placeholder="休息日期"></el-date-picker>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">班次</span>
          <el-input v-model="shift" placeholder="班次"></el-input>
        </div>
        <div class="dialog-cell-item">
          <el-radio-group v-model="code">
            <el-radio label="1">正常調休</el-radio>
            <el-radio label="2">僅休息</el-radio>
          </el-radio-group>
        </div>
        <div class="dialog-cell-item">
          <el-button :loading="loading" :disabled="loading" @click="addAndUpdateAxios" type="primary"
                     style="background-color: #418DCF;margin-top: 15px;">
            {{isUpdateOperation ? "更新" : "提交"}}
          </el-button>
        </div>
      </div>
    </template>
  </table-form-layout>
</template>

<script>
  import { FORM, EMPLOYEE } from "@/api/attendance_management.js";
  import { default_page_size } from "@/utils/common_variable";

  export default {
    name: "adjust_holiday",
    props: ["params"],
    data() {
      return {
        tableData: [],
        singleSelectedData: null,
        pageNum: 1,
        pageSize: default_page_size,
        total: 0,
        doLayout: true,
        isUpdateOperation: false,
        loading: false,
        //員工是否存在
        empIsExist: false,
        //添加和更新請求參數
        id: undefined,
        empId: "",
        empName: "",
        workDate: null,
        restDate: null,
        shift: "",
        //調休類型
        code: "1"
      };
    },
    watch: {
      params: function() {
        this.getTableData();
      }
    },
    created() {
      this.getTableData();
    },
    methods: {
      async getTableData() {
        const { searchDeptId, searchEmpId, searchEmpName, searchDate } = this.params;
        const { pageNum, pageSize } = this;
        const empId = searchEmpId.trim() || undefined;
        const empName = searchEmpName.trim() || undefined;
        const [startDate, endDate] = searchDate || [];
        try {
          const res = await this.$axios.request({
            url: FORM,
            params: {
              type: 0,
              deptId: searchDeptId,
              empId,
              startDate,
              endDate,
              empName,
              pageNum,
              pageSize
            }
          });
          this.tableData = res.list;
          this.pageNum = res.pageNum;
          this.pageSize = res.pageSize;
          this.total = res.total;
          if(this.doLayout && res.list.length > 0) {
            this.$nextTick(function() {
              this.$refs.tableBoxRef.doLayout();
            });
            this.doLayout = false;
          }
        } catch(e) {
          this.tableData = [];
        }
      },
      async getEmployee() {
        const empId = this.empId.trim();
        if(empId.length < 8) {
          this.$message({
            message: "員工編號至少8位!",
            type: "error"
          });
          return;
        }
        try {
          const res = await this.$axios.request({
            url: EMPLOYEE + "/" + empId
          });
          this.empName = res.empName;
          this.empIsExist = true;
        } catch(e) {
          this.empName = "員工不存在";
          this.empIsExist = false;
        }
      },
      async addAndUpdateAxios() {
        const { empIsExist, empId, workDate, restDate, shift, code, id, $message, isUpdateOperation } = this;
        if(!empIsExist) {
          $message({
            message: "請先輸入員工!",
            type: "error"
          });
          return;
        }
        if(!workDate) {
          $message({
            message: "工作日期不允許為空!",
            type: "error"
          });
          return;
        }
        if(!restDate) {
          $message({
            message: "休息日期不允許為空!",
            type: "error"
          });
          return;
        }
        if(this.loading) {
          return;
        }
        try {
          this.loading = true;
          const { request, method } = this.$axios;
          await request({
            url: FORM,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: {
              empId,
              id,
              restStartTime: restDate,
              workStartTime: workDate,
              shift,
              code,
              type: 0
            }
          });
          $message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          const { getTableData, reset, $refs } = this;
          getTableData();
          reset();
          $refs.adjustHolidayEmpId.focus();
        } finally {
          this.loading = false;
        }
      },
      reset() {
        this.empIsExist = false;
        this.isUpdateOperation = false;
        this.singleSelectedData = null;
        this.id = undefined;
        this.code = "1";
        this.empId = "";
        this.empName = "";
        this.restDate = null;
        this.workDate = null;
        this.shift = "";
      },
      sizeChange(size) {
        this.pageSize = size;
        this.getTableData();
      },
      pageChange(page) {
        this.pageNum = page;
        this.getTableData();
      },
      multipleSelectedRow(selectedData) {
        this.$emit("multiple-selected", selectedData);
      },
      singleSelectedRow(selectedData) {
        if(selectedData === this.singleSelectedData) {
          this.reset();
        } else {
          this.empIsExist = true;
          this.isUpdateOperation = true;
          this.singleSelectedData = selectedData;
          this.id = selectedData.id;
          this.code = selectedData.code;
          this.empId = selectedData.empId;
          this.empName = selectedData.empName;
          this.restDate = selectedData.restStartTime;
          this.workDate = selectedData.workStartTime;
          this.shift = selectedData.shift;
        }
      },
      restStartTimeFormatter(row) {
        return row.restStartTime.split(" ")[0];
      },
      workStartTimeFormatter(row) {
        return row.workStartTime.split(" ")[0];
      },
      createTimeFormatter(row) {
        return row.createTime.split(" ")[0];
      }
    }
  };
</script>

<style lang="less" scoped>
  .form {
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
    outline: none;

    .dialog-cell-item {
      display: flex;
      flex-direction: column;
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
</style>
