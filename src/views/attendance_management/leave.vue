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
          min-width="140"
          prop="restStartTime"
          label="開始休息"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="140"
          prop="restEndTime"
          label="結束休息"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="60"
          prop="code"
          label="類型"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="50"
          prop="restTime"
          label="小計"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="200"
          prop="description"
          label="事由"
          align="center"
          show-overflow-tooltip
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
          <el-input ref="leaveEmpId" @change="empIsExist = false" @keyup.enter.stop.native="getEmployee"
                    v-model="empId" placeholder="員工編號"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">員工姓名</span>
          <el-input readonly v-model="empName" placeholder="員工姓名"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">開始休息時間</span>
          <el-date-picker v-model="startDate" value-format="yyyy-MM-dd"
                          format="yyyyMMdd" style="width: 100%;" placeholder="日期"></el-date-picker>
          <el-time-picker style="width: 100%;margin-top: 5px;" arrow-control placeholder="時間" format="HHmm"
                          value-format="HH:mm:ss" v-model="startTime"></el-time-picker>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">結束休息時間</span>
          <el-date-picker v-model="endDate" value-format="yyyy-MM-dd"
                          format="yyyyMMdd" style="width: 100%;" placeholder="日期"></el-date-picker>
          <el-time-picker style="width: 100%;margin-top: 5px;" arrow-control placeholder="時間" format="HHmm"
                          value-format="HH:mm:ss" v-model="endTime"></el-time-picker>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">小計</span>
          <el-input v-model="restTime" placeholder="小計"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">事由</span>
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="description"
                    placeholder="事由"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">請假類型</span>
          <el-select filterable placeholder="請假類型" v-model="code" clearable>
            <el-option
              v-for="item of holidayTypeList"
              :key="item.code"
              :value="item.code"
              :label="item.description"
            ></el-option>
          </el-select>
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
  import { default_page_size, holiday_type } from "@/utils/common_variable";

  export default {
    name: "leave",
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
        empIsExist: false,
        //添加和更新請求參數
        id: undefined,
        empId: "",
        empName: "",
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        restTime: "",
        description: "",
        code: "1011"
      };
    },
    computed: {
      holidayTypeList() {
        return holiday_type;
      }
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
              type: 1,
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
        const {
          empIsExist, empId, startDate, startTime, endDate, endTime,
          restTime, id, description, code, $message, isUpdateOperation
        } = this;
        if(!empIsExist) {
          $message({
            message: "請先輸入員工!",
            type: "error"
          });
          return;
        }
        if(!startTime || !startDate) {
          $message({
            message: "開始休息時間不允許為空!",
            type: "error"
          });
          return;
        }
        if(!endTime || !endDate) {
          $message({
            message: "結束休息時間不允許為空!",
            type: "error"
          });
          return;
        }
        if(!code) {
          $message({
            message: "請假類型不允許為空!",
            type: "error"
          });
          return;
        }
        if(this.loading) {
          return;
        }
        try {
          this.loading = true;
          const restStartTime = `${ startDate } ${ startTime }`;
          const restEndTime = `${ endDate } ${ endTime }`;
          const { request, method } = this.$axios;
          await request({
            url: FORM,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: {
              empId,
              id,
              restStartTime,
              restEndTime,
              type: 1,
              restTime,
              code,
              description
            }
          });
          $message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          const { getTableData, reset, $refs } = this;
          getTableData();
          reset();
          $refs.leaveEmpId.focus();
        } finally {
          this.loading = false;
        }
      },
      reset() {
        this.isUpdateOperation = false;
        this.empIsExist = false;
        this.singleSelectedData = null;
        this.id = undefined;
        this.empId = "";
        this.empName = "";
        this.startDate = null;
        this.startTime = null;
        this.endDate = null;
        this.endTime = null;
        this.restTime = "";
        this.description = "";
      },
      singleSelectedRow(selectedData) {
        if(this.singleSelectedData === selectedData) {
          this.reset();
        } else {
          this.isUpdateOperation = true;
          this.empIsExist = true;
          this.singleSelectedData = selectedData;
          this.id = selectedData.id;
          this.empId = selectedData.empId;
          this.empName = selectedData.empName;
          const { restEndTime, restStartTime } = selectedData;
          this.startDate = restStartTime.split(" ")[0];
          this.startTime = restStartTime.split(" ")[1];
          this.endDate = restEndTime.split(" ")[0];
          this.endTime = restEndTime.split(" ")[1];
          this.restTime = selectedData.restTime;
          this.description = selectedData.description;
        }
      },
      multipleSelectedRow(selectedData) {
        this.$emit("multiple-selected", selectedData);
      },
      sizeChange(size) {
        this.pageSize = size;
        this.getTableData();
      },
      pageChange(page) {
        this.pageNum = page;
        this.getTableData();
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
