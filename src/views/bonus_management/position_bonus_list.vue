<template>
  <div id="position_bonus_list">
    <div class="header">
      <el-button @click="addAndUpdateBtnHandler(false)" style="background-color: #53C0B0;" type="primary"
                 icon="el-icon-plus">
        增加
      </el-button>
      <el-button @click="addAndUpdateBtnHandler(true)" style="background-color: #5BC0DE;" type="primary"
                 icon="el-icon-edit">
        更新
      </el-button>
      <delete-button :delete-callback="getBonusList" description-key="itemId" id-key="sid"
                     :selected-data="selectedData" :url="bonusURL" />
    </div>
    <div class="table">
      <table-box @current-change="selectedRow" :data="paginationData" highlight-current-row>
        <el-table-column
          min-width="80"
          prop="itemId"
          label="津貼項編號"
          align="center"
        />
        <el-table-column
          min-width="110"
          prop="itemDesc"
          label="津貼項描述"
          align="center"
        />
        <el-table-column
          min-width="70"
          prop="value"
          label="數額"
          align="center"
        />
        <el-table-column
          min-width="130"
          prop="posDesc"
          label="崗位名稱"
          align="center"
        />
        <el-table-column
          min-width="130"
          prop="deptDesc"
          label="部門名稱"
          align="center"
        />
        <el-table-column
          min-width="100"
          prop="dateFrom"
          label="開始時間"
          align="center"
          :formatter="dateFromFormatter"
        />
        <el-table-column
          min-width="100"
          prop="dateTo"
          label="結束時間"
          align="center"
          :formatter="dateToFormatter"
        />
      </table-box>
    </div>
    <el-pagination
      background
      :total="total"
      :page-sizes="[50, 100, 200]"
      layout="total, prev, pager, next, sizes"
      :current-page="pageNum"
      :page-size="pageSize"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
    <el-dialog width="30%" :title="`${isUpdateOperation ? '更新' : '新增'}崗位信息`" :visible.sync="dialogVisible">
      <div class="dialog-cell-item">
        <span class="span-distance">所屬部門</span>
        <department @input="deptChange" v-model="deptId"></department>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">崗位</span>
        <el-select v-model="posId" placeholder="崗位">
          <el-option
            :key="item.posId"
            :label="item.posDesc"
            :value="item.posId"
            v-for="item of positionList"
          />
        </el-select>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">津貼項</span>
        <el-select v-model="bonusItemId" placeholder="津貼項">
          <el-option
            :key="item.itemId"
            :value="item.itemId"
            :label="item.itemDesc"
            v-for="item of bonusItemList"
          />
        </el-select>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">數額</span>
        <el-input-number :min="0" style="width: 100%;" :controls="false"
                         v-model="value" placeholder="數額"></el-input-number>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">日期</span>
        <el-date-picker type="daterange" clearable style="width: 100%;" v-model="date"
                        range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyyMMdd" />
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button style="background-color: #418DCF;" type="primary" @click="addAndUpdateAxios">
          {{this.isUpdateOperation ? "更 新" : "确 定"}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { BONUS, POSITION, BONUS_ITEM } from "@/api/bonus";
  import { frontEndPagination } from "@/utils/utility_class";

  export default {
    name: "position_bonus_list",
    data() {
      return {
        isClick: false,
        //崗位津貼列表
        bonusList: [],
        //分頁之後顯示在表格中的數據
        paginationData: [],
        //崗位列表
        positionList: [],
        //津貼項列表
        bonusItemList: [],
        selectedData: null,
        pageNum: 1,
        pageSize: 50,
        isUpdateOperation: false,
        dialogVisible: false,
        //新增和更新請求參數
        deptId: undefined,
        posId: undefined,
        bonusItemId: undefined,
        value: 0,
        date: null
      };
    },
    computed: {
      total() {
        return this.bonusList.length;
      },
      bonusURL() {
        return BONUS;
      }
    },
    created() {
      this.getBonusList();
      this.getBonusItemList();
    },
    methods: {
      async getBonusList() {
        try {
          this.bonusList = await this.$axios.request({
            url: this.bonusURL
          });
          this.getPaginationData(this.pageNum, this.pageSize);
        } catch(e) {
          this.bonusList = [];
          this.paginationData = [];
        }
      },
      async getBonusItemList() {
        try {
          this.bonusItemList = await this.$axios.request({
            url: BONUS_ITEM,
            params: {
              itemType: 0
            }
          });
        } catch(e) {
          this.bonusItemList = [];
        }
      },
      addAndUpdateBtnHandler(isUpdateOperation) {
        if(isUpdateOperation) {
          if(!this.selectedData) {
            this.$message({
              message: "請選擇要修改的數據!",
              type: "error"
            });
            return null;
          }
          const { deptId, posId, itemId, value, dateFrom, dateTo } = this.selectedData;
          this.deptId = deptId;
          this.bonusItemId = itemId;
          this.value = value;
          this.date = [dateFrom, dateTo];
          this.deptChange();
          this.$nextTick(function() {
            this.posId = posId;
          });
        } else {
          this.deptId = undefined;
          this.posId = undefined;
          this.bonusItemId = undefined;
          this.value = 0;
          this.date = null;
        }
        this.isUpdateOperation = isUpdateOperation;
        this.dialogVisible = true;
      },
      async addAndUpdateAxios() {
        const { deptId, posId, bonusItemId, value, date, isUpdateOperation, bonusURL } = this;
        console.log(deptId, posId, bonusItemId, value, date);
        if(!deptId) {
          this.$message({
            message: "部門不允許為空!",
            type: "error"
          });
          return null;
        }
        if(!posId) {
          this.$message({
            message: "崗位不允許為空!",
            type: "error"
          });
          return null;
        }
        if(!bonusItemId) {
          this.$message({
            message: "津貼項不允許為空!",
            type: "error"
          });
          return null;
        }
        if(!value) {
          this.$message({
            message: "數額不允許為空!",
            type: "error"
          });
          return null;
        }
        if(!date) {
          this.$message({
            message: "日期不允許為空!",
            type: "error"
          });
          return null;
        }
        try {
          if(this.isClick) {
            return null;
          }
          this.isClick = true;
          const [dateFrom, dateTo] = date;
          const { request, method } = this.$axios;
          const url = isUpdateOperation ? `${ bonusURL }/${ this.selectedData.sid }` : bonusURL;
          await request({
            url,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: {
              deptId,
              posId,
              itemId: bonusItemId,
              value,
              dateFrom,
              dateTo
            }
          });
          this.$message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          this.dialogVisible = false;
          this.getBonusList();
        } finally {
          this.isClick = false;
        }
      },
      sizeChange(size) {
        this.pageSize = size;
        this.getPaginationData(this.pageNum, size);
      },
      pageChange(page) {
        this.pageNum = page;
        this.getPaginationData(page, this.pageSize);
      },
      getPaginationData(page, size) {
        this.paginationData = frontEndPagination(this.bonusList, page, size);
      },
      selectedRow(data) {
        this.selectedData = data;
      },
      dateFromFormatter(row) {
        return new Date(row.dateFrom).format("yyyy-MM-dd");
      },
      dateToFormatter(row) {
        return new Date(row.dateTo).format("yyyy-MM-dd");
      },
      async deptChange() {
        const deptId = this.deptId;
        if(deptId === undefined) {
          this.positionList = [];
          this.posId = undefined;
        } else {
          this.positionList = await this.$axios.request({
            url: POSITION,
            params: {
              deptId
            }
          });
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  #position_bonus_list {
    display: flex;
    flex-direction: column;
    height: 100%;

    .header {
      padding-bottom: 15px;
    }

    .table {
      height: 100%;
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
