<template>
  <div id="holiday_configuration">
    <div class="header">
      <el-button @click="addAndUpdateBtnHandler(false)" style="background-color: #53C0B0;" type="primary"
                 icon="el-icon-plus">
        增加
      </el-button>
      <el-button @click="addAndUpdateBtnHandler(true)" style="background-color: #5BC0DE;" type="primary"
                 icon="el-icon-edit">
        更新
      </el-button>
      <delete-button :delete-callback="getHolidayList" description-key="id" id-key="id"
                     :selected-data="selectedData" :url="holidayURL" />
    </div>
    <div class="table">
      <table-box @current-change="selectedRow" :data="paginationData" highlight-current-row>
        <el-table-column
          min-width="200"
          prop="id"
          label="假期編號"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="200"
          prop="outDate"
          label="日期"
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
    <el-dialog width="30%" :title="`${isUpdateOperation ? '更新' : '新增'}假期`" :visible.sync="dialogVisible">
      <div class="dialog-cell-item">
        <span class="span-distance">日期</span>
        <el-date-picker clearable style="width: 100%;" v-model="outDate"
                        placeholder="日期" value-format="yyyy-MM-dd" format="yyyyMMdd" />
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button style="background-color: #418DCF;" type="primary" @click="addAndUpdateAxios">
          {{isUpdateOperation ? "更 新" : "确 定"}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { HOLIDAY } from "@/api/configuration_management.js";
  import { frontEndPagination } from "@/utils/utility_class";

  export default {
    name: "holiday_configuration",
    data() {
      return {
        isClick: false,
        //分頁之後的數據
        paginationData: [],
        holidayList: [],
        selectedData: null,
        pageNum: 1,
        pageSize: 50,
        isUpdateOperation: false,
        dialogVisible: false,
        //新增和更新請求參數
        outDate: null
      };
    },
    computed: {
      total() {
        return this.holidayList.length;
      },
      holidayURL() {
        return HOLIDAY;
      }
    },
    created() {
      this.getHolidayList();
    },
    methods: {
      async getHolidayList() {
        try {
          this.holidayList = await this.$axios.request({
            url: this.holidayURL
          });
          this.getPaginationData(this.pageNum, this.pageSize);
        } catch(e) {
          this.holidayList = [];
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
          const { outDate } = this.selectedData;
          this.outDate = outDate;
        } else {
          this.outDate = null;
        }
        this.isUpdateOperation = isUpdateOperation;
        this.dialogVisible = true;
      },
      async addAndUpdateAxios() {
        const { outDate, isUpdateOperation, holidayURL } = this;
        if(!outDate) {
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
          const { request, method } = this.$axios;
          const id = isUpdateOperation ? this.selectedData.id : undefined;
          const url = isUpdateOperation ? `${ holidayURL }/${ id }` : holidayURL;
          await request({
            url,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: {
              outDate,
              id
            }
          });
          this.$message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          this.dialogVisible = false;
          this.getHolidayList();
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
        this.paginationData = frontEndPagination(this.holidayList, page, size);
      },
      selectedRow(data) {
        this.selectedData = data;
      },
    }
  };
</script>

<style lang="less" scoped>
  #holiday_configuration {
    display: flex;
    flex-direction: column;
    height: 100%;

    .header {
      padding-bottom: 15px;
    }

    .table {
      height: 100%;
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

