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
        <el-button :disabled="employeeListIsEmpty" @click="submit" type="primary" icon="el-icon-success"
                   style="background-color: #418DCF;">
          提 交
        </el-button>
      </div>
    </div>
    <table-form-layout :style.native="{height: 'calc(100% - 50px)'}">
      <template #table>
        <table-box @current-change="currentChange" :data="switchEmployeeList" highlight-current-row>
          <el-table-column
            min-width="50"
            prop="isInput"
            label="録入"
            align="center"
          >
            <template slot-scope="scope">
              <i v-if="scope.row.isInput" style="font-size: 18px;" class="el-icon-success"></i>
              <i v-else style="font-size: 18px;" class="el-icon-error"></i>
            </template>
          </el-table-column>
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
            :formatter="borrowFlagFormatter"
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
            <textile-department :disabled="!timeFlag" v-model="borrowingWorkshop"></textile-department>
            <span style="font-size: 0.7rem;">注：選中即為外借</span>
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">幫工</span>
            <el-input :disabled="timeFlag" v-model="helper" clearable placeholder="幫工"></el-input>
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">工作內容</span>
            <el-select :disabled="timeFlag" v-model="task" clearable placeholder="工作內容">
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
            <el-input @blur="handleMachineNoOnBlur" :disabled="!taskIsMachine || timeFlag" v-model="machineNo"
                      type="textarea" :autosize="{ minRows: 2, maxRows: 5}" clearable
                      placeholder="機台編號"></el-input>
            <span style="font-size: 0.7rem;">機台數：{{ machineCount }}</span>
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">分組</span>
            <el-select :disabled="!taskIsGroup || timeFlag" v-model="empGroup" clearable placeholder="分組">
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
            <el-button :disabled="employeeListIsEmpty" @click="saveEmployeeSwitch" type="primary"
                       style="background-color: #418DCF;margin-top: 15px;">
              保存
            </el-button>
          </div>
        </div>
      </template>
    </table-form-layout>
  </div>
</template>

