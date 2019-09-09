<template>
  <div id="switch_insert">
    <div class="header">
      <div class="header-search">
        <el-date-picker @change="getSwitchEmployeeList" v-model="searchDate" value-format="yyyy-MM-dd" format="yyyyMMdd"
                        :picker-options="datePickerOptions" style="width: 150px;" placeholder="查詢日期"></el-date-picker>
        <textile-department @input="getSwitchEmployeeList" class="left-distance" style="width: 180px;"
                            v-model="searchDeptId"></textile-department>
        <el-select @change="getSwitchEmployeeList" class="left-distance" style="width: 100px;" v-model="searchShift"
                   clearable placeholder="班制">
          <el-option
            :key="item"
            :label="item"
            :value="item"
            v-for="item of shiftList"
          ></el-option>
        </el-select>
      </div>
      <div class="header-submit">
        <el-button type="primary" style="background-color: #418DCF;">提交</el-button>
        <el-button type="primary" style="background-color: #418DCF;">提交</el-button>
      </div>
    </div>
    <table-form-layout :style.native="{height: 'calc(100% - 50px)'}">
      <template #table>
        <table-box @current-change="currentChange" :data="switchEmployeeList" highlight-current-row>
          <el-table-column
            min-width="90"
            prop="employeeId"
            label="員工編號"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="90"
            prop="employeeName"
            label="員工名稱"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="50"
            prop="shift"
            label="班制"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="70"
            prop="task"
            label="工作内容"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="70"
            prop="borrowFlag"
            label="是否外借"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="90"
            prop="helper"
            label="幫工"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="50"
            prop="empGroup"
            label="分組"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="60"
            prop="machineCount"
            label="值機數"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="280"
            prop="machineNo"
            label="機號"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="110"
            prop="deptName"
            label="原車間"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="110"
            prop="borrowingName"
            label="借入車間"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="50"
            prop="empGroup"
            label="分組"
            align="center"
          ></el-table-column>
        </table-box>
      </template>
      <template #form>
        <div class="form">
          <div class="dialog-cell-item">
            <span class="span-distance">員工</span>
            <el-input :value="employeeId + '-' + employeeName" readonly clearable placeholder="員工"></el-input>
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">交班日期</span>
            <el-input :value="exshiftDate" readonly clearable placeholder="交班日期"></el-input>
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">班制</span>
            <el-select v-model="shift" clearable placeholder="班制">
              <el-option
                :key="item"
                :label="item"
                :value="item"
                v-for="item of shiftList"
              ></el-option>
            </el-select>
            <!--            <el-input v-model="shift" clearable placeholder="班制"></el-input>-->
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">外借車間</span>
            <textile-department v-model="borrowingWorkshop"></textile-department>
            <span style="font-size: 0.7rem;">注：選中即為外借</span>
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">幫工</span>
            <el-input v-model="helper" clearable placeholder="幫工"></el-input>
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">工作內容</span>
            <el-select v-model="task" clearable placeholder="工作內容">
              <el-option
                :key="item.description"
                :label="item.description"
                :value="item.description"
                v-for="item of taskList"
              ></el-option>
            </el-select>
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">機台編號</span>
            <el-input v-model="machineNo" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" clearable
                      placeholder="機台編號"></el-input>
            <span style="font-size: 0.7rem;">機台數：{{ machineCount }}</span>
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">分組</span>
            <el-select v-model="empGroup" clearable placeholder="分組">
              <el-option
                :key="item"
                :label="item"
                :value="item"
                v-for="item of groupList"
              ></el-option>
            </el-select>
          </div>
          <div class="dialog-cell-item">
            <el-checkbox v-model="autoNext">自動跳轉到下一條未録入記録</el-checkbox>
          </div>
          <div class="dialog-cell-item">
            <el-button @click="saveEmployeeSwitch" type="primary" style="background-color: #418DCF;margin-top: 15px;">
              保存
            </el-button>
          </div>
        </div>
      </template>
    </table-form-layout>
  </div>
</template>

