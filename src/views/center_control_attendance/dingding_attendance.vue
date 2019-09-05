<template>
  <div id="dingding_attendance">
    <div class="header">
      <el-date-picker @change="startDateChange" clearable style="width: 160px;margin-right: 10px;" v-model="startDate"
                      placeholder="開始日期" value-format="yyyy-MM-dd" format="yyyyMMdd" />
      <el-date-picker @change="endDateChange" clearable style="width: 160px;margin-right: 50px;" v-model="endDate"
                      placeholder="結束日期" value-format="yyyy-MM-dd" format="yyyyMMdd" />
      <el-button @click="attendanceAddButton" style="background-color: #53C0B0;" type="primary"
                 icon="el-icon-plus">
        釘釘考勤録入
      </el-button>
      <el-button @click="snAddButton" style="background-color: #5BC0DE;" type="primary"
                 icon="el-icon-edit">
        考勤機SN號設置
      </el-button>
    </div>
    <div class="table">
      <table-box @current-change="selectedRow" :data="attendanceList" highlight-current-row>
        <el-table-column
          min-width="100"
          prop="badgenumber"
          label="人员编号"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="90"
          prop="name"
          label="姓名"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="140"
          prop="deptName"
          label="部门名称"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="200"
          prop="checktime"
          label="打卡时间"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="70"
          prop="checktype"
          label="考勤类型"
          align="center"
          :formatter="checktypeFormatter"
        ></el-table-column>
        <el-table-column
          min-width="180"
          prop="sn"
          label="考勤机SN号"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="90"
          prop="verifycode"
          label="有效卡標識"
          align="center"
        ></el-table-column>
      </table-box>
    </div>
    <el-dialog width="30%" title="钉钉考勤录入" :visible.sync="attendanceAddVisible">
      <div class="dialog-cell-item">
        <span class="span-distance">員工編號</span>
        <el-input :autosize="{ minRows: 1, maxRows: 10}" type="textarea" clearable v-model="userIds"
                  placeholder="員工編號"></el-input>
        <span class="span-distance">注：多個編號用 , 隔開</span>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">日期</span>
        <el-date-picker type="daterange" clearable style="width: 100%;" v-model="date"
                        range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期"
                        value-format="yyyy-MM-dd HH:mm:ss" format="yyyyMMdd" />
      </div>
      <div slot="footer">
        <el-button @click="attendanceAddVisible = false">取 消</el-button>
        <el-button style="background-color: #418DCF;" type="primary" @click="attendanceAddAxios">
          确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog width="30%" title="考勤機SN號設置" :visible.sync="snNumberVisible">
      <div class="dialog-cell-item">
        <span class="span-distance">上班考勤机SN号</span>
        <el-input clearable v-model="onDutySn" placeholder="上班考勤机SN号"></el-input>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">下班考勤机SN号</span>
        <el-input clearable v-model="offDutySn" placeholder="下班考勤机SN号"></el-input>
      </div>
      <div slot="footer">
        <el-button @click="snNumberVisible = false">取 消</el-button>
        <el-button style="background-color: #418DCF;" type="primary" @click="snNumberAddAxios">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { ATTENDANCE, SN_NO } from "@/api/center_control_attendance.js";
  import { default_page_size, today } from "@/utils/common_variable";

  export default {
    name: "dingding_attendance",
    data() {
      return {
        isClick: false,
        attendanceList: [],
        snNumber: null,
        selectedData: null,
        attendanceAddVisible: false,
        snNumberVisible: false,
        //查询参数
        pageNum: 1,
        pageSize: default_page_size,
        startDate: today.format("yyyy-MM") + "-01",
        endDate: today.format("yyyy-MM-dd"),
        //考勤録入參數
        userIds: "",
        date: null,
        //考勤機SN號設置參數
        onDutySn: "",
        offDutySn: ""
      };
    },
    created() {
      this.getAttendanceList();
      this.getSnNumber();
    },
    methods: {
      async getAttendanceList() {
        const { pageNum, pageSize, startDate, endDate } = this;
        try {
          this.attendanceList = await this.$axios.request({
            url: ATTENDANCE,
            params: {
              pageNum,
              pageSize,
              startDate,
              endDate
            }
          });
        } catch(e) {
          this.attendanceList = [];
        }
      },
      async getSnNumber() {
        try {
          this.snNumber = await this.$axios.request({
            url: SN_NO
          });
        } catch(e) {
          this.snNumber = null;
        }
      },
      attendanceAddButton() {
        this.userIds = "";
        this.date = null;
        this.attendanceAddVisible = true;
      },
      async attendanceAddAxios() {
        let { date, userIds } = this;
        if(userIds.trim().length === 0) {
          this.$message({
            message: "員工編號不能為空!",
            type: "error"
          });
          return null;
        }
        if(!date) {
          this.$message({
            message: "日期不能為空!",
            type: "error"
          });
          return null;
        }
        try {
          if(this.isClick) {
            return null;
          }
          this.isClick = true;
          const patt = /，/g;
          userIds = userIds.replace(patt, ",").trim();
          const [checkDateFrom, checkDateTo] = date;
          const { request, method } = this.$axios;
          await request({
            url: ATTENDANCE,
            method: method.POST,
            data: {
              checkDateFrom,
              checkDateTo,
              userIds
            }
          });
          this.$message({
            message: "新增成功"
          });
          this.attendanceAddVisible = false;
          this.getAttendanceList();
        } finally {
          this.isClick = false;
        }
      },
      snAddButton() {
        if(this.snNumber) {
          this.onDutySn = this.snNumber.onDutySn;
          this.offDutySn = this.snNumber.offDutySn;
        } else {
          this.onDutySn = "";
          this.offDutySn = "";
        }
        this.snNumberVisible = true;
      },
      async snNumberAddAxios() {
        const { onDutySn, offDutySn } = this;
        if(onDutySn.trim().length === 0) {
          this.$message({
            message: "上班考勤机SN号不能為空!",
            type: "error"
          });
          return null;
        }
        if(offDutySn.trim().length === 0) {
          this.$message({
            message: "下班考勤机SN号不能為空!",
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
          await request({
            url: SN_NO,
            method: method.PUT,
            data: {
              onDutySn: onDutySn.trim(),
              offDutySn: offDutySn.trim()
            }
          });
          this.$message({
            message: "更新成功"
          });
          this.snNumberVisible = false;
          this.getSnNumber();
        } finally {
          this.isClick = false;
        }
      },
      selectedRow(data) {
        this.selectedData = data;
      },
      startDateChange() {
        this.getAttendanceList();
      },
      endDateChange() {
        this.getAttendanceList();
      },
      checktypeFormatter(row) {
        let checktype = "";
        if(row.checktype.length > 0) {
          checktype = row.checktype === "0" ? "上班签到" : "下班签到";
        }
        return checktype;
      }
    }
  };
</script>

<style lang="less" scoped>
  #dingding_attendance {
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
