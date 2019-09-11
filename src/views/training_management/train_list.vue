<template>
  <div id="train_list">
    <div class="header">
      <div class="header-operation">
        <el-button @click="dialogVisible = true" style="background-color: #53C0B0;" type="primary"
                   icon="el-icon-plus">
          增加
        </el-button>
        <batch-delete-button :selectedData="multipleSelectedData" :url="batchDeleteURL" :delete-callback="getTrainList"
                             id-key="id"></batch-delete-button>
        <file-download style="margin-left: 25px;" :url="downloadExcel" description="導出"
                       :params="params"></file-download>
      </div>
      <div class="header-search">
        <textile-department @input="getTrainList" style="width: 160px;" v-model="searchDeptId"></textile-department>
        <el-select @change="getTrainList" clearable class="left-distance" style="width: 220px;"
                   v-model="searchProjectId" placeholder="培訓項目">
          <el-option
            v-for="item of projectList"
            :key="item.id"
            :value="item.id"
            :label="item.title"
          ></el-option>
        </el-select>
        <el-input v-on:keyup.enter.stop.native="getTrainList" v-model="searchEmpId" class="left-distance"
                  style="width: 140px;" placeholder="工號" clearable @clear="getTrainList"></el-input>
        <el-date-picker @change="getTrainList" class="left-distance" type="daterange" clearable style="width: 260px;"
                        range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期"
                        value-format="yyyy-MM-dd" format="yyyyMMdd" v-model="searchDate" />
      </div>
    </div>
    <div class="table">
      <table-box @selection-change="multipleSelectedRow" :data="trainList">
        <el-table-column
          type="selection"
          width="35"
        ></el-table-column>
        <el-table-column
          min-width="90"
          prop="employeeId"
          label="工號"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="85"
          prop="employeeName"
          label="姓名"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="120"
          prop="deptName"
          label="部門"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="80"
          prop="employeePosition"
          label="職務"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="200"
          prop="trainProjectName"
          label="培訓項目"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="85"
          prop="teacher"
          label="培訓師"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="70"
          prop="classHour"
          label="時長"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="90"
          prop="trainDate"
          label="培訓日期"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="85"
          prop="evaluator"
          label="考评人"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="90"
          prop="teacherId"
          label="培訓師ID"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="90"
          prop="evaluatorId"
          label="考评人ID"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="90"
          prop="evaluatorDate"
          label="评估日期"
          align="center"
          :formatter="evaluatorDateFormatter"
        ></el-table-column>
        <el-table-column
          min-width="90"
          prop="employeeJoinDate"
          label="進廠日期"
          align="center"
          :formatter="employeeJoinDateFormatter"
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
    <el-dialog top="20px" width="70%" title="新增培訓記錄" :visible.sync="dialogVisible">
      <div class="dialog-row-item">
        <div class="dialog-cell-item">
          <span class="span-distance">項目ID</span>
          <el-input @clear="clearCode" clearable @keyup.enter.stop.native="getTrainProjectByCode" v-model="code"
                    placeholder="項目ID"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">培訓項目</span>
          <el-input readonly v-model="projectName" placeholder="培訓項目"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">培訓日期</span>
          <el-date-picker v-model="trainDate" value-format="yyyy-MM-dd" format="yyyyMMdd"
                          style="width: 100%;" placeholder="培訓日期"></el-date-picker>
        </div>
      </div>
      <div class="dialog-row-item">
        <div class="dialog-cell-item">
          <span class="span-distance">培訓師工號</span>
          <el-input v-model="teacherId" placeholder="培訓師工號"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">培訓師姓名</span>
          <el-input v-model="teacher" placeholder="培訓師姓名"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">培訓地點</span>
          <el-input v-model="address" placeholder="培訓地點"></el-input>
        </div>
      </div>
      <div class="dialog-row-item">
        <div class="dialog-cell-item">
          <span class="span-distance">培訓時長</span>
          <el-input-number :min="0" style="width: 100%;" :controls="false"
                           v-model="classHour" placeholder="培訓時長"></el-input-number>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">考評人ID</span>
          <el-input v-model="evaluatorId" placeholder="考評人ID"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">考評人</span>
          <el-input v-model="evaluator" placeholder="考評人"></el-input>
        </div>
      </div>
      <div class="dialog-row-item">
        <div class="dialog-cell-item">
          <span class="span-distance">評估日期</span>
          <el-date-picker v-model="evaluatorDate" value-format="yyyy-MM-dd" format="yyyyMMdd"
                          style="width: 100%;" placeholder="評估日期"></el-date-picker>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">部門</span>
          <textile-department @input="getEmployeeList" v-model="deptId"></textile-department>
        </div>
        <div class="dialog-cell-item">
          <span style="visibility: hidden;" class="span-distance">用于占位</span>
          <el-button style="background-color: #418DCF;" type="primary" @click="toggleSelection">
            表 格 反 選
          </el-button>
        </div>
      </div>
      <div style="height: 400px;margin-top: 10px;">
        <el-table
          ref="traintableRef"
          border
          height="100%"
          style="width:100%;"
          tooltip-effect="light"
          size="mini"
          @selection-change="trainSelectionChange"
          :data="employeeList"
        >
          <el-table-column
            type="selection"
            width="35"
          ></el-table-column>
          <el-table-column
            min-width="100"
            prop="empId"
            label="工號"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="100"
            prop="empName"
            label="姓名"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button style="background-color: #418DCF;" type="primary" @click="addConfirmAxios">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { EMPLOYEE, PROJECT, TRAIN, TRAIN_PROJECT, DELETE_LIST_BATCH, LIST_DOWNLOAD_EXCEL } from "@/api/train";
  import { default_page_size } from "@/utils/common_variable";

  export default {
    name: "train_list",
    data() {
      return {
        isClick: false,
        trainList: [],
        projectList: [],
        employeeList: [],
        deleteConfirmVisible: false,
        loading: false,
        pageNum: 1,
        pageSize: default_page_size,
        total: 0,
        dialogVisible: false,
        doLayout: true,
        multipleSelectedData: [],
        //查詢參數
        searchDeptId: undefined,
        searchProjectId: undefined,
        searchEmpId: "",
        searchDate: null,
        //新增的請求參數
        code: "",
        projectName: "",
        trainProjectId: null,
        trainDate: null,
        teacherId: "",
        teacher: "",
        address: "",
        classHour: 0,
        evaluatorId: "",
        evaluator: "",
        evaluatorDate: null,
        deptId: undefined,
        selectedEmployeeList: []
      };
    },
    computed: {
      batchDeleteURL() {
        return DELETE_LIST_BATCH;
      },
      downloadExcel() {
        return LIST_DOWNLOAD_EXCEL;
      },
      params() {
        const { searchDeptId, searchProjectId, searchEmpId, searchDate } = this;
        const [startDate, endDate] = searchDate || [];
        const employeeId = searchEmpId.trim().length === 0 ? undefined : searchEmpId;
        return {
          deptId: searchDeptId,
          trainProjectId: searchProjectId,
          empId: employeeId,
          startDate,
          endDate
        };
      }
    },
    created() {
      this.getTrainList();
      this.getProjectList();
    },
    methods: {
      async getTrainList() {
        try {
          const { pageNum, pageSize, searchDeptId, searchProjectId, searchEmpId, searchDate } = this;
          const [startDate, endDate] = searchDate || [];
          const employeeId = searchEmpId.trim().length === 0 ? undefined : searchEmpId;
          const res = await this.$axios.request({
            url: TRAIN,
            params: {
              pageNum,
              pageSize,
              deptId: searchDeptId,
              projectId: searchProjectId,
              employeeId,
              startDate,
              endDate
            }
          });
          this.trainList = res.list;
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
          this.trainList = [];
          this.total = 0;
        }
      },
      async getProjectList() {
        try {
          const res = await this.$axios.request({
            url: PROJECT,
            params: {
              pageNum: 1,
              pageSize: 10000
            }
          });
          this.projectList = res.list;
        } catch(e) {
          this.projectList = [];
        }
      },
      async getTrainProjectByCode() {
        try {
          const code = this.code.trim();
          if(code.length > 0) {
            const res = await this.$axios.request({
              url: TRAIN_PROJECT,
              params: {
                code
              }
            });
            this.trainProjectId = res.id;
            this.projectName = res.title;
            this.classHour = res.classHour;
          }
        } catch(e) {
          this.trainProjectId = null;
          this.projectName = "";
          this.classHour = 0;
        }
      },
      clearCode() {
        this.trainProjectId = null;
        this.projectName = "";
        this.classHour = 0;
      },
      async getEmployeeList() {
        try {
          const deptId = this.deptId;
          if(deptId) {
            const res = await this.$axios.request({
              url: EMPLOYEE,
              params: {
                pageNum: 1,
                pageSize: 10000,
                status: 1,
                deptId
              }
            });
            this.employeeList = res.list;
          } else {
            this.employeeList = [];
          }
        } catch(e) {
          this.employeeList = [];
        }
      },
      async addConfirmAxios() {
        try {
          const {
            trainProjectId, trainDate, teacherId, teacher, address, classHour,
            evaluatorId, evaluator, evaluatorDate, deptId, selectedEmployeeList
          } = this;
          if(!trainProjectId) {
            this.$message({
              message: "培訓項目不允許為空!",
              type: "error"
            });
            return;
          }
          if(teacherId.trim().length === 0) {
            this.$message({
              message: "培訓師工號不允許為空!",
              type: "error"
            });
            return;
          }
          if(teacher.trim().length === 0) {
            this.$message({
              message: "培訓師姓名不允許為空!",
              type: "error"
            });
            return;
          }
          if(!trainDate) {
            this.$message({
              message: "培訓日期不允許為空!",
              type: "error"
            });
            return;
          }
          if(!classHour) {
            this.$message({
              message: "培訓時長不允許為空!",
              type: "error"
            });
            return;
          }
          if(selectedEmployeeList.length === 0) {
            this.$message({
              message: "培訓職工不允許為空!",
              type: "error"
            });
            return;
          }
          if(this.isClick) {
            return;
          }
          this.isClick = true;
          const length = selectedEmployeeList.length;
          const empList = [];
          for(let i = 0; i < length; i ++) {
            const item = selectedEmployeeList[i];
            empList[i] = {
              employeeId: item.empId
            };
          }
          const { request, method } = this.$axios;
          await request({
            url: TRAIN,
            method: method.POST,
            data: {
              address,
              classHour,
              deptId,
              empList,
              evaluator,
              evaluatorDate,
              evaluatorId,
              teacher,
              teacherId,
              trainDate,
              trainProjectId
            }
          });
          this.$message({
            message: "新增成功!"
          });
          this.dialogVisible = false;
          this.getTrainList();
        } finally {
          this.isClick = false;
        }
      },
      deleteConfirm() {

      },
      toggleSelection() {
        const employeeList = this.employeeList;
        const lenght = employeeList.length;
        for(let i = 0; i < lenght; i ++) {
          const item = employeeList[i];
          this.$refs.traintableRef.toggleRowSelection(item);
        }
      },
      multipleSelectedRow(selection) {
        this.multipleSelectedData = selection;
      },
      trainSelectionChange(selection) {
        this.selectedEmployeeList = selection;
      },
      sizeChange(size) {
        this.pageSize = size;
        this.getTrainList();
      },
      pageChange(page) {
        this.pageNum = page;
        this.getTrainList();
      },
      evaluatorDateFormatter(row) {
        return row.evaluatorDate ? new Date(row.evaluatorDate).format("yyyy-MM-dd") : "";
      },
      employeeJoinDateFormatter(row) {
        return row.employeeJoinDate ? new Date(row.employeeJoinDate).format("yyyy-MM-dd") : "";
      },
      selectionChange(selection) {
        this.multipleSelectedData = selection;
      }
    }
  };
</script>

<style lang="less" scoped>
  #train_list {
    display: flex;
    flex-direction: column;
    height: 100%;

    .header {
      display: flex;
      flex-direction: column;
      padding-bottom: 15px;
      min-width: 815px;

      .header-layout {
        display: flex;
        flex-flow: row wrap;
      }

      .header-operation {
        .header-layout();
        padding-bottom: 10px;
      }

      .header-search {
        .header-layout();

        .left-distance {
          margin-left: 10px;
        }
      }
    }

    .table {
      height: calc(100% - 121px);
    }

    .dialog-row-item {
      display: flex;
      flex-flow: row wrap;

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
  }
</style>
