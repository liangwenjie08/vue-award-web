<template>
  <div id="attendance-layout">
    <div class="header">
      <div class="header-routers">
        <el-button-group>
          <el-button @click="changeActiveComponent('adjustHoliday')" type="primary" style="background-color: #418DCF;">
            調休
          </el-button>
          <el-button @click="changeActiveComponent('compensatoryHoliday')" type="primary"
                     style="background-color: #418DCF;">
            補休
          </el-button>
          <el-button @click="changeActiveComponent('leave')" type="primary" style="background-color: #418DCF;">
            請假
          </el-button>
          <el-button @click="changeActiveComponent('workingOvertime')" type="primary"
                     style="background-color: #418DCF;">
            加班
          </el-button>
          <el-button @click="changeActiveComponent('businessTrip')" type="primary" style="background-color: #418DCF;">
            出差
          </el-button>
          <el-button @click="changeActiveComponent('cancelLeave')" type="primary" style="background-color: #418DCF;">
            銷假
          </el-button>
        </el-button-group>
        <div class="router-description">
          {{ routerDescription }}
        </div>
      </div>
      <div class="header-search">
        <textile-department style="width: 160px;" v-model="searchDeptId"></textile-department>
        <el-date-picker v-model="searchDate" format="yyyyMMdd" type="daterange" class="left-distance"
                        clearable value-format="yyyy-MM-dd" :validate-event="false" range-separator="至"
                        start-placeholder="開始日期" end-placeholder="結束日期" style="width: 270px;"
        ></el-date-picker>
        <el-input @clear="setSearchEmpIdProp" @keyup.enter.stop.native="setSearchEmpIdProp" v-model="searchEmpId"
                  placeholder="員工編號" class="left-distance" style="width: 120px;" clearable></el-input>
        <el-input @clear="setSearchEmpNameProp" @keyup.enter.stop.native="setSearchEmpNameProp" v-model="searchEmpName"
                  placeholder="員工姓名" class="left-distance" style="width: 120px;" clearable></el-input>

        <batch-delete-button :delete-callback="getTableData" :url="formURL" :selected-data="multipleSelectedData"
                             id-key="id"></batch-delete-button>
        <file-download :params="downloadExcelParams" description="導出Excel" :url="downloadExcelURL"></file-download>
      </div>
    </div>
    <component ref="childrenComponent" @multiple-selected="multipleSelected" :is="activeComponent"
               :params="params"></component>
  </div>
</template>

<script>
  import adjust_holiday from "./adjust_holiday.vue";
  import compensatory_holiday from "./compensatory_holiday.vue";
  import leave from "./leave.vue";
  import cancel_leave from "./cancel_leave.vue";
  import working_overtime from "./working_overtime.vue";
  import business_trip from "./business_trip.vue";
  import { FORM, DOWNLOAD_EXCEL } from "@/api/attendance_management.js";

  export default {
    name: "layout",
    data() {
      return {
        activeComponent: "adjustHoliday",
        //搜索參數
        searchDeptId: 49,
        searchDate: null,
        searchEmpId: "",
        searchEmpIdProp: "",
        searchEmpName: "",
        searchEmpNameProp: "",
        //刪除時的參數
        multipleSelectedData: [],
        getTableData: function() {
          this.$message({
            message: "自動更新出錯，請手動按 F5 刷新列表",
            type: "error"
          });
        }
      };
    },
    components: {
      adjustHoliday: adjust_holiday,
      compensatoryHoliday: compensatory_holiday,
      leave,
      workingOvertime: working_overtime,
      businessTrip: business_trip,
      cancelLeave: cancel_leave
    },
    computed: {
      params() {
        const { searchDeptId, searchEmpIdProp, searchEmpNameProp, searchDate } = this;
        return {
          searchDeptId,
          searchEmpId: searchEmpIdProp,
          searchEmpName: searchEmpNameProp,
          searchDate
        };
      },
      downloadExcelParams() {
        const { searchDeptId, searchDate } = this;
        const [startDate, endDate] = searchDate || [];
        return {
          deptId: searchDeptId,
          startDate,
          endDate
        };
      },
      formURL() {
        return FORM;
      },
      downloadExcelURL() {
        return DOWNLOAD_EXCEL;
      },
      routerDescription() {
        switch(this.activeComponent) {
          case "adjustHoliday":
            return "調休";
          case "compensatoryHoliday":
            return "補休";
          case "leave":
            return "請假";
          case "workingOvertime":
            return "加班";
          case "businessTrip":
            return "出差";
          case "cancelLeave":
            return "銷假";
        }
      }
    },
    watch: {
      activeComponent() {
        this.$nextTick(function() {
          this.getTableData = this.$refs.childrenComponent.getTableData;
        });
      }
    },
    mounted() {
      this.getTableData = this.$refs.childrenComponent.getTableData;
    },
    methods: {
      setSearchEmpIdProp() {
        this.searchEmpIdProp = this.searchEmpId;
      },
      setSearchEmpNameProp() {
        this.searchEmpNameProp = this.searchEmpName;
      },
      multipleSelected(multipleSelectedData) {
        this.multipleSelectedData = multipleSelectedData;
      },
      changeActiveComponent(view) {
        this.activeComponent = view;
      }
    }
  };
</script>

<style lang="less" scoped>
  #attendance-layout {
    height: 100%;

    .header {
      height: 75px;
      min-width: 950px;
      margin-bottom: 5px;

      .header-routers {
        padding-bottom: 10px;

        .router-description {
          float: right;
          padding-right: 20px;
        }
      }

      .header-search {
        display: flex;
        flex-flow: row nowrap;

        .left-distance {
          margin-left: 10px;
        }
      }
    }
  }
</style>
