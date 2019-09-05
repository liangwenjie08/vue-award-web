<template>
  <div id="switch_insert">
    <div class="header">
      <el-button style="background-color: #53C0B0;" type="primary"
                 icon="el-icon-plus">
        增加
      </el-button>
    </div>
    <table-form-layout style="height: calc(100% - 80px);">
      <template #table>
        <table-box :data="switchEmployeeList">
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
            min-width="45"
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
            min-width="280"
            prop="machineNo"
            label="機號"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="60"
            prop="machineCount"
            label="值機數"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="45"
            prop="empGroup"
            label="分組"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="90"
            prop="helper"
            label="幫工"
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
            min-width="70"
            prop="borrowFlag"
            label="是否外借"
            align="center"
          ></el-table-column>
          <el-table-column
            min-width="45"
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
            <el-input readonly clearable placeholder="員工"></el-input>
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">交班日期</span>
            <el-input readonly clearable placeholder="交班日期"></el-input>
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">班制</span>
            <el-input clearable placeholder="班制"></el-input>
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">外借車間</span>
            <textile-department @input="getSwitchList" v-model="deptId"></textile-department>
            <span style="font-size: 0.8rem;">注：選中即為外借</span>
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">幫工</span>
            <el-input clearable placeholder="幫工"></el-input>
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">工作內容</span>
            <el-select clearable placeholder="工作內容">
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
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" clearable placeholder="機台編號"></el-input>
          </div>
          <div class="dialog-cell-item">
            <span class="span-distance">分組</span>
            <el-select clearable placeholder="分組">
              <el-option
                :key="item"
                :label="item"
                :value="item"
                v-for="item of groupList"
              ></el-option>
            </el-select>
          </div>
          <div class="dialog-cell-item">
            <el-checkbox>自動跳轉到下一條未録入記録</el-checkbox>
          </div>
        </div>
      </template>
    </table-form-layout>
  </div>
</template>

<script>
  import { SWITCH_ENTER, TASK_LIST } from "@/api/switch_management.js";
  import { today } from "@/utils/common_variable";

  export default {
    name: "switch_insert",
    data() {
      return {
        switchEmployeeList: [],
        taskList: [],
        groupList: ["A", "AB", "AC", "AD", "B", "BC", "BD", "C", "CD", "D"],
        doLayout: true,
        //查詢參數
        deptId: 77,
        exshiftDate: today.format("yyyy-MM-dd"),
        shift: "甲"
      };
    },
    created() {
      this.getSwitchEmployeeList();
      this.getTaskList();
    },
    methods: {
      async getSwitchEmployeeList() {
        try {
          const { shift, exshiftDate, deptId } = this;
          const res = await this.$axios.request({
            url: SWITCH_ENTER,
            params: {
              shift, exshiftDate, deptId
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
    }

    .table {
      height: 100%;
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
