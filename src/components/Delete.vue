<template>
  <el-popover
    placement="top"
    width="160"
    v-model="deleteConfirmVisible"
    style="margin-left: 10px;margin-right: 10px;">
    <p>
      确定删除<strong>{{ getDescription }}</strong>吗？
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
    name: "Delete",
    props: {
      url: {
        required: true,
        type: String
      },
      selectedData: {
        required: true
      },
      idKey: {
        required: true,
        type: String
      },
      descriptionKey: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        isClick: false,
        deleteConfirmVisible: false,
        loading: false
      };
    },
    computed: {
      getDescription() {
        if(this.selectedData) {
          return this.selectedData[this.descriptionKey];
        } else {
          return null;
        }
      }
    },
    methods: {
      async deleteConfirm() {
        if(!this.selectedData) {
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
          const { selectedData, idKey, url } = this;
          const { request, method } = this.$axios;
          await this.$axios.request({
            url: `${ url }/${ selectedData[idKey] }`,
            method: method.DELETE
          });
          this.$message({
            message: "刪除成功"
          });
        } finally {
          this.isClick = false;
          this.deleteConfirmVisible = false;
          this.loading = false;
        }
      }
    }
  };
</script>

<style scoped>

</style>
