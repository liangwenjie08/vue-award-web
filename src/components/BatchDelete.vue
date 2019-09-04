<template>
  <el-popover
    placement="top"
    width="160"
    v-model="deleteConfirmVisible"
    style="margin-left: 10px;margin-right: 10px;">
    <p>
      确定删除吗？
    </p>
    <div style="text-align: right; margin: 0">
      <el-button type="text" @click="deleteConfirmVisible = false">取消</el-button>
      <el-button type="primary" style="background-color: red;margin-left: 20px;" size="mini"
                 @click="deleteConfirm">
        确定
      </el-button>
    </div>
    <el-button :loading="loading" slot="reference" style="background-color: red;outline: none;" type="primary"
               icon="el-icon-delete-solid">
      刪除
    </el-button>
  </el-popover>
</template>

<script>
  export default {
    name: "BatchDelete",
    props: {
      url: {
        required: true,
        type: String
      },
      selectedData: {
        type: Array,
        required: true
      },
      idKey: {
        required: true,
        type: String
      },
      deleteCallback: {
        type: Function,
        required: true
      },
      isReal: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isClick: false,
        deleteConfirmVisible: false,
        loading: false
      };
    },
    methods: {
      async deleteConfirm() {
        if(this.selectedData.length === 0) {
          this.$message({
            message: "請選擇需要刪除的數據!",
            type: "error"
          });
          return null;
        }
        if(this.isClick) {
          return null;
        }
        this.isClick = true;
        this.loading = true;
        try {
          const { selectedData, idKey, url, isReal } = this;
          const length = selectedData.length;
          let ids = "";
          for(let i = 0; i < length; i ++) {
            const item = selectedData[i];
            ids += item[idKey];
            if(i < length - 1) {
              ids += ",";
            }
          }
          const { request, method } = this.$axios;
          await this.$axios.request({
            url,
            method: method.DELETE,
            params: {
              ids,
              isReal
            }
          });
          this.$message({
            message: "刪除成功"
          });
          this.deleteCallback();
        } finally {
          this.isClick = false;
          this.deleteConfirmVisible = false;
          this.loading = false;
        }
      }
    }
  };
</script>
