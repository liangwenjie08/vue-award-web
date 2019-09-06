<template>
  <div id="train_summary">
    <div class="header">
      <div class="header-operation">
        <el-button @click="addAndUpdateButtonHandler(false)" style="background-color: #53C0B0;" type="primary"
                   icon="el-icon-plus">
          增加
        </el-button>
        <el-button @click="addAndUpdateButtonHandler(true)" style="background-color: #5BC0DE;" type="primary"
                   icon="el-icon-edit">
          更新
        </el-button>
        <el-popover
          placement="top"
          width="160"
          v-model="deleteConfirmVisible"
          style="margin-left: 10px;margin-right: 10px;">
          <p>
            确定删除<strong>{{ deleteTip }}</strong>吗？
          </p>
          <div style="text-align: right; margin: 0">
            <el-button type="text" @click="deleteConfirmVisible = false">取消</el-button>
            <el-button type="primary" style="background-color: red;margin-left: 20px;" size="mini"
                       @click="deleteConfirm">
              确定
            </el-button>
          </div>
          <el-button slot="reference" style="background-color: red;outline: none;" type="primary"
                     icon="el-icon-delete-solid">
            刪除
          </el-button>
        </el-popover>
      </div>
      <div class="header-search">
        <el-input v-on:keyup.enter.stop.native="getTrainSummaryList" v-model="searchTitle"
                  style="width: 240px;" placeholder="培訓標題" clearable @clear="getTrainSummaryList"></el-input>
        <el-date-picker @change="getTrainSummaryList" class="left-distance" type="daterange" clearable
                        style="width: 260px;"
                        range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期"
                        value-format="yyyy-MM-dd" format="yyyyMMdd" v-model="searchDate" />
      </div>
    </div>
    <div class="table">
      <table-box @selection-change="selectionChange" @current-change="selectedRow" :data="trainSummaryList"
                 highlight-current-row>
        <el-table-column
          type="selection"
          width="35"
        />
        <el-table-column
          min-width="85"
          prop="code"
          label="項目編號"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="230"
          prop="title"
          label="培訓標題"
          align="left"
        ></el-table-column>
        <el-table-column
          min-width="90"
          prop="teacher"
          label="培訓師"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="100"
          prop="trainWay"
          label="培訓方式"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="100"
          prop="checkWay"
          label="考核方式"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="70"
          prop="classHour"
          label="培訓時長"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="120"
          prop="classTypeNum"
          label="課程編碼"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="500"
          prop="description"
          label="培訓描述"
          align="left"
          show-overflow-tooltip
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
    <el-dialog width="30%" title="新增培訓項目" :visible.sync="dialogVisible">
      <div class="dialog-cell-item">
        <span class="span-distance">項目ID</span>
        <el-input v-model="code" clearable placeholder="項目ID"></el-input>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">培訓標題</span>
        <el-input v-model="title" clearable placeholder="培訓標題"></el-input>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">培訓時長</span>
        <el-input-number :min="0" style="width: 100%;" :controls="false"
                         v-model="classHour" placeholder="培訓時長"></el-input-number>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">培訓師</span>
        <el-input v-model="teacher" clearable placeholder="培訓師"></el-input>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">培訓方式</span>
        <el-input v-model="trainWay" clearable placeholder="培訓方式"></el-input>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">考核方式</span>
        <el-input v-model="checkWay" clearable placeholder="考核方式"></el-input>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">課程類型編號</span>
        <el-input v-model="classTypeNum" clearable placeholder="課程類型編號"></el-input>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">培訓詳情</span>
        <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 5}" v-model="description"
                  clearable placeholder="培訓詳情"></el-input>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :disabled="loading" :loading="loading" style="background-color: #418DCF;" type="primary"
                   @click="addConfirmAxios">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { TRAIN_SUMMARY, DELETE_BATCH } from "@/api/train";
  import { default_page_size } from "@/utils/common_variable";

  export default {
    name: "train_summary",
    data() {
      return {
        isClick: false,
        trainSummaryList: [],
        deleteConfirmVisible: false,
        selectedData: null,
        multipleSelectedData: [],
        loading: false,
        doLayout: true,
        pageNum: 1,
        pageSize: default_page_size,
        total: 0,
        dialogVisible: false,
        isUpdateOperation: false,
        //查詢參數
        searchDate: null,
        searchTitle: "",
        //增加和更新請求參數
        checkWay: "",
        classHour: 0,
        classTypeNum: "",
        code: "",
        description: "",
        title: "",
        trainWay: "",
        teacher: ""
      };
    },
    computed: {
      deleteTip() {
        const multipleSelectedData = this.multipleSelectedData;
        const length = multipleSelectedData.length;
        let message = "";
        for(let i = 0; i < length; i ++) {
          const item = multipleSelectedData[i];
          message += item.title;
          if(i < length - 1) {
            message += ",";
          }
        }
        return message;
      }
    },
    created() {
      this.getTrainSummaryList();
    },
    methods: {
      async getTrainSummaryList() {
        try {
          const { pageNum, pageSize, searchTitle, searchDate } = this;
          const [startDate, endDate] = searchDate || [];
          const title = searchTitle.trim().length === 0 ? undefined : searchTitle;
          const res = await this.$axios.request({
            url: TRAIN_SUMMARY,
            params: {
              pageNum,
              pageSize,
              title,
              startDate,
              endDate
            }
          });
          this.trainSummaryList = res.list;
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
          this.trainSummaryList = [];
          this.total = 0;
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
          const { checkWay, classHour, classTypeNum, code, description, title, trainWay, teacher } = this.selectedData;

          this.checkWay = checkWay;
          this.classHour = classHour;
          this.classTypeNum = classTypeNum;
          this.code = code;
          this.description = description;
          this.title = title;
          this.trainWay = trainWay;
          this.teacher = teacher;
        } else {
          this.checkWay = "";
          this.classHour = 0;
          this.classTypeNum = "";
          this.code = "";
          this.description = "";
          this.title = "";
          this.trainWay = "";
          this.teacher = "";
        }
        this.isUpdateOperation = isUpdateOperation;
        this.dialogVisible = true;
      },
      async addConfirmAxios() {
        const { checkWay, classHour, classTypeNum, code, description, title, trainWay, teacher, isUpdateOperation } = this;
        const message = this.$message;
        if(code.trim().length === 0) {
          message({
            message: "培訓項目ID不允許為空",
            type: "error"
          });
          return;
        }
        if(title.trim().length === 0) {
          message({
            message: "培訓項目標題不允許為空",
            type: "error"
          });
          return;
        }
        if(teacher.trim().length === 0) {
          message({
            message: "培訓師不允許為空",
            type: "error"
          });
          return;
        }
        if(!classHour) {
          message({
            message: "培訓時長不允許為空",
            type: "error"
          });
          return;
        }
        try {
          if(this.isClick) {
            return null;
          }
          this.isClick = true;
          this.loading = true;
          const url = isUpdateOperation ? `${ TRAIN_SUMMARY }/${ this.selectedData.id }` : TRAIN_SUMMARY;
          const { request, method } = this.$axios;
          await request({
            url,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: {
              checkWay,
              classHour,
              classTypeNum,
              code,
              description,
              title,
              trainWay,
              teacher
            }
          });
          message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          this.dialogVisible = false;
          this.getTrainSummaryList();
        } finally {
          this.loading = false;
          this.isClick = false;
        }
      },
      async deleteConfirm() {
        const multipleSelectedData = this.multipleSelectedData;
        if(multipleSelectedData.length === 0) {
          this.$message({
            message: "請選擇需要刪除的數據!",
            type: "error"
          });
          return;
        }
        try {
          if(this.isClick) {
            return null;
          }
          this.isClick = true;
          const length = multipleSelectedData.length;
          let ids = "";
          for(let i = 0; i < length; i ++) {
            const item = multipleSelectedData[i];
            ids += item.id;
            if(i < length - 1) {
              ids += ",";
            }
          }
          const { request, method } = this.$axios;
          await request({
            url: DELETE_BATCH,
            method: method.DELETE,
            params: {
              isReal: false,
              ids
            }
          });
          this.$message({
            message: "刪除成功"
          });
          this.deleteConfirmVisible = false;
          this.getTrainSummaryList();
        } finally {
          this.isClick = false;
        }
      },
      sizeChange(size) {
        this.pageSize = size;
        this.$nextTick(this.getTrainSummaryList);
      },
      pageChange(page) {
        this.pageNum = page;
        this.$nextTick(this.getTrainSummaryList);
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
  #train_summary {
    display: flex;
    flex-direction: column;
    height: 100%;

    .header {
      display: flex;
      flex-direction: column;
      padding-bottom: 15px;

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