<script>
  import { SWITCH_ENTER, TASK_LIST, SWITCH_INPUT } from "@/api/switch_management.js";
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
        empGroup: undefined,
        machineNo: "",
        borrowFlag: false,
        borrowingWorkshop: undefined,
        //用于保存需要提交的表单信息
        borrowFormList: []
      };
    },
    computed: {
      exshiftDate() {
        return this.searchDate;
      },
      currDeptId() {
        return this.searchDeptId;
      },
      taskIsGroup() {
        return this.task === "帶組";
      },
      taskIsMachine() {
        return this.task === "值機";
      },
      machineCount() {
        let count = 0;
        if(this.machineNo.trim().length > 0) {
          count = this.machineNo.split("/").length;
        }
        return count;
      },
      //録入外借和録入工作內容的時間標誌，外借為：true
      timeFlag() {
        const now = new Date();
        const hour = now.getHours();
        return (7 <= hour && hour < 10) || (19 <= hour && hour < 22);
      },
      employeeListIsEmpty() {
        return this.switchEmployeeList.length === 0;
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
          const length = res.length;
          for(let i = 0; i < length; i ++) {
            const item = res[i];
            if(item.id) {
              item.isInput = true;
            } else {
              item.false = true;
            }
          }
          this.switchEmployeeList = res;
          if(this.doLayout && length > 0) {
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
        if(!selectedData) {
          $message({
            message: "請選擇需要保存的數據!",
            type: "error"
          });
          return;
        }
        const { switchEmployeeList, employeeId, timeFlag } = this;
        const length = switchEmployeeList.length;
        if(timeFlag) { // 外借
          const borrowingWorkshop = this.borrowingWorkshop;
          const borrowFormList = this.borrowFormList;
          const formLen = borrowFormList.length;
          let borrowFlag = true;
          if(!borrowingWorkshop) {
            borrowFlag = false;
          }
          for(let i = 0; i < length; i ++) {
            const item = switchEmployeeList[i];
            if(item.employeeId === employeeId) {
              item.borrowingWorkshop = borrowingWorkshop;
              item.borrowFlag = borrowFlag;
              item.isInput = true;
              let exist = false;
              for(let j = 0; j < formLen; j ++) {
                const formItem = borrowFormList[j];
                if(formItem.employeeId === employeeId) {
                  borrowFormList[j] = { ...item };
                  exist = true;
                }
              }
              if(!exist) {
                borrowFormList.push({ ...item });
              }
              break;
            }
          }
        } else {  // 録入工作內容
          const { shift, helper, machineCount, machineNo, empGroup, task, taskIsGroup, taskIsMachine } = this;
          this.handleMachineNoOnBlur();
          if(!task) {
            $message({
              message: "工作內容不允許為空!",
              type: "error"
            });
            return;
          }
          if(taskIsGroup && !empGroup) {
            $message({
              message: "帶組不允許為空!",
              type: "error"
            });
            return;
          }
          if(taskIsMachine && machineNo.length === 0) {
            $message({
              message: "值機不允許為空!",
              type: "error"
            });
            return;
          }
          for(let i = 0; i < length; i ++) {
            const item = switchEmployeeList[i];
            if(item.employeeId === employeeId) {
              item.shift = shift;
              item.helper = helper;
              item.machineCount = machineCount;
              item.machineNo = machineNo;
              item.empGroup = empGroup;
              item.task = task;
              item.isInput = true;
              break;
            }
          }
          this.autoNextHandler();
        }
        this.$message({
          message: "保存成功"
        });
      },
      autoNextHandler() {
        const { autoNext, employeeId, switchEmployeeList } = this;
        if(autoNext) {
          const length = switchEmployeeList.length;
          let nextFlag = false;
          let next = false;
          for(let i = 0; i < length; i ++) {
            const item = switchEmployeeList[i];
            if(nextFlag && !(item.borrowFlag && this.searchDeptId === item.deptId)) {
              next = true;
            }
            if(next) {
              this.$refs.tableBoxRef.setCurrentRow(item);
              this.selectedData = item;
              break;
            }
            if(item.employeeId === employeeId) {
              nextFlag = true;
            }
          }
        }
      },
      async submit() {
        //外借即为true
        const { timeFlag, exshiftDate, searchDeptId } = this;
        const params = [];
        if(timeFlag) {
          const borrowFormList = this.borrowFormList;
          const length = borrowFormList.length;
          for(let i = 0; i < length; i ++) {
            const item = borrowFormList[i];
            params.push({
              ...item,
              exshiftDate,
              currDeptId: searchDeptId
            });
          }
        } else {
          const switchEmployeeList = this.switchEmployeeList;
          const length = switchEmployeeList.length;
          for(let i = 0; i < length; i ++) {
            const item = switchEmployeeList[i];
            if(!item.shift) {
              this.$message({
                message: item.employeeName + "班制不允許為空!",
                type: "error"
              });
              return;
            }
            if(!(item.borrowFlag && this.searchDeptId === item.deptId) && !item.task) {
              this.$message({
                message: item.employeeName + "還未録入工作內容!",
                type: "error"
              });
              return;
            } else {
              if(item.task === "值機" && item.machineNo.length === 0) {
                this.$message({
                  message: item.employeeName + "值機未録入!",
                  type: "error"
                });
                return;
              }
              if(item.task === "帶組" && !item.empGroup) {
                this.$message({
                  message: item.employeeName + "分組未録入!",
                  type: "error"
                });
                return;
              }
              params.push({
                ...item,
                exshiftDate,
                currDeptId: searchDeptId
              });
            }
          }
        }
        const { request, method } = this.$axios;
        await request({
          url: SWITCH_INPUT,
          method: method.POST,
          data: params
        });
        this.$message({
          message: timeFlag ? "外借成功" : "工作內容録入成功"
        });
        this.getSwitchEmployeeList();
      },
      handleMachineNoOnBlur() {
        let machineNo = this.machineNo.trim();
        let start = 0;
        let end = machineNo.length;
        machineNo[start] === "/" && start ++;
        machineNo[end - 1] === "/" && end --;
        this.machineNo = machineNo.slice(start, end);
      },
      currentChange(row, column) {
        this.selectedData = row;
        if(row) {
          this.employeeId = row.employeeId;
          this.employeeName = row.employeeName;
          this.shift = row.shift;
          this.helper = row.helper;
          this.borrowFlag = row.borrowFlag;
          this.borrowingWorkshop = row.borrowingWorkshop.length === 0 ? undefined : row.borrowingWorkshop;
          this.empGroup = row.empGroup;
          this.task = row.task;
          this.machineNo = row.machineNo;
        }
      },
      borrowFlagFormatter(row) {
        return row.borrowFlag ? "是" : "否";
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
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
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
