<template>
  <el-button :loading="loading" @click="downloadFile" style="background-color: #418DCF;"
             type="primary" icon="el-icon-download">
    {{ description }}
  </el-button>
</template>

<script>
  export default {
    name: "FileDownload",
    props: {
      url: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: "模板下載"
      },
      params: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    data() {
      return {
        isClick: false,
        loading: false
      };
    },
    methods: {
      async downloadFile() {
        if(this.isClick) {
          return null;
        }
        this.isClick = true;
        this.loading = true;
        try {
          await this.$axios.request({
            url: this.url,
            responseType: "blob",
            params: {
              ...this.params
            }
          });
        } finally {
          this.isClick = false;
          this.loading = false;
        }
      }
    }
  };
</script>
