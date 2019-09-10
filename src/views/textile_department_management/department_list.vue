<template>
  <div id="department-list">
    <div class="header">
      <el-button @click="clickAddButton" style="background-color: #53C0B0;" type="primary"
                 icon="el-icon-plus">
        增加
      </el-button>
      <el-button @click="clickUpdateButton" style="background-color: #5BC0DE;" type="primary"
                 icon="el-icon-edit">
        更新
      </el-button>
      <delete-button :delete-callback="getDepartmentList" description-key="name" id-key="id"
                     :selected-data="selectedData" :url="departmentURL"></delete-button>
    </div>
    <div class="table">
      <table-box row-key="id" :data="departmentList" highlight-current-row @current-change="selectedRow"
                 :tree-props="{children: 'children'}">
        <el-table-column
          min-width="150"
          prop="name"
          label="部門名稱"
          align="left"
        ></el-table-column>
        <el-table-column
          min-width="130"
          prop="description"
          label="部門描述"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="110"
          prop="code"
          label="編碼"
          align="center"
        ></el-table-column>
        <!--        <el-table-column-->
        <!--          min-width="50"-->
        <!--          prop="level"-->
        <!--          label="層級"-->
        <!--          align="center"-->
        <!--        ></el-table-column>-->
        <el-table-column
          min-width="120"
          prop="createBy"
          label="創建者"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="100"
          prop="createTime"
          label="創建時間"
          align="center"
          :formatter="createTimeFormatter"
        ></el-table-column>
        <el-table-column
          min-width="100"
          prop="updateTime"
          label="修改時間"
          align="center"
          :formatter="updateTimeFormatter"
        ></el-table-column>
      </table-box>
    </div>
    <el-dialog width="30%" :title="`${isUpdateOperation ? '更新' : '新增'}部門信息`" :visible.sync="dialogVisible">
      <div class="dialog-cell-item">
        <span class="span-distance"><el-checkbox v-model="topDepartment">一級部門</el-checkbox></span>
        <textile-department :disabled="topDepartment" v-model="deptId"></textile-department>
        <span style="font-size: 10px;">注：若想添加一級部門，請勾選上面的”一級部門“</span>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">部門名稱</span>
        <el-input v-model="deptName" clearable placeholder="部門名稱"></el-input>
      </div>
      <!--      <div class="dialog-cell-item">-->
      <!--        <span class="span-distance">部門編碼</span>-->
      <!--        <el-input v-model="deptCode" clearable placeholder="部門編碼"></el-input>-->
      <!--      </div>-->
      <div class="dialog-cell-item">
        <span class="span-distance">部門描述</span>
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="deptDescription" clearable
                  placeholder="部門描述"></el-input>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="loading" :disabled="loading" style="background-color: #418DCF;" type="primary"
                   @click="addAndUpdateAixos">
          {{isUpdateOperation ? "更 新" : "确 定"}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { DEPARTMENT } from "@/api/textile_department_management.js";

  export default {
    name: "department_list",
    data() {
      return {
        departmentList: [],
        selectedData: null,
        isUpdateOperation: false,
        dialogVisible: false,
        loading: false,
        //增加和更新請求參數
        topDepartment: false,
        deptId: undefined,
        deptName: "",
        // deptCode: "",
        deptDescription: ""
      };
    },
    computed: {
      departmentURL() {
        return DEPARTMENT;
      }
    },
    created() {
      this.getDepartmentList();
    },
    methods: {
      async getDepartmentList() {
        try {
          this.departmentList = await this.$axios.request({
            url: DEPARTMENT,
            params: {
              tree: true
            }
          });
        } catch(e) {
          this.departmentList = [];
        }
      },
      clickAddButton() {
        this.topDepartment = false;
        this.deptId = undefined;
        this.deptName = "";
        // this.deptCode = "";
        this.deptDescription = "";
        this.dialogVisible = true;
        this.isUpdateOperation = false;
      },
      clickUpdateButton() {
        if(!this.selectedData) {
          this.$message({
            message: "請選擇要修改的數據!",
            type: "error"
          });
          return null;
        }
        // , code
        const { name, parentId, description } = this.selectedData;
        if(parentId === 0) {
          this.topDepartment = true;
          this.deptId = undefined;
        } else {
          this.topDepartment = false;
          this.deptId = parentId;
        }
        this.deptName = name;
        // this.deptCode = code;
        this.deptDescription = description;
        this.dialogVisible = true;
        this.isUpdateOperation = true;
      },
      async addAndUpdateAixos() {
        // deptCode,
        const {
          deptId, topDepartment, deptName, deptDescription,
          isUpdateOperation, $message, loading
        } = this;
        if(!topDepartment && !deptId) {
          $message({
            message: "部門不允許為空",
            type: "error"
          });
          return null;
        }
        if(deptName.trim().length === 0) {
          $message({
            message: "部門名稱不允許為空",
            type: "error"
          });
          return null;
        }

        try {
          if(loading) {
            return null;
          }
          this.loading = true;
          // const code = deptCode.trim();
          const description = deptDescription.trim();
          const parentId = topDepartment ? 0 : deptId;
          const name = deptName.trim();
          const { request, method } = this.$axios;
          const url = isUpdateOperation ? `${ DEPARTMENT }/${ this.selectedData.id }` : DEPARTMENT;
          await request({
            url,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: {
              // code,
              description,
              parentId,
              name
            }
          });
          this.$message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          this.dialogVisible = false;
          this.getDepartmentList();
        } finally {
          this.loading = false;
        }
      },
      selectedRow(data) {
        this.selectedData = data;
      },
      createTimeFormatter(row) {
        return row.createTime.split(" ")[0];
      },
      updateTimeFormatter(row) {
        return row.updateTime.split(" ")[0];
      },
    }
  };
</script>

<style lang="less" scoped>
  #department-list {
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
