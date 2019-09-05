<template>
  <div id="position-list">
    <div class="header">
      <el-button @click="addAndUpdateBtnHandler(false)" style="background-color: #53C0B0;" type="primary"
                 icon="el-icon-plus">
        增加
      </el-button>
      <el-button @click="addAndUpdateBtnHandler(true)" style="background-color: #5BC0DE;" type="primary"
                 icon="el-icon-edit">
        更新
      </el-button>
      <delete-button :delete-callback="getPositionList" description-key="posId" id-key="posId"
                     :selected-data="selectedData" :url="positionURL" />
      <file-upload :url="importURL" />
      <file-download :url="downloadTemplateURL" />
    </div>
    <div class="table">
      <table-box @current-change="selectedRow" :data="paginationData" highlight-current-row>
        <el-table-column
          min-width="90"
          prop="posId"
          label="崗位編號"
          align="center"
        />
        <el-table-column
          min-width="110"
          prop="posDesc"
          label="崗位名稱"
          align="center"
        />
        <el-table-column
          min-width="60"
          prop="positionRate"
          label="崗位係數"
          align="center"
        />
        <el-table-column
          min-width="60"
          prop="totalPrizeRate"
          label="總奬金係數"
          align="center"
        />
        <el-table-column
          min-width="60"
          prop="outputPrizeType"
          label="產量獎金類型"
          align="center"
          :formatter="outputPrizeTypeFormatter"
        />
        <el-table-column
          min-width="100"
          prop="topDeptDesc"
          label="上級部門名稱"
          align="center"
        />
        <el-table-column
          min-width="100"
          prop="deptDesc"
          label="所屬部門"
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
    <el-dialog width="30%" :title="`${isUpdateOperation ? '更新' : '新增'}崗位信息`" :visible.sync="dialogVisible">
      <div class="dialog-cell-item">
        <span class="span-distance">{{isUpdateOperation ? "所屬" : "上級"}}部門</span>
        <department v-model="deptId"></department>
      </div>
      <div v-if="!isUpdateOperation" class="dialog-cell-item">
        <span class="span-distance">新增部門</span>
        <el-input v-model="deptDesc" clearable placeholder="新增部門"></el-input>
        <span>注：有值則新增部門</span>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">崗位名稱</span>
        <el-input v-model="posDesc" clearable placeholder="崗位名稱"></el-input>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">崗位係數</span>
        <el-input-number v-model="positionRate" :min="0" style="width: 100%;" :controls="false"
                         placeholder="崗位係數"></el-input-number>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">總奬金係數</span>
        <el-input-number v-model="totalPrizeRate" :min="0" style="width: 100%;" :controls="false"
                         placeholder="總奬金係數"></el-input-number>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">產量奬金類型</span>
        <el-radio-group v-model="outputPrizeType">
          <el-radio :label="1">計件</el-radio>
          <el-radio :label="2">非計件</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button style="background-color: #418DCF;" type="primary" @click="addAndUpdateAixos">
          {{this.isUpdateOperation ? "更 新" : "确 定"}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  //API
  import { POSITION, DOWNLOAD_TEMPLATE, IMPORT } from "@/api/position_list";
  import { frontEndPagination } from "@/utils/utility_class";

  export default {
    name: "position_list",
    data() {
      return {
        isClick: false,
        positionList: [],
        //分頁之後顯示在表格中的數據
        paginationData: [],
        selectedData: null,
        pageNum: 1,
        pageSize: 50,
        isUpdateOperation: false,
        dialogVisible: false,
        //新增和更新的請求參數
        deptId: undefined,
        deptDesc: "",
        posDesc: "",
        positionRate: 0,
        totalPrizeRate: 0,
        outputPrizeType: 1
      };
    },
    computed: {
      total() {
        return this.positionList.length;
      },
      importURL() {
        return IMPORT;
      },
      downloadTemplateURL() {
        return DOWNLOAD_TEMPLATE;
      },
      positionURL() {
        return POSITION;
      }
    },
    created() {
      this.getPositionList();
    },
    methods: {
      async getPositionList() {
        try {
          this.positionList = await this.$axios.request({
            url: POSITION
          });
          this.getPaginationData(this.pageNum, this.pageSize);
        } catch(e) {
          this.positionList = [];
          this.paginationData = [];
        }
      },
      getPaginationData(page, size) {
        this.paginationData = frontEndPagination(this.positionList, page, size);
      },
      sizeChange(size) {
        this.pageSize = size;
        this.getPaginationData(this.pageNum, size);
      },
      pageChange(page) {
        this.pageNum = page;
        this.getPaginationData(page, this.pageSize);
      },
      outputPrizeTypeFormatter(row) {
        let outputPrizeType = "";
        if(typeof row.outputPrizeType !== "undefined") {
          outputPrizeType = row.outputPrizeType === 1 ? "計件" : "非計件";
        }
        return outputPrizeType;
      },
      selectedRow(data) {
        this.selectedData = data;
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
          const { deptId, deptDesc, posDesc, positionRate, totalPrizeRate, outputPrizeType } = this.selectedData;
          this.deptId = deptId;
          this.deptDesc = "";
          this.posDesc = posDesc;
          this.positionRate = positionRate;
          this.totalPrizeRate = totalPrizeRate;
          this.outputPrizeType = outputPrizeType;
        } else {
          this.deptId = undefined;
          this.deptDesc = "";
          this.posDesc = "";
          this.positionRate = 0;
          this.totalPrizeRate = 0;
          this.outputPrizeType = 1;
        }
        this.isUpdateOperation = isUpdateOperation;
        this.dialogVisible = true;
      },
      async addAndUpdateAixos() {
        const { deptId, deptDesc: deptDescTemp, posDesc, positionRate, totalPrizeRate, outputPrizeType, isUpdateOperation } = this;
        if(!deptId) {
          this.$message({
            message: (isUpdateOperation ? "所屬" : "上級") + "部門不允許為空",
            type: "error"
          });
          return null;
        }
        if(!posDesc) {
          this.$message({
            message: "崗位不允許為空",
            type: "error"
          });
          return null;
        }
        if(typeof positionRate !== "number") {
          this.$message({
            message: "崗位係數不允許為空",
            type: "error"
          });
          return null;
        }
        if(typeof totalPrizeRate !== "number") {
          this.$message({
            message: "總奬金係數不允許為空",
            type: "error"
          });
          return null;
        }
        if(this.isClick) {
          return null;
        }
        this.isClick = true;
        try {
          const deptDesc = deptDescTemp.trim();
          const { request, method } = this.$axios;
          const url = isUpdateOperation ? `${ POSITION }/${ this.selectedData.posId }` : POSITION;
          //固定的請求參數
          const immutabilityParams = {
            positionRate,
            totalPrizeRate,
            outputPrizeType,
            posDesc
          };
          let changeableParams = null;
          if(deptDesc.length > 0) {
            changeableParams = {
              topDeptId: deptId,
              deptDesc
            };
          } else {
            changeableParams = {
              deptId
            };
          }
          const params = { ...immutabilityParams, ...changeableParams };
          console.log(params);
          await request({
            url,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: params
          });
          this.$message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          this.dialogVisible = false;
          this.getPositionList();
        } finally {
          this.isClick = false;
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  #position-list {
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

      .el-radio {
        margin-top: 10px;
        margin-right: 20px;
      }
    }
  }
</style>
