<template>
  <div id="textile_position_list">
    <div class="header">
      <el-button @click="addAndUpdateButtonHandler(false)" style="background-color: #53C0B0;" type="primary"
                 icon="el-icon-plus">
        增加
      </el-button>
      <el-button @click="addAndUpdateButtonHandler(true)" style="background-color: #5BC0DE;" type="primary"
                 icon="el-icon-edit">
        更新
      </el-button>
      <batch-delete-button :selected-data="multipleSelectedData" :is-real="true" :url="positionURL" id-key="id"
                           :delete-callback="getTextilePositionList"></batch-delete-button>
      <textile-department class="left-distance" style="width: 160px;" @input="getTextilePositionList"
                          v-model="searchDeptId"></textile-department>
    </div>
    <div class="table">
      <table-box @selection-change="selectionChange" @current-change="selectedRow" :data="textilePositionList"
                 highlight-current-row>
        <el-table-column
          type="selection"
          width="35"
        />
        <el-table-column
          min-width="90"
          prop="code"
          label="崗位編號"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="120"
          prop="name"
          label="崗位名稱"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="120"
          prop="deptName"
          label="所屬部門"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="70"
          prop="posiRate"
          label="崗位係數"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="120"
          prop="workcontent"
          label="工作內容"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="150"
          prop="description"
          label="崗位描述"
          align="center"
        ></el-table-column>
      </table-box>
    </div>
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
    <el-dialog width="30%" title="新增崗位" :visible.sync="dialogVisible">
      <div class="dialog-cell-item">
        <span class="span-distance">所屬部門</span>
        <textile-department v-model="deptId"></textile-department>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">崗位名稱</span>
        <el-input v-model="name" clearable placeholder="崗位名稱"></el-input>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">工作內容</span>
        <el-select v-model="workcontent" placeholder="工作內容">
          <el-option
            :key="item.id"
            :label="item.description"
            :value="item.description"
            v-for="item of workContentList"
          ></el-option>
        </el-select>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">崗位係數</span>
        <el-input-number v-model="posiRate" :min="0" style="width: 100%;" :controls="false"
                         placeholder="崗位係數"></el-input-number>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">描述</span>
        <el-input v-model="description" type="textarea" :autosize="{ minRows: 1, maxRows: 5}"
                  clearable placeholder="描述"></el-input>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button style="background-color: #418DCF;" type="primary" @click="addAndUpdateAxios">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { POSITION, WORK_CONTENT } from "@/api/textile_position.js";
  import { default_page_size } from "@/utils/common_variable";

  export default {
    name: "textile_position_list",
    data() {
      return {
        isClick: false,
        textilePositionList: [],
        workContentList: [],
        selectedData: null,
        multipleSelectedData: [],
        loading: false,
        pageNum: 1,
        pageSize: default_page_size,
        total: 0,
        dialogVisible: false,
        isUpdateOperation: false,
        //查詢參數
        searchDeptId: undefined,
        //新增或更新的請求參數
        deptId: undefined,
        workcontent: undefined,
        posiRate: 0,
        name: "",
        description: ""
      };
    },
    computed: {
      positionURL() {
        return POSITION;
      }
    },
    created() {
      this.getTextilePositionList();
      this.getWorkContentList();
    },
    methods: {
      async getTextilePositionList() {
        try {
          const { pageNum, pageSize, searchDeptId } = this;
          const res = await this.$axios.request({
            url: POSITION,
            params: {
              pageNum,
              pageSize,
              isAdditional: true,
              deptId: searchDeptId
            }
          });
          this.textilePositionList = res.list;
          this.pageNum = res.pageNum;
          this.pageSize = res.pageSize;
          this.total = res.total;
        } catch(e) {
          this.textilePositionList = [];
          this.total = 0;
        }
      },
      async getWorkContentList() {
        try {
          this.workContentList = await this.$axios.request({
            url: WORK_CONTENT,
          });
        } catch(e) {
          this.workContentList = [];
        }
      },
      addAndUpdateButtonHandler(isUpdateOperation) {
        if(isUpdateOperation) {
          if(!this.selectedData) {
            this.$message({
              message: "請選擇要修改的數據!",
              type: "error"
            });
            return null;
          }
          const { deptId, workcontent, posiRate, name, description } = this.selectedData;
          this.deptId = deptId;
          this.workcontent = workcontent;
          this.posiRate = posiRate;
          this.name = name;
          this.description = description;
        } else {
          this.deptId = undefined;
          this.workcontent = undefined;
          this.posiRate = 0;
          this.name = "";
          this.description = "";
        }
        this.isUpdateOperation = isUpdateOperation;
        this.dialogVisible = true;
      },
      async addAndUpdateAxios() {
        const { deptId, workcontent, posiRate, name, description, isUpdateOperation } = this;
        if(!deptId) {
          this.$message({
            message: "部門不允許為空",
            type: "error"
          });
          return null;
        }
        if(name.trim().length === 0) {
          this.$message({
            message: "崗位名稱不允許為空",
            type: "error"
          });
          return null;
        }
        if(!posiRate) {
          this.$message({
            message: "崗位係數不允許為空",
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
          const url = isUpdateOperation ? `${ POSITION }/${ this.selectedData.id }` : POSITION;
          await request({
            url,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: {
              deptId,
              workcontent,
              posiRate,
              name,
              description
            }
          });
          this.$message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          this.dialogVisible = false;
          this.getTextilePositionList();
        } finally {
          this.isClick = false;
        }
      },
      sizeChange(size) {
        this.pageSize = size;
        this.$nextTick(this.getTextilePositionList);
      },
      pageChange(page) {
        this.pageNum = page;
        this.$nextTick(this.getTextilePositionList);
      },
      selectedRow(data) {
        this.selectedData = data;
      },
      selectionChange(selection) {
        this.multipleSelectedData = selection;
      },
    }
  };
</script>

<style lang="less" scoped>
  #textile_position_list {
    display: flex;
    flex-direction: column;
    height: 100%;

    .header {
      display: flex;
      flex-flow: row wrap;
      padding-bottom: 15px;

      .left-distance {
        margin-left: 10px;
      }
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
