<template>
  <div id="bonus_item_list">
    <div class="header">
      <el-button @click="addAndUpdateBtnHandler(false)" style="background-color: #53C0B0;" type="primary"
                 icon="el-icon-plus">
        增加
      </el-button>
      <el-button @click="addAndUpdateBtnHandler(true)" style="background-color: #5BC0DE;" type="primary"
                 icon="el-icon-edit">
        更新
      </el-button>
      <delete-button :delete-callback="getBonusItemList" description-key="itemId" id-key="itemId"
                     :selected-data="selectedData" :url="bonusItemURL" />
    </div>
    <div class="table">
      <table-box @current-change="selectedRow" :data="paginationData" highlight-current-row>
        <el-table-column
          min-width="200"
          prop="itemId"
          label="津貼項編號"
          align="center"
        ></el-table-column>
        <el-table-column
          min-width="200"
          prop="itemType"
          label="津貼項類型"
          align="center"
          :formatter="itemTypeFormatter"
        ></el-table-column>
        <el-table-column
          min-width="200"
          prop="itemDesc"
          label="津貼項描述"
          align="center"
        ></el-table-column>
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
    ></el-pagination>
    <el-dialog width="30%" :title="`${isUpdateOperation ? '更新' : '新增'}崗位信息`" :visible.sync="dialogVisible">
      <div class="dialog-cell-item">
        <span class="span-distance">津貼項編號</span>
        <el-input :readonly="isUpdateOperation" v-model="itemId" placeholder="津貼項編號"></el-input>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">津貼項類型</span>
        <el-select  default-first-option filterable v-model="itemType" placeholder="津貼項類型">
          <el-option
            :key="item.itemType"
            :label="item.title"
            :value="item.itemType"
            v-for="item of itemTypeList"
          ></el-option>
        </el-select>
      </div>
      <div class="dialog-cell-item">
        <span class="span-distance">津貼項描述</span>
        <el-input v-model="itemDesc" placeholder="津貼項描述"></el-input>
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
  import { BONUS_ITEM } from "@/api/bonus";
  import { frontEndPagination } from "@/utils/utility_class";

  export default {
    name: "bonus_item_list",
    data() {
      return {
        //津貼項列表
        bonusItemList: [],
        //分頁之後顯示在表格中的數據
        paginationData: [],
        //津貼項類型
        itemTypeList: [{
          title: "崗位津貼項",
          itemType: 0
        }, {
          title: "員工津貼項",
          itemType: 1
        }],
        selectedData: null,
        pageNum: 1,
        pageSize: 50,
        isUpdateOperation: false,
        dialogVisible: false,
        //新增和更新請求參數
        itemId: "",
        itemType: undefined,
        itemDesc: ""
      };
    },
    computed: {
      total() {
        return this.bonusItemList.length;
      },
      bonusItemURL() {
        return BONUS_ITEM;
      }
    },
    created() {
      this.getBonusItemList();
    },
    methods: {
      async getBonusItemList() {
        try {
          this.bonusItemList = await this.$axios.request({
            url: this.bonusItemURL
          });
          this.getPaginationData(this.pageNum, this.pageSize);
        } catch(e) {
          this.bonusItemList = [];
          this.paginationData = [];
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
          const { itemId, itemDesc, itemType } = this.selectedData;
          this.itemId = itemId;
          this.itemDesc = itemDesc;
          this.itemType = itemType;
        } else {
          this.itemId = "";
          this.itemDesc = "";
          this.itemType = undefined;
        }
        this.isUpdateOperation = isUpdateOperation;
        this.dialogVisible = true;
      },
      async addAndUpdateAxios() {
        const { itemId, itemDesc, itemType, bonusItemURL, isUpdateOperation } = this;
        if(itemId.trim().length === 0) {
          this.$message({
            message: "津貼項編號不允許為空!",
            type: "error"
          });
          return null;
        }
        if(typeof itemType === "undefined") {
          this.$message({
            message: "津貼項類型不允許為空!",
            type: "error"
          });
          return null;
        }
        if(itemDesc.trim().length === 0) {
          this.$message({
            message: "津貼項描述不允許為空!",
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
          const url = isUpdateOperation ? `${ bonusItemURL }/${ this.selectedData.itemId }` : bonusItemURL;
          await request({
            url,
            method: isUpdateOperation ? method.PUT : method.POST,
            data: {
              itemType,
              itemId,
              itemDesc
            }
          });
          this.$message({
            message: isUpdateOperation ? "更新成功" : "新增成功"
          });
          this.dialogVisible = false;
          this.getBonusItemList();
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
        this.paginationData = frontEndPagination(this.bonusItemList, page, size);
      },
      selectedRow(data) {
        this.selectedData = data;
      },
      itemTypeFormatter(row) {
        return row.itemType === 0 ? "崗位津貼項" : "員工津貼項";
      }
    }
  };
</script>

<style lang="less" scoped>
  #bonus_item_list {
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
