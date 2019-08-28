<template>
  <div id="employee_file">
    <div class="header">
      <div class="header-button">
        <el-button @click="employeeAddVisible = true" style="background-color: #5CB85C;" type="primary"
                   icon="el-icon-plus">增加
        </el-button>
        <el-popover
          @show="deleteConfirmShow"
          @hide="deleteConfirmHide"
          placement="top"
          width="160"
          v-model="deleteConfirmVisible"
          style="margin-left: 10px;margin-right: 10px;">
          <p>确定删除<strong>{{
                         multipleChoiceFlag ? "右側展示的人" : singleSelectedData !== null ? singleSelectedData.empName : ""
                         }}</strong>吗？
          </p>
          <div style="text-align: right; margin: 0">
            <el-button type="text" @click="deleteConfirmVisible = false">取消</el-button>
            <el-button type="primary" style="background-color: red;margin-left: 20px;" size="mini"
                       @click="deleteTableData">
              确定
            </el-button>
          </div>
          <el-button slot="reference" style="background-color: red;" type="primary" icon="el-icon-delete-solid">刪除
          </el-button>
        </el-popover>
        <el-button style="background-color: #5BC0DE;" type="primary" icon="el-icon-edit">更新</el-button>
        <el-button style="background-color: #418DCF;" type="primary" icon="el-icon-document">查看明細</el-button>
        <el-button style="background-color: #418DCF;" type="primary" icon="el-icon-upload2">批量録入</el-button>
        <el-button style="background-color: #418DCF;" type="primary" icon="el-icon-download">模板下載</el-button>
        <el-button style="background-color: #418DCF;" type="primary" icon="el-icon-download">導出Excel</el-button>
        <el-button style="background-color: #53C0B0;" type="primary" icon="el-icon-download">報表統計</el-button>
      </div>
      <div class="header-search">
        <div class="header-search-top">
          <treeselect
            :options="deptList"
            v-model="searchDeptId"
            :normalizer="normalizer"
            style="width: 160px;height: 32px;"
            placeholder="部門"
            @input="getEmployeeList"
            :defaultExpandLevel="3"
          />
          <el-input @keyup.enter.native="getEmployeeList" v-model="deptDesc" class="left-distance"
                    style="width: 130px;" placeholder="部門模糊查詢" clearable />
          <el-select @change="getEmployeeList()" class="left-distance" style="width: 120px;"
                     placeholder="離職原因" v-model="searchResignReason" clearable>
            <el-option
              v-for="item of leaveReasonList"
              :key="item"
              :value="item"
            />
          </el-select>
          <el-input @keyup.enter.native="getEmployeeList" v-model="searchEmpId" clearable
                    class="left-distance" style="width: 120px;" placeholder="工號" />
          <el-input @keyup.enter.native="getEmployeeList" v-model="searchEmpName" clearable
                    class="left-distance" style="width: 100px;" placeholder="姓名" />
          <el-select @change="getEmployeeList" class="left-distance" style="width: 120px;"
                     placeholder="職務狀態" v-model="searchIsOnjob" clearable>
            <el-option
              v-for="item of isOnjobList"
              :key="item.value"
              :value="item.value"
              :label="item.lable"
            />
          </el-select>
        </div>
        <div class="header-search-bottom">
          <el-date-picker @change="getEmployeeList" v-model="searchJoinDate" format="yyyyMMdd" type="daterange"
                          clearable
                          value-format="yyyy-MM-dd" :validate-event="false" range-separator="至"
                          start-placeholder="入職開始日期"
                          end-placeholder="入職結束日期" style="width: 270px;" :picker-options="datePickerOptions"
          />
          <el-date-picker class="left-distance" @change="getEmployeeList" v-model="searchLeaveDate" format="yyyyMMdd"
                          type="daterange" clearable value-format="yyyy-MM-dd" :validate-event="false"
                          range-separator="至" start-placeholder="離職開始日期" end-placeholder="離職結束日期" style="width: 270px;"
                          :picker-options="datePickerOptions"
          />
          <el-checkbox style="margin-left: 20px;" v-model="multipleChoiceFlag">多選</el-checkbox>
        </div>
      </div>
    </div>
    <div style="height: 100%;">
      <table-box @selection-change="multipleSelectedRow" @current-change="singleSelectedRow" highlight-current-row
                 :data="employeeList">
        <el-table-column
          type="selection"
          width="40"
        />
        <el-table-column
          prop="empId"
          label="工號"
          width="85"
          fixed="left"
          align="center"
        />
        <el-table-column
          prop="empName"
          label="姓名"
          width="100"
          fixed="left"
          align="center"
        />
        <el-table-column
          prop="deptDesc"
          label="部門"
          width="100"
          fixed="left"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column
          prop="shift"
          label="班別"
          width="50"
          align="center"
        />
        <el-table-column
          prop="jobTitle"
          label="職務"
          width="80"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column
          prop="posDesc"
          label="崗位"
          width="90"
          align="center"
        />
        <el-table-column
          prop="gender"
          label="性別"
          width="50"
          align="center"
        />
        <el-table-column
          prop="age"
          label="年齡"
          width="50"
          align="center"
        />
        <el-table-column
          prop="height"
          label="身高"
          width="50"
          align="center"
        />
        <el-table-column
          prop="academic"
          label="學歷"
          width="50"
          align="center"
        />
        <el-table-column
          prop="domicilePlace"
          label="戶籍"
          width="80"
          align="center"
        />
        <el-table-column
          prop="birthday"
          label="出生日期"
          width="90"
          align="center"
        />
        <el-table-column
          prop="joinDate"
          label="入職日期"
          width="90"
          align="center"
        />
        <el-table-column
          prop="leaveDate"
          label="離職日期"
          width="90"
          align="center"
        />
        <el-table-column
          prop="isOnjob"
          label="在職"
          width="45"
          align="center"
        />
        <el-table-column
          prop="resignReason"
          label="離職原因"
          width="100"
          align="center"
        />
        <el-table-column
          prop="phone"
          label="手機號碼"
          width="90"
          align="center"
        />
        <el-table-column
          prop="idCard"
          label="身份證"
          width="110"
          align="center"
        />
        <el-table-column
          prop="description"
          label="備註"
          min-width="180"
          align="center"
          show-overflow-tooltip
        />
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
    />
    <el-dialog width="65%" title="新增員工信息" :visible.sync="employeeAddVisible">
      <div class="dialog-row-item">
        <div class="dialog-cell-item">
          <span class="span-distance">員工編號</span>
          <el-input v-model="empId" placeholder="員工編號"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">員工姓名</span>
          <el-input v-model="empName" placeholder="員工姓名"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">部門</span>
          <treeselect
            :options="deptList"
            v-model="deptId"
            :normalizer="normalizer"
            style="width: 100%;height: 32px;"
            placeholder="部門"
            :defaultExpandLevel="3"
          />
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">崗位</span>
          <el-select v-model="posDesc" placeholder="崗位"></el-select>
        </div>
      </div>
      <div class="dialog-row-item">
        <div class="dialog-cell-item">
          <span class="span-distance">入職日期</span>
          <el-date-picker v-model="joinDate" value-format="yyyy-MM-dd" format="yyyyMMdd"
                          :picker-options="datePickerOptions"
                          style="width: 100%;" placeholder="入職日期"></el-date-picker>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">職務</span>
          <el-input v-model="jobTitle" placeholder="職務"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">手機號碼</span>
          <el-input v-model="phone" placeholder="手機號碼"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">身份證</span>
          <el-input v-model="idCard" placeholder="身份證"></el-input>
        </div>
      </div>
      <div class="dialog-row-item">
        <div class="dialog-cell-item">
          <span class="span-distance">出生日期</span>
          <el-date-picker v-model="birthday" value-format="yyyy-MM-dd" format="yyyyMMdd"
                          :picker-options="datePickerOptions"
                          style="width: 100%;" placeholder="出生日期"></el-date-picker>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">戶籍所在地</span>
          <el-input v-model="domicilePlace" placeholder="戶籍所在地"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">身高</span>
          <el-input v-model="height" placeholder="身高"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">學歷</span>
          <el-input v-model="academic" placeholder="學歷"></el-input>
        </div>
      </div>
      <div class="dialog-row-item">
        <div class="dialog-cell-item">
          <span class="span-distance">緊急聯繫人</span>
          <el-input v-model="emergencyContact" placeholder="緊急聯繫人"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">緊急聯繫人電話</span>
          <el-input v-model="emergencyPhone" placeholder="緊急聯繫人電話"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">描述</span>
          <el-input v-model="description" placeholder="描述"></el-input>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">是否離職<el-checkbox v-model="isDimission"
                                                       style="margin-left: 10px;"></el-checkbox></span>
          <el-date-picker v-model="leaveDate" value-format="yyyy-MM-dd" format="yyyyMMdd"
                          :picker-options="datePickerOptions" :disabled="!isDimission"
                          style="width: 100%;" placeholder="離職日期"></el-date-picker>
        </div>
      </div>
      <div class="dialog-row-item">
        <div style="flex: 2;" class="dialog-cell-item">
          <span class="span-distance">離職原因</span>
          <el-radio-group :disabled="!isDimission" v-model="resignReason">
            <el-radio label="自動離職">自動離職</el-radio>
            <el-radio label="解僱">解僱</el-radio>
            <el-radio label="有事回家">有事回家</el-radio>
            <el-radio label="有身孕">有身孕</el-radio>
            <el-radio label="身體不適">身體不適</el-radio>
            <el-radio label="工作壓力大">工作壓力大</el-radio>
          </el-radio-group>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">班制</span>
          <el-radio-group v-model="shift">
            <el-radio label="甲">甲</el-radio>
            <el-radio label="乙">乙</el-radio>
            <el-radio label="日">日</el-radio>
          </el-radio-group>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">二次入職</span>
          <el-radio-group v-model="isRejoin">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">特殊人員</span>
          <el-radio-group v-model="isSpec">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">性别</span>
          <el-radio-group v-model="gender">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="employeeAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="employeeAddVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { EMPLOYEE, SEARCH_DEPARTMENT_LIST } from "@/api/employee_file";
  import { default_page_size } from "@/utils/common_variable";
  import { disabledDate } from "@/utils/utility_class";


  export default {
    name: "employee_file",
    data() {
      return {
        datePickerOptions: {
          disabledDate
        },
        //表格列表
        employeeList: [],
        //头部搜索部门列表
        deptList: [],
        //离职原因列表
        leaveReasonList: ["解僱", "有身孕", "自動離職", "有事回家", "身體不適", "工作壓力大"],
        //是否在職列表
        isOnjobList: [{ lable: "在職", value: true }, { lable: "離職", value: false }],
        pageNum: 1,
        pageSize: 50,
        total: 0,
        searchDeptId: undefined,
        deptDesc: undefined,
        searchResignReason: undefined,
        searchEmpId: undefined,
        searchEmpName: undefined,
        searchIsOnjob: true,
        searchJoinDate: [],
        searchLeaveDate: [],
        //表格是否需要重新計算寬度
        doLayout: true,
        //表格是否多選，多選為true
        multipleChoiceFlag: false,
        //表格單選時的數據
        singleSelectedData: null,
        //表格多選時的數據
        multipleSelectedData: [],
        deleteConfirmVisible: false,
        notificationInstance: null,
        employeeAddVisible: false,
        resignReason: undefined,
        posDesc: undefined,
        empId: "",
        empName: "",
        deptId: undefined,
        joinDate: undefined,
        leaveDate: undefined,
        jobTitle: "",
        phone: "",
        idCard: "",
        birthday: undefined,
        domicilePlace: "",
        height: "",
        academic: "",
        emergencyContact: "",
        emergencyPhone: "",
        description: "",
        //是否离职
        isDimission: false,
        shift: "甲",
        isRejoin: 0,
        isSpec: 0,
        gender: "1"
      };
    },
    created() {
      this.getEmployeeList();
      this.getDeptList();
    },
    methods: {
      async getEmployeeList() {
        //请求参数
        const {
          pageNum = 1, pageSize = default_page_size, searchDeptId: deptId = 49, deptDesc,
          searchResignReason: resignReason, searchIsOnjob: isOnjob, searchEmpId: empId,
          searchEmpName: empName, searchJoinDate: joinDate, searchLeaveDate: leaveDate
        } = this;
        const [joinStartDate, joinEndDate] = joinDate || [];
        const [leaveStartDate, leaveEndDate] = leaveDate || [];
        try {
          const res = await this.$axios.request({
            url: EMPLOYEE,
            method: this.$axios.method.GET,
            params: {
              isAdditional: true,
              status: 1,
              pageNum,
              pageSize,
              deptId,
              deptDesc,
              resignReason,
              isOnjob,
              empId,
              empName,
              joinStartDate,
              joinEndDate,
              leaveStartDate,
              leaveEndDate
            }
          });
          const list = res.list;
          const len = list.length;
          const nowYear = new Date().getFullYear();
          for(let i = 0; i < len; i ++) {
            const item = list[i];
            const { gender, birthday, isOnjob, phone, idCard } = item;
            item.gender = gender ? (gender === "1" ? "男" : "女") : "";
            item.isOnjob = isOnjob ? (isOnjob === 1 ? "是" : "否") : "";
            if(birthday) {
              const birthdayDate = new Date(birthday);
              const year = birthdayDate.getFullYear();
              item.age = nowYear - year;
            }
            if(phone) {
              item.phone = this.stringToStar(phone, 3, 4);
            }
            if(idCard) {
              item.idCard = this.stringToStar(idCard, 3, 6);
            }
          }
          this.employeeList = list;
          this.total = res.total;
          this.pageNum = res.pageNum;
          this.pageSize = res.pageSize;
          if(this.doLayout) {
            this.$nextTick(function() {
              this.$refs.tableBoxRef.doLayout();
            });
            this.doLayout = false;
          }
        } catch(e) {
          this.employeeList = [];
        }
      },
      //定義部門列表需要的數據結構
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children
        };
      },
      async getDeptList() {
        try {
          const res = await this.$axios.request({
            url: SEARCH_DEPARTMENT_LIST,
            method: this.$axios.method.GET,
            params: {
              deptIds: 49,
              tree: true
            }
          });
          //将 children = [] 置为 children = undefined
          this.handleDeptList(res);
          this.deptList = res;
        } catch(e) {
          this.deptList = [];
        }
      },
      handleDeptList(data) {
        const dataLen = data.length;
        if(typeof data !== "undefined" && dataLen > 0) {
          for(let i = 0; i < dataLen; i ++) {
            const children = data[i].children;
            if(children.length === 0) {
              data[i].children = undefined;
            } else {
              this.handleDeptList(children);
            }
          }
        }
      },
      sizeChange(size) {
        this.pageSize = size;
        this.$nextTick(this.getEmployeeList);
      },
      pageChange(page) {
        this.pageNum = page;
        this.$nextTick(this.getEmployeeList);
      },
      multipleSelectedRow(selectedData) {
        this.multipleSelectedData = selectedData;
      },
      singleSelectedRow(selectedData) {
        this.singleSelectedData = selectedData;
      },
      deleteConfirmHide() {
        if(this.notificationInstance) {
          this.notificationInstance.close();
        }
      },
      deleteConfirmShow() {
        const multipleSelectedData = this.multipleSelectedData;
        const len = multipleSelectedData.length;
        if(this.multipleChoiceFlag && len > 0) {
          let message = "";
          for(let i = 0; i < len; i ++) {
            const item = multipleSelectedData[i];
            message += item.empName;
            if(i !== len - 1) {
              message += " , ";
            }
          }
          this.notificationInstance = this.$notification({
            message,
            type: "warning"
          });
        }
      },
      async deleteTableData() {
        const empIdArr = [];
        //為true就是多選刪除
        if(this.multipleChoiceFlag) {
          const multipleSelectedData = this.multipleSelectedData;
          const len = multipleSelectedData.length;
          if(multipleSelectedData.length === 0) {
            this.$message({
              message: "請選擇需要刪除的數據!",
              type: "error"
            });
            return null;
          }
          for(let i = 0; i < len; i ++) {
            const item = multipleSelectedData[i];
            empIdArr.push(item.empId);
          }
        } else {
          const singleSelectedData = this.singleSelectedData;
          if(singleSelectedData === null) {
            this.$message({
              message: "請選擇需要刪除的數據!",
              type: "error"
            });
            return null;
          }
          empIdArr.push(singleSelectedData.empId);
        }
        await this.$axios.request({
          url: EMPLOYEE,
          method: this.$axios.method.DELETE,
          params: {
            isReal: false,
            empIds: empIdArr.join(",")
          }
        });
        this.$message({
          message: "刪除成功!"
        });
        this.deleteConfirmVisible = false;
        this.getEmployeeList();
      },
      stringToStar(str, startLen, endLen) {
        const startStr = str.substr(0, startLen);
        const index = str.length - endLen;
        const endStr = str.substr(index, endLen);
        return startStr + "***" + endStr;
      },
    }
  };
</script>

<style lang="less" scoped>
  #employee_file {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    .header {
      padding: 0 0 15px 0;

      .header-button {
        padding-bottom: 10px;
      }

      .header-search {
        .header-search-top {
          display: flex;
          flex-flow: row wrap;
        }

        .header-search-bottom {
          display: flex;
          flex-flow: row wrap;
          align-items: center;
          padding-top: 10px;
        }

        .left-distance {
          margin-left: 5px;
        }
      }
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
