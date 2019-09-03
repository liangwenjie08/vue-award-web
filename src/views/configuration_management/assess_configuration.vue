<template>
  <div id="assess_configuration">
    <div class="header">
      <el-button @click="addAndUpdateBtnHandler(false)" style="background-color: #53C0B0;" type="primary"
                 icon="el-icon-plus">
        增加
      </el-button>
      <el-button @click="addAndUpdateBtnHandler(true)" style="background-color: #5BC0DE;" type="primary"
                 icon="el-icon-edit">
        更新
      </el-button>
      <delete-button :delete-callback="getAssessList" description-key="assessDesc" id-key="id"
                     :selected-data="selectedData" :url="assessItemURL" />
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
          prop="assessDesc"
          label="考核項"
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
    <el-dialog width="30%" :title="`${isUpdateOperation ? '更新' : '新增'}考核项`" :visible.sync="dialogVisible">
      <div class="dialog-cell-item">
        <span class="span-distance">部門</span>
        <department v-model="deptId"></department>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">考核項名稱</span>
        <el-input clearable v-model="shift" placeholder="考核項名稱"></el-input>
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
  import { ASSESS_ITEM } from "@/api/configuration_management.js";
  import { frontEndPagination } from "@/utils/utility_class";

  export default {
    name: "assess_configuration",
    data() {
      return {
        isClick: false,
        assessList: [],
        paginationData: [],
        selectedData: null,
        pageNum: 1,
        pageSize: 50,
        isUpdateOperation: false,
        dialogVisible: false,
        //新增和更新請求參數
        assessDesc: "",
        deptId: undefined
      };
    },
    computed: {
      total() {
        return this.assessList.length;
      },
      assessItemURL() {
        return ASSESS_ITEM;
      }
    },
    created() {
      this.getAssessList();
    },
    methods: {
      async getAssessList() {
        try {
          this.assessList = await this.$axios.request({
            url: this.assessItemURL
          });
          this.getPaginationData(this.pageNum, this.pageSize);
        } catch(e) {
          this.assessList = [];
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
          const { assessDesc, deptId } = this.selectedData;
          this.deptId = deptId;
          this.assessDesc = assessDesc;
        } else {
          this.assessDesc = "";
          this.deptId = undefined;
        }
        this.isUpdateOperation = isUpdateOperation;
        this.dialogVisible = true;
      },
      async addAndUpdateAxios() {
        const { assessDesc, deptId, isUpdateOperation, assessItemURL } = this;
        if(!deptId) {
          this.$message({
            message: "部門不允許為空!",
            type: "error"
          });
          return null;
        }
        if(assessDesc.length === 0) {
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
          const url = isUpdateOperation ? `${ assessItemURL }/${ this.selectedData.id }` : assessItemURL;
          await request({
            url,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: {
              deptId,
              assessDesc
            }
          });
          this.$message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          this.dialogVisible = false;
          this.getAssessList();
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
        this.paginationData = frontEndPagination(this.assessList, page, size);
      },
      selectedRow(data) {
        this.selectedData = data;
      },
    }
  };
</script>

<style lang="less" scoped>
  #assess_configuration {
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
