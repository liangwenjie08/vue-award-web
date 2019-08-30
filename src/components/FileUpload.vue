<template>
  <el-button :loading="loading" style="background-color: #418DCF;position: relative;" type="primary"
             icon="el-icon-upload2">
    <input
      ref="fileUpload"
      style="position: absolute;top: 0;left: 0;opacity: 0;width: 100%;height: 100%;cursor: pointer;font-size: 0;"
      type="file"
      @input="fileChange" />
    {{ description }}
  </el-button>
</template>

<script>
  export default {
    name: "FileUpload",
    props: {
      url: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: "批量録入"
      }
    },
    data() {
      return {
        isClick: false,
        loading: false
      };
    },
    methods: {
      fileChange() {
        if(this.isClick) {
          return null;
        }
        this.isClick = true;
        //获取文件
        const file = this.$refs.fileUpload.files[0];
        if(file) {
          this.fileUploadAxios(file);
        } else {
          this.isClick = false;
        }
      },
      async fileUploadAxios(file) {
        this.loading = true;
        const formData = new FormData();
        formData.append("file", file);
        try {
          await this.$axios.request({
            url: this.url,
            method: this.$axios.method.POST,
            data: formData
          });
          this.$message({
            message: "上傳成功"
          });
        } finally {
          this.isClick = false;
          this.loading = false;
        }
      }
    }
  };
</script>
