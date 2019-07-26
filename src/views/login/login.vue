<template>
  <div id="login">
    <div class="card">
      <el-input
        prefix-icon="el-icon-user-solid"
        class="e-input"
        placeholder="用户名"
        v-model="username"
      />
      <el-input
        show-password
        prefix-icon="el-icon-lock"
        class="e-input"
        placeholder="密码"
        v-model="password"
      />
      <el-button type="primary" @click="login()" class="e-button">
        登录
      </el-button>
    </div>
  </div>
</template>

<script>
  import { LOGIN } from "@/api/loginAPI";

  export default {
    name: "login",
    data: function() {
      return {
        username: "",
        password: ""
      };
    },
    methods: {
      async login() {
        if(this.username.length !== 0 && this.password.length !== 0) {
          let formDate = new FormData();
          formDate.append("grant_type", "password");
          formDate.append("username", this.username);
          formDate.append("password", this.password);
          try {
            const response = await this.$axios.request({
              url: LOGIN,
              method: this.$axios.method.POST,
              headers: {
                // "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic c2VjdXJpdHktc2VydmljZToxMjM0NTY="
              },
              data: formDate
            });
            console.log(response);
          } finally {
            console.log("finally");
          }
          // this.$router.replace("/home");
        } else {
          console.log("密码为空");
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  @containerColor: #1d2935;
  @cardColor: #2b3b4a;
  @cardPadding: 20px;
  @cardWidth: 250px;
  @cardHeight: 200px;

  #login {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: @containerColor;

    .card {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      height: @cardHeight;
      width: @cardWidth;
      background-color: @cardColor;
      border: none;
      padding: @cardPadding;
    }

    .e-button {
      background-color: red;
      border: none;
      width: 100%;
      font-size: 1rem;
    }
  }
</style>
