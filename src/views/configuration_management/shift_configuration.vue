<template>
  <div id="shift_configuration">
    <div class="header">
      <el-button @click="addAndUpdateBtnHandler(false)" style="background-color: #53C0B0;" type="primary"
                 icon="el-icon-plus">
        增加
      </el-button>
      <el-button @click="addAndUpdateBtnHandler(true)" style="background-color: #5BC0DE;" type="primary"
                 icon="el-icon-edit">
        更新
      </el-button>
      <delete-button :delete-callback="getShiftList" description-key="shiftDesc" id-key="id"
                     :selected-data="selectedData" :url="shiftURL" />
    </div>
    <div class="table">
      <table-box @current-change="selectedRow" :data="paginationData" highlight-current-row>
        <el-table-column
          min-width="200"
          prop="deptDesc"
          label="部門名稱"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="200"
          prop="shiftDesc"
          label="班制"
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
    <el-dialog width="30%" :title="`${isUpdateOperation ? '更新' : '新增'}班制`" :visible.sync="dialogVisible">
      <div class="dialog-cell-item">
        <span class="span-distance">部門</span>
        <department v-model="deptId"></department>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">班制</span>
        <el-input clearable v-model="shift" placeholder="班制"></el-input>
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
  import { SHIFT } from "@/api/configuration_management.js";
  import { frontEndPagination } from "@/utils/utility_class";

  export default {
    name: "shift_configuration",
    data() {
      return {
        isClick: false,
        shiftList: [],
        paginationData: [],
        selectedData: null,
        pageNum: 1,
        pageSize: 50,
        isUpdateOperation: false,
        dialogVisible: false,
        //新增和更新請求參數
        shift: "",
        deptId: undefined
      };
    },
    computed: {
      total() {
        return this.shiftList.length;
      },
      shiftURL() {
        return SHIFT;
      }
    },
    created() {
      this.getShiftList();
    },
    methods: {
      async getShiftList() {
        try {
          this.shiftList = await this.$axios.request({
            url: this.shiftURL
          });
          this.getPaginationData(this.pageNum, this.pageSize);
        } catch(e) {
          this.shiftList = [];
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
          const { shiftDesc, deptId } = this.selectedData;
          this.deptId = deptId;
          this.shift = shiftDesc;
        } else {
          this.shift = "";
          this.deptId = undefined;
        }
        this.isUpdateOperation = isUpdateOperation;
        this.dialogVisible = true;
      },
      async addAndUpdateAxios() {
        const { shift, deptId, isUpdateOperation, shiftURL } = this;
        if(!deptId) {
          this.$message({
            message: "部門不允許為空!",
            type: "error"
          });
          return null;
        }
        if(shift.length === 0) {
          this.$message({
            message: "考核項名稱不允許為空!",
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
          const url = isUpdateOperation ? `${ shiftURL }/${ this.selectedData.id }` : shiftURL;
          await request({
            url,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: {
              deptId,
              shiftDesc: shift
            }
          });
          this.$message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          this.dialogVisible = false;
          this.getShiftList();
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
        this.paginationData = frontEndPagination(this.shiftList, page, size);
      },
      selectedRow(data) {
        this.selectedData = data;
      }
    }
  };
</script>

<style lang="less" scoped>
  #shift_configuration {
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
