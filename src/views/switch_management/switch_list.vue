<template>
  <div id="switch_list">
    <div class="header">
      <textile-department style="width: 160px;" @input="getSwitchList" v-model="deptId"></textile-department>
      <el-date-picker @change="getSwitchList" class="left-distance" clearable style="width: 130px;" v-model="startDate"
                      placeholder="開始日期" value-format="yyyy-MM-dd" format="yyyyMMdd" />
      <el-date-picker @change="getSwitchList" class="left-distance" clearable style="width: 130px;" v-model="endDate"
                      placeholder="結束日期" value-format="yyyy-MM-dd" format="yyyyMMdd" />
      <el-select clearable @change="getSwitchList" v-model="shift" class="left-distance" style="width: 80px;"
                 placeholder="班制">
        <el-option
          :key="item"
          :label="item"
          :value="item"
          v-for="item of shiftList"
        ></el-option>
      </el-select>
      <el-input @clear="getSwitchList" @keyup.enter.stop.native="getSwitchList" class="left-distance"
                style="width: 120px;" v-model="empId" clearable placeholder="員工編號"></el-input>
      <el-input @clear="getSwitchList" @keyup.enter.stop.native="getSwitchList" class="left-distance"
                style="width: 120px;" v-model="task" clearable placeholder="工作內容"></el-input>
      <!--      <el-tooltip :content="`僅導出開始日期(${startDate})的數據`" placement="top">-->
      <file-download style="margin-left: 25px;" :url="pdfURL" description="報表統計" :params="params"></file-download>
      <!--      </el-tooltip>-->
    </div>
    <div class="table">
      <table-box :data="switchList">
        <el-table-column
          min-width="90"
          prop="employeeName"
          label="員工名稱"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="110"
          prop="deptName"
          label="部門"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="45"
          prop="shift"
          label="班制"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="80"
          prop="task"
          label="工作内容"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="45"
          prop="empGroup"
          label="分组"
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
          :formatter="machineCountFormatter"
        ></el-table-column>
        <el-table-column
          min-width="90"
          prop="helper"
          label="幫工"
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
          min-width="110"
          prop="borrowingName"
          label="借入車間"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="100"
          prop="exshiftDate"
          label="交班日期"
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
  </div>
</template>

<script>
  import { SWITCH_LIST, PDF_DOWNLOAD } from "@/api/switch_management.js";
  import { default_page_size, today } from "@/utils/common_variable";

  export default {
    name: "switch_list",
    data() {
      return {
        isClick: false,
        switchList: [],
        shiftList: ["甲", "乙", "日"],
        pageNum: 1,
        pageSize: default_page_size,
        total: 0,
        //表格是否重新计算宽高
        doLayout: true,
        //查询参数
        deptId: 49,
        startDate: "2018-08-01",                   //today.format("yyyy-MM-dd"),
        endDate: "2019-09-05",                      //null,
        shift: undefined,
        empId: "",
        task: "",
      };
    },
    computed: {
      pdfURL() {
        return PDF_DOWNLOAD;
      },
      params() {
        const { deptId, startDate, endDate, shift: searchShift, empId: searchEmpId, task: searchTask } = this;
        const task = searchTask.trim().length === 0 ? undefined : searchTask;
        const empId = searchEmpId.trim().length === 0 ? undefined : searchEmpId;
        const shift = searchShift ? searchShift : undefined;
        return {
          deptId,
          startDate,
          endDate,
          shift,
          empId,
          task
        };
      }
    },
    created() {
      this.getSwitchList();
    },
    methods: {
      async getSwitchList() {
        try {
          const { pageNum, pageSize, params } = this;
          const res = await this.$axios.request({
            url: SWITCH_LIST,
            params: {
              pageNum,
              pageSize,
              ...params
            }
          });
          this.switchList = res.list;
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
          this.switchList = [];
          this.total = 0;
        }
      },
      sizeChange(size) {
        this.pageSize = size;
        this.$nextTick(this.getSwitchList);
      },
      pageChange(page) {
        this.pageNum = page;
        this.$nextTick(this.getSwitchList);
      },
      machineCountFormatter(row) {
        return row.machineCount || "";
      },
      borrowFlagFormatter(row) {
        return row.borrowFlag ? "是" : "";
      },
    }
  };
</script>

<style lang="less" scoped>
  #switch_list {
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
  }
</style>
