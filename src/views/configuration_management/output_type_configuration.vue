<template>
  <div id="output_type_configuration">
    <div class="header">
      <el-button @click="addAndUpdateBtnHandler(false)" style="background-color: #53C0B0;" type="primary"
                 icon="el-icon-plus">
        增加
      </el-button>
      <el-button @click="addAndUpdateBtnHandler(true)" style="background-color: #5BC0DE;" type="primary"
                 icon="el-icon-edit">
        更新
      </el-button>
      <delete-button :delete-callback="getOutputTypeList" description-key="outputTypeDesc" id-key="id"
                     :selected-data="selectedData" :url="outputTypeURL" />
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
          prop="outputMultiplier"
          label="產量係數"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="200"
          prop="outputTypeDesc"
          label="產量類型"
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
    <el-dialog width="30%" :title="`${isUpdateOperation ? '更新' : '新增'}產量類型`" :visible.sync="dialogVisible">
      <div class="dialog-cell-item">
        <span class="span-distance">部門</span>
        <department :disabled="isUpdateOperation" v-model="deptId"></department>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">產量類型</span>
        <el-input clearable v-model="outputTypeDesc" placeholder="產量類型"></el-input>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">產量係數</span>
        <el-input-number :min="0" style="width: 100%;" :controls="false"
                         v-model="outputMultiplier" placeholder="產量係數"></el-input-number>
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
  import { OUTPUT_TYPE } from "@/api/configuration_management.js";
  import { frontEndPagination } from "@/utils/utility_class";

  export default {
    name: "output_type_configuration",
    data() {
      return {
        isClick: false,
        //分頁之後的數據
        paginationData: [],
        outputTypeList: [],
        selectedData: null,
        pageNum: 1,
        pageSize: 50,
        isUpdateOperation: false,
        dialogVisible: false,
        //新增和更新請求參數
        deptId: undefined,
        outputTypeDesc: "",
        outputMultiplier: 0
      };
    },
    computed: {
      total() {
        return this.outputTypeList.length;
      },
      outputTypeURL() {
        return OUTPUT_TYPE;
      }
    },
    created() {
      this.getOutputTypeList();
    },
    methods: {
      async getOutputTypeList() {
        try {
          this.outputTypeList = await this.$axios.request({
            url: this.outputTypeURL
          });
          this.getPaginationData(this.pageNum, this.pageSize);
        } catch(e) {
          this.outputTypeList = [];
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
          const { outputTypeDesc, deptId, outputMultiplier } = this.selectedData;
          this.deptId = deptId;
          this.outputTypeDesc = outputTypeDesc;
          this.outputMultiplier = outputMultiplier;
        } else {
          this.deptId = undefined;
          this.outputTypeDesc = "";
          this.outputMultiplier = 0;
        }
        this.isUpdateOperation = isUpdateOperation;
        this.dialogVisible = true;
      },
      async addAndUpdateAxios() {
        const { outputTypeDesc, deptId, outputMultiplier, isUpdateOperation, outputTypeURL } = this;
        if(!deptId) {
          this.$message({
            message: "部門不允許為空!",
            type: "error"
          });
          return null;
        }
        if(outputTypeDesc.length === 0) {
          this.$message({
            message: "產量類型不允許為空!",
            type: "error"
          });
          return null;
        }
        if(!outputMultiplier) {
          this.$message({
            message: "產量係數不允許為空!",
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
          const url = isUpdateOperation ? `${ outputTypeURL }/${ id }` : outputTypeURL;
          await request({
            url,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: {
              outputTypeDesc,
              deptId,
              outputMultiplier,
              id
            }
          });
          this.$message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          this.dialogVisible = false;
          this.getOutputTypeList();
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
        this.paginationData = frontEndPagination(this.outputTypeList, page, size);
      },
      selectedRow(data) {
        this.selectedData = data;
      },
    }
  };
</script>

<style lang="less" scoped>
  #output_type_configuration {
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
