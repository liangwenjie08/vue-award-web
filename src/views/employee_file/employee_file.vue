<template>
  <div id="employee_file">
    <div class="header">
      <div class="header-button">
        <el-button @click="addAndUpdateHandler(false, false)" style="background-color: #5CB85C;" type="primary"
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
        <el-button @click="addAndUpdateHandler(true, false)" style="background-color: #5BC0DE;" type="primary"
                   icon="el-icon-edit">更新
        </el-button>
        <el-button @click="addAndUpdateHandler(true, true)" style="background-color: #418DCF;" type="primary"
                   icon="el-icon-document">查看明細
        </el-button>
        <file-upload :url="upload_file" />
        <el-button :loading="templateDownloadLoading" @click="downloadTemplate" style="background-color: #418DCF;"
                   type="primary" icon="el-icon-download">
          模板下載
        </el-button>
        <el-button :loading="excelDownloadLoading" @click="downloadExcel" style="background-color: #418DCF;"
                   type="primary" icon="el-icon-download">
          導出Excel
        </el-button>
        <el-button :loading="pdfDownloadLoading" @click="downloadPdf" style="background-color: #53C0B0;" type="primary"
                   icon="el-icon-download">
          報表統計
        </el-button>
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
          :formatter="genderFormatter"
        />
        <el-table-column
          prop="age"
          label="年齡"
          width="50"
          align="center"
          :formatter="ageFormatter"
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
          :formatter="isOnjobFormatter"
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
          :formatter="phoneFormatter"
        />
        <el-table-column
          prop="idCard"
          label="身份證"
          width="110"
          align="center"
          :formatter="idCardFormatter"
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
    ></el-pagination>
    <el-dialog width="65%" :title="`${isUpdateOperation ? (isDetail ? '查看' : '更新') : '新增'}員工信息`"
               :visible.sync="dialogVisible">
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
            @input="deptChange"
          />
        </div>
        <div class="dialog-cell-item">
          <span class="span-distance">崗位</span>
          <el-select v-model="posId" placeholder="崗位">
            <el-option
              v-for="item of posList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
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
      <div v-if="!isDetail" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button style="background-color: #418DCF;" type="primary" @click="addAndUpdateEmployee">
          {{this.isUpdateOperation ? "更 新" : "确 定"}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    EMPLOYEE,
    SEARCH_DEPARTMENT_LIST,
    DOWLOAD_TEMPLATE,
    DOWLOAD_EXCEL,
    DOWNLOAD_PDF,
    UPLOAD_FILE
  } from "@/api/employee_file";
  import { default_page_size } from "@/utils/common_variable";
  import { disabledDate } from "@/utils/utility_class";

  export default {
    name: "employee_file",
    data() {
      return {
        //是否已经执行了操作
        isClick: false,
        templateDownloadLoading: false,
        excelDownloadLoading: false,
        pdfDownloadLoading: false,
        datePickerOptions: {
          disabledDate
        },
        //表格列表
        employeeList: [],
        //头部搜索部门列表
        deptList: [],
        posList: [],
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
        dialogVisible: false,
        resignReason: undefined,
        posId: undefined,
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
        gender: "1",
        //是更新操作还是添加操作
        isUpdateOperation: false,
        //是否是查看詳情
        isDetail: false,
        //当前年份，用于计算员工年龄
        nowYear: new Date().getFullYear()
      };
    },
    computed: {
      // 文件上傳
      upload_file: function() {
        return UPLOAD_FILE;
      }
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
          this.employeeList = res.list;
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
          this.total = 0;
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
      deptChange(deptId) {
        this.posId = undefined;
        if(deptId) {
          this.getPosList(this.deptList, deptId);
        } else {
          this.posList = [];
        }
      },
      getPosList(deptList, deptId) {
        if(deptList) {
          const len = deptList.length;
          for(let i = 0; i < len; i ++) {
            const item = deptList[i];
            if(item.id === deptId) {
              this.posList = item.positionList;
              return null;
            } else {
              if(item.children && item.children.length > 0) {
                this.getPosList(item.children, deptId);
              }
            }
          }
        }
      },
      async getDeptList() {
        try {
          const res = await this.$axios.request({
            url: SEARCH_DEPARTMENT_LIST,
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
        if(this.isClick) {
          return null;
        }
        this.isClick = true;
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
            this.isClick = false;
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
            this.isClick = false;
            return null;
          }
          empIdArr.push(singleSelectedData.empId);
        }
        try {
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
        } finally {
          this.isClick = false;
        }
      },
      ageFormatter(row) {
        let age = undefined;
        if(row.birthday) {
          const birthdayDate = new Date(row.birthday);
          const year = birthdayDate.getFullYear();
          age = this.nowYear - year;
        }
        return age;
      },
      genderFormatter(row) {
        let gender = "";
        if(row.gender) {
          gender = row.gender === "1" ? "男" : "女";
        }
        return gender;
      },
      isOnjobFormatter(row) {
        let isOnjob = "";
        if(typeof row.isOnjob === "number") {
          isOnjob = row.isOnjob === 1 ? "是" : "否";
        }
        return isOnjob;
      },
      phoneFormatter(row) {
        let phone = "";
        if(row.phone) {
          phone = this.stringToStar(row.phone, 3, 4);
        }
        return phone;
      },
      idCardFormatter(row) {
        let idCard = "";
        if(row.idCard) {
          idCard = this.stringToStar(row.idCard, 3, 6);
        }
        return idCard;
      },
      stringToStar(str, startLen, endLen) {
        const startStr = str.substr(0, startLen);
        const index = str.length - endLen;
        const endStr = str.substr(index, endLen);
        return startStr + "***" + endStr;
      },
      //添加和更新參數初始化函数
      addAndUpdateHandler(isUpdateOperation, isDetail) {
        // isUpdateOperation：是更新操作、查看詳情(true)还是新增操作(false)
        this.isUpdateOperation = isUpdateOperation;
        this.isDetail = isDetail;
        if(isUpdateOperation) {
          if(!this.singleSelectedData) {
            this.$message({
              message: "請選擇員工!",
              type: "error"
            });
            return null;
          }
          const {
            empId, empName, deptId, positionList, joinDate, leaveDate, jobTitle, phone, idCard,
            birthday, domicilePlace, height, academic, emergencyContact, emergencyPhone,
            description, isOnjob, shift, isRejoin, isSpec, gender, resignReason
          } = this.singleSelectedData;
          this.getPosList(this.deptList, + deptId);
          this.deptId = + deptId;
          this.empId = empId;
          this.empName = empName;
          this.joinDate = joinDate;
          this.leaveDate = leaveDate;
          this.jobTitle = jobTitle;
          this.phone = phone;
          this.idCard = idCard;
          this.birthday = birthday;
          this.domicilePlace = domicilePlace;
          this.height = height;
          this.academic = academic;
          this.emergencyContact = emergencyContact;
          this.emergencyPhone = emergencyPhone;
          this.description = description;
          this.isDimission = isOnjob !== 1;
          this.shift = shift;
          this.isRejoin = isRejoin;
          this.isSpec = isSpec;
          this.gender = gender;
          this.resignReason = resignReason;
          this.$nextTick(function() {
            this.posId = positionList[0].id;
          });
        } else {
          this.empId = "";
          this.empName = "";
          this.deptId = undefined;
          this.posId = undefined;
          this.joinDate = undefined;
          this.leaveDate = undefined;
          this.jobTitle = "";
          this.phone = "";
          this.idCard = "";
          this.birthday = undefined;
          this.domicilePlace = "";
          this.height = "";
          this.academic = "";
          this.emergencyContact = "";
          this.emergencyPhone = "";
          this.description = "";
          this.isDimission = false;
          this.shift = "甲";
          this.isRejoin = 0;
          this.isSpec = 0;
          this.gender = "1";
        }
        this.dialogVisible = true;
      },
      async addAndUpdateEmployee() {
        const {
          empId, empName, deptId, posId, joinDate, leaveDate, jobTitle, phone, idCard,
          birthday, domicilePlace, height, academic, emergencyContact, emergencyPhone,
          description, isDimission, shift, isRejoin, isSpec, gender, resignReason
        } = this;
        if(!empId) {
          this.$message({
            message: "員工編號不能為空",
            type: "error"
          });
          return null;
        }
        if(!empName) {
          this.$message({
            message: "員工姓名不能為空",
            type: "error"
          });
          return null;
        }
        if(!deptId) {
          this.$message({
            message: "部門不能為空",
            type: "error"
          });
          return null;
        }
        if(!posId) {
          this.$message({
            message: "崗位不能為空",
            type: "error"
          });
          return null;
        }
        if(phone) {
          if(!(/^1[34578]\d{9}$/.test(phone))) {
            this.$message({
              message: "手机号码有误，请重填!",
              type: "error"
            });
            return null;
          }
        }
        if(emergencyPhone) {
          if(!(/^1[34578]\d{9}$/.test(emergencyPhone))) {
            this.$message({
              message: "緊急聯繫人手机号码有误，请重填!",
              type: "error"
            });
            return null;
          }
        }
        if(idCard) {
          let testIdCard = this.testid(idCard);
          if(!testIdCard) {
            this.$message({
              message: "身份证填写错误，请检查！",
              type: "error"
            });
            return null;
          }
        }
        if(this.isClick) {
          return null;
        }
        this.isClick = true;
        try {
          const isUpdateOperation = this.isUpdateOperation;
          let leaveDateParam = leaveDate;
          let resignReasonParam = resignReason;
          if(!isDimission) {
            leaveDateParam = "";
            resignReasonParam = null;
          }
          await this.$axios.request({
            url: isUpdateOperation ? `${ EMPLOYEE }/${ empId }` : EMPLOYEE,
            method: isUpdateOperation ? this.$axios.method.PUT : this.$axios.method.POST,
            data: {
              empId,
              empName,
              deptId,
              positionIds: [posId],
              joinDate,
              leaveDate: leaveDateParam,
              jobTitle,
              phone,
              idCard,
              birthday,
              domicilePlace,
              height,
              academic,
              emergencyContact,
              emergencyPhone,
              description,
              isOnjob: isDimission ? 0 : 1,
              shift,
              isRejoin,
              isSpec,
              gender,
              resignReason: resignReasonParam
            }
          });
          this.$message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          this.getEmployeeList();
          this.dialogVisible = false;
        } finally {
          this.isClick = false;
        }
      },
      //验证身份证
      testid(id) {
        // true "验证通过!", false //校验不通过 // id为身份证号码
        const format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
        //号码规则校验
        if(!format.test(id)) {
          return false;
        }
        //区位码校验
        //出生年月日校验  前正则限制起始年份为1900;
        const year = id.substr(6, 4),//身份证年
          month = id.substr(10, 2),//身份证月
          date = id.substr(12, 2),//身份证日
          time = Date.parse(month + "-" + date + "-" + year),//身份证日期时间戳date
          now_time = Date.parse(new Date()),//当前时间戳
          dates = (new Date(year, month, 0)).getDate();//身份证当月天数
        if(time > now_time || date > dates) {
          return false;
        }
        //校验码判断
        const c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];  //系数
        const b = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"]; //校验码对照表
        const id_array = id.split("");
        let sum = 0;
        for(let k = 0; k < 17; k ++) {
          sum += parseInt(id_array[k]) * c[k];
        }
        return id_array[17].toUpperCase() === b[sum % 11].toUpperCase();
      },
      async downloadTemplate() {
        if(this.isClick) {
          return null;
        }
        this.isClick = true;
        this.templateDownloadLoading = true;
        try {
          await this.$axios.request({
            url: DOWLOAD_TEMPLATE,
            responseType: "blob"
          });
        } finally {
          this.isClick = false;
          this.templateDownloadLoading = false;
        }
      },
      async downloadExcel() {
        if(this.isClick) {
          return null;
        }
        this.isClick = true;
        this.excelDownloadLoading = true;
        try {
          const {
            searchDeptId: deptId = 49, deptDesc,
            searchResignReason: resignReason, searchIsOnjob: isOnjob, searchEmpId: empId,
            searchEmpName: empName, searchJoinDate: joinDate, searchLeaveDate: leaveDate
          } = this;
          const [joinStartDate, joinEndDate] = joinDate || [];
          const [leaveStartDate, leaveEndDate] = leaveDate || [];
          await this.$axios.request({
            url: DOWLOAD_EXCEL,
            responseType: "blob",
            params: {
              isAdditional: true,
              status: 1,
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
        } finally {
          this.isClick = false;
          this.excelDownloadLoading = false;
        }
      },
      async downloadPdf() {
        if(this.isClick) {
          return null;
        }
        this.isClick = true;
        this.pdfDownloadLoading = true;
        try {
          const {
            searchDeptId: deptId = 49, deptDesc,
            searchResignReason: resignReason, searchIsOnjob: isOnjob, searchEmpId: empId,
            searchEmpName: empName, searchJoinDate: joinDate, searchLeaveDate: leaveDate
          } = this;
          const [joinStartDate, joinEndDate] = joinDate || [];
          const [leaveStartDate, leaveEndDate] = leaveDate || [];
          await this.$axios.request({
            url: DOWNLOAD_PDF,
            responseType: "blob",
            params: {
              isAdditional: true,
              status: 1,
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
        } finally {
          this.isClick = false;
          this.pdfDownloadLoading = false;
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  #employee_file {
    display: flex;
    flex-direction: column;
    height: 100%;
    /*width: 100%;*/

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
