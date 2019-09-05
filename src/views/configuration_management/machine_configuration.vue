<template>
  <div id="machine_configuration">
    <div class="header">
      <el-button @click="addAndUpdateBtnHandler(false)" style="background-color: #53C0B0;" type="primary"
                 icon="el-icon-plus">
        增加
      </el-button>
      <el-button @click="addAndUpdateBtnHandler(true)" style="background-color: #5BC0DE;" type="primary"
                 icon="el-icon-edit">
        更新
      </el-button>
      <delete-button :delete-callback="getMachineList" description-key="machineNo" id-key="id"
                     :selected-data="selectedData" :url="machineURL" />
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
          min-width="140"
          prop="machineNo"
          label="機器編號"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="70"
          prop="machineTypeId"
          label="機器類型"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="450"
          prop="formulaDesc"
          label="公式"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="70"
          prop="isChemicalFiber"
          label="是否化纖"
          align="center"
          :formatter="isChemicalFiberFormatter"
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
    <el-dialog width="30%" :title="`${isUpdateOperation ? '更新' : '新增'}機器`" :visible.sync="dialogVisible">
      <div class="dialog-cell-item">
        <span class="span-distance">部門</span>
        <department :disabled="isUpdateOperation" @input="deptChange" v-model="deptId"></department>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">機器編號</span>
        <el-input clearable v-model="machineNo" placeholder="機器編號"></el-input>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">機器類型</span>
        <el-select @change="machineTypeChange" v-model="machineTypeId" placeholder="機器類型">
          <el-option
            :key="item.id"
            :label="item.machineTypeDesc"
            :value="item.id"
            v-for="item of machineTypeList"
          />
        </el-select>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">公式</span>
        <el-input type="textarea" readonly v-model="formulaDescription"
                  placeholder="公式"></el-input>
      </div>
      <div class="dialog-cell-item">
        <el-checkbox v-model="isChemicalFiber">是否化纖</el-checkbox>
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
  import { MACHINE, MACHINE_TYPE } from "@/api/configuration_management.js";
  import { frontEndPagination } from "@/utils/utility_class";

  export default {
    name: "machine_configuration",
    data() {
      return {
        isClick: false,
        machineList: [],
        paginationData: [],
        machineTypeList: [],
        selectedData: null,
        pageNum: 1,
        pageSize: 50,
        isUpdateOperation: false,
        dialogVisible: false,
        //新增和更新請求參數
        machineNo: "",
        deptId: undefined,
        machineTypeId: undefined,
        formulaDescription: "",
        isChemicalFiber: false
      };
    },
    computed: {
      total() {
        return this.machineList.length;
      },
      machineURL() {
        return MACHINE;
      }
    },
    created() {
      this.getMachineList();
    },
    methods: {
      async getMachineList() {
        try {
          this.machineList = await this.$axios.request({
            url: this.machineURL
          });
          this.getPaginationData(this.pageNum, this.pageSize);
        } catch(e) {
          this.machineList = [];
          this.paginationData = [];
        }
      },
      async getMachineTypeList() {
        try {
          const deptId = this.deptId;
          if(!deptId) {
            throw new Error("部門為空");
          }
          this.machineTypeList = await this.$axios.request({
            url: MACHINE_TYPE,
            params: {
              deptId
            }
          });
        } catch(e) {
          this.machineTypeList = [];
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
          const { machineNo, deptId, isChemicalFiber, machineTypeId, formulaDesc } = this.selectedData;
          this.deptId = deptId;
          this.machineNo = machineNo;
          this.isChemicalFiber = isChemicalFiber === 1;
          this.formulaDescription = formulaDesc;
          this.getMachineTypeList();
          this.$nextTick(function() {
            this.machineTypeId = machineTypeId;
          });
        } else {
          this.machineNo = "";
          this.deptId = undefined;
          this.machineTypeId = undefined;
          this.formulaDescription = "";
          this.isChemicalFiber = false;
        }
        this.isUpdateOperation = isUpdateOperation;
        this.dialogVisible = true;
      },
      async addAndUpdateAxios() {
        const { machineNo, deptId, isChemicalFiber, machineTypeId, isUpdateOperation, machineURL } = this;
        if(!deptId) {
          this.$message({
            message: "部門不允許為空!",
            type: "error"
          });
          return null;
        }
        if(machineNo.length === 0) {
          this.$message({
            message: "機器編號不允許為空!",
            type: "error"
          });
          return null;
        }
        if(!machineTypeId) {
          this.$message({
            message: "機器類型不允許為空!",
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
          const url = isUpdateOperation ? `${ machineURL }/${ this.selectedData.id }` : machineURL;
          await request({
            url,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: {
              deptId,
              machineNo,
              isChemicalFiber: isChemicalFiber ? 1 : 0,
              machineTypeId
            }
          });
          this.$message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          this.dialogVisible = false;
          this.getMachineList();
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
        this.paginationData = frontEndPagination(this.machineList, page, size);
      },
      selectedRow(data) {
        this.selectedData = data;
      },
      deptChange() {
        this.getMachineTypeList();
      },
      machineTypeChange() {
        const { machineTypeList, machineTypeId } = this;
        if(typeof machineTypeId !== "undefined") {
          const len = machineTypeList.length;
          for(let i = 0; i < len; i ++) {
            const item = machineTypeList[i];
            if(item.id === machineTypeId) {
              this.formulaDescription = item.formulaDescription;
            }
          }
        }
      },
      isChemicalFiberFormatter(row) {
        return row.isChemicalFiber === 0 ? "否" : "是";
      }
    }
  };
</script>

<style lang="less" scoped>
  #machine_configuration {
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
