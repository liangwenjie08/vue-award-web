<template>
  <div id="machine_type_configuration">
    <div class="header">
      <el-button @click="addAndUpdateBtnHandler(false)" style="background-color: #53C0B0;" type="primary"
                 icon="el-icon-plus">
        增加
      </el-button>
      <el-button @click="addAndUpdateBtnHandler(true)" style="background-color: #5BC0DE;" type="primary"
                 icon="el-icon-edit">
        更新
      </el-button>
      <delete-button :delete-callback="getMachineTypeList" description-key="machineTypeDesc" id-key="id"
                     :selected-data="selectedData" :url="machineTypeURL" />
    </div>
    <div class="table">
      <table-box @current-change="selectedRow" :data="paginationData" highlight-current-row>
        <el-table-column
          min-width="110"
          prop="deptDesc"
          label="部門名稱"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="110"
          prop="machineTypeDesc"
          label="機器類型"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="95"
          prop="machineCategory"
          label="公式類型編號"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="500"
          prop="formulaDescription"
          label="公式描述"
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
    <el-dialog width="30%" :title="`${isUpdateOperation ? '更新' : '新增'}機器類型`" :visible.sync="dialogVisible">
      <div class="dialog-cell-item">
        <span class="span-distance">部門</span>
        <department :disabled="isUpdateOperation" v-model="deptId"></department>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">機器類型</span>
        <el-input clearable v-model="machineTypeDesc" placeholder="機器類型"></el-input>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">公式</span>
        <el-input type="textarea" v-model="formulaDescription"
                  placeholder="公式"></el-input>
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
  import { MACHINE_TYPE } from "@/api/configuration_management.js";
  import { frontEndPagination } from "@/utils/utility_class";

  export default {
    name: "machine_type_configuration",
    data() {
      return {
        isClick: false,
        //分頁之後的數據
        paginationData: [],
        machineTypeList: [],
        selectedData: null,
        pageNum: 1,
        pageSize: 50,
        isUpdateOperation: false,
        dialogVisible: false,
        //新增和更新請求參數
        deptId: undefined,
        machineTypeDesc: undefined,
        formulaDescription: ""
      };
    },
    computed: {
      total() {
        return this.machineTypeList.length;
      },
      machineTypeURL() {
        return MACHINE_TYPE;
      }
    },
    created() {
      this.getMachineTypeList();
    },
    methods: {
      async getMachineTypeList() {
        try {
          this.machineTypeList = await this.$axios.request({
            url: MACHINE_TYPE
          });
          this.getPaginationData(this.pageNum, this.pageSize);
        } catch(e) {
          this.machineTypeList = [];
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
          const { machineTypeDesc, deptId, formulaDescription } = this.selectedData;
          this.deptId = deptId;
          this.machineTypeDesc = machineTypeDesc;
          this.formulaDescription = formulaDescription;
        } else {
          this.deptId = undefined;
          this.machineTypeDesc = "";
          this.formulaDescription = "";
        }
        this.isUpdateOperation = isUpdateOperation;
        this.dialogVisible = true;
      },
      async addAndUpdateAxios() {
        const { machineTypeDesc, deptId, formulaDescription, isUpdateOperation, machineTypeURL } = this;
        if(!deptId) {
          this.$message({
            message: "部門不允許為空!",
            type: "error"
          });
          return null;
        }
        if(machineTypeDesc.length === 0) {
          this.$message({
            message: "機器類型不允許為空!",
            type: "error"
          });
          return null;
        }
        if(formulaDescription.length === 0) {
          this.$message({
            message: "公式不允許為空!",
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
          const url = isUpdateOperation ? `${ machineTypeURL }/${ this.selectedData.id }` : machineTypeURL;
          await request({
            url,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: {
              machineTypeDesc,
              deptId,
              formulaDescription
            }
          });
          this.$message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          this.dialogVisible = false;
          this.getMachineTypeList();
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
        this.paginationData = frontEndPagination(this.machineTypeList, page, size);
      },
      selectedRow(data) {
        this.selectedData = data;
      },
    }
  };
</script>

<style lang="less" scoped>
  #machine_type_configuration {
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