<script>
  import { SWITCH_ENTER, TASK_LIST } from "@/api/switch_management.js";
  import { today } from "@/utils/common_variable";
  import { disabledDate } from "@/utils/utility_class";

  export default {
    name: "switch_insert",
    data() {
      return {
        switchEmployeeList: [],
        taskList: [],
        shiftList: ["甲", "乙", "日"],
        groupList: ["A", "AB", "AC", "AD", "B", "BC", "BD", "C", "CD", "D"],
        doLayout: true,
        autoNext: true,
        selectedData: null,
        datePickerOptions: {
          disabledDate
        },
        //查询参数
        searchDeptId: 49,
        searchDate: today.format("yyyy-MM-dd"),
        searchShift: "甲",
        //录入交班参数
        shift: "",
        employeeId: "",
        employeeName: "",
        task: undefined,
        helper: "",
        machineCount: 0,
        empGroup: undefined,
        machineNo: "",
        borrowFlag: false,
        borrowingWorkshop: undefined
      };
    },
    computed: {
      exshiftDate() {
        return this.searchDate;
      },
      currDeptId() {
        return this.searchDeptId;
      }
    },
    created() {
      this.getSwitchEmployeeList();
      this.getTaskList();
    },
    methods: {
      async getSwitchEmployeeList() {
        try {
          const { searchShift, searchDate, searchDeptId } = this;
          const res = await this.$axios.request({
            url: SWITCH_ENTER,
            params: {
              shift: searchShift,
              exshiftDate: searchDate,
              deptId: searchDeptId
            }
          });
          this.switchEmployeeList = res;
          if(this.doLayout && res.length > 0) {
            this.$nextTick(function() {
              this.$refs.tableBoxRef.doLayout();
            });
            this.doLayout = false;
          }
        } catch(e) {
          this.switchEmployeeList = [];
        }
      },
      async getTaskList() {
        try {
          const res = await this.$axios.request({
            url: TASK_LIST
          });
          res.push({ description: "未上班" });
          this.taskList = res;
        } catch(e) {
          this.taskList = [];
        }
      },
      //保存員工交班
      saveEmployeeSwitch() {
        const { $message, selectedData } = this;
        if(selectedData) {
          const {
            switchEmployeeList, employeeId, shift, helper, machineCount,
            machineNo, borrowFlag, borrowingWorkshop, empGroup, task
          } = this;
          const length = switchEmployeeList.length;
          for(let i = 0; i < length; i ++) {
            const item = switchEmployeeList[i];
            if(item.employeeId === employeeId) {
              item.shift = shift;
              item.helper = helper;
              item.machineCount = machineCount;
              item.machineNo = machineNo;
              item.borrowFlag = borrowFlag;
              item.borrowingWorkshop = borrowingWorkshop;
              item.empGroup = empGroup;
              item.task = task;
              // this.$set(switchEmployeeList, i, item);
              break;
            }
          }
        } else {
          $message({
            message: "請選擇需要保存的數據!",
            type: "error"
          });
        }
      },
      currentChange(row, column) {
        this.selectedData = row;
        if(row) {
          this.employeeId = row.employeeId;
          this.employeeName = row.employeeName;
          this.shift = row.shift;
          this.helper = row.helper;
          this.machineCount = row.machineCount;
          this.borrowFlag = row.borrowFlag;
          this.borrowingWorkshop = row.borrowingWorkshop.length === 0 ? undefined : row.borrowingWorkshop;
          this.empGroup = row.empGroup;
          this.task = row.task;
          this.machineNo = row.machineNo;
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  #switch_insert {
    display: flex;
    flex-direction: column;
    height: 100%;

    .header {
      padding-bottom: 15px;
      display: flex;
      flex-flow: row nowrap;

      .header-search {
        display: flex;
        flex-flow: row nowrap;
        flex: 2;
      }

      .header-submit {
        flex: 1;
      }

      .left-distance {
        margin-left: 10px;
      }
    }

    .form {
      display: flex;
      flex-flow: column nowrap;
      height: 100%;

      .dialog-cell-item {
        display: flex;
        flex-direction: column;
        padding: 5px 10px;

        .span-distance {
          padding-bottom: 5px;
        }
      }
    }
  }
</style>
